import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import useGlobalStore, { Sale } from '@/stores/globalStore'
import { defaultCurve, EncryptionBundle, HGamalEVM, HGamalSuite } from '@medusa-network/medusa-sdk'
import { newCiphertext } from '@medusa-network/medusa-sdk/lib/hgamal'
import { BigNumber } from 'ethers'
import { arrayify, formatEther, hexZeroPad } from 'ethers/lib/utils'
import { Base64 } from 'js-base64'
import { FC } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'

function bnToArray(
  big: BigNumber,
  reverse = false,
  padToLength = 0
): Uint8Array {
  const arr = arrayify(
    padToLength > 0
      ? hexZeroPad(big.toHexString(), padToLength)
      : big.toHexString()
  );

  if (reverse) {
    return arr.reverse();
  }

  return arr;
}

const Unlocked: FC<Sale> = ({ buyer, seller, requestId, cipherId }) => {
  const keypair = useGlobalStore((state) => state.keypair)
  const medusaKey = useGlobalStore((state) => state.medusaKey)

  const listings = useGlobalStore((state) => state.listings)
  const decryptions = useGlobalStore((state) => state.decryptions)

  const listing = listings.find((listing) => listing.cipherId.eq(cipherId))
  const decryption = decryptions.find((d) => d.requestId.eq(requestId))

  const decryptContent = async () => {
    if (!decryption || !keypair) return

    const { ciphertext } = decryption

    const ipfsDownload = `https://w3s.link/ipfs/${listing.uri.replace('ipfs://', '')}`
    const response = await fetch(ipfsDownload)
    const encryptedContents = await response.text()
    console.log("Encrypted contents", encryptedContents)

    // Base64 decode and then convert to Uint8Array
    const encryptedData = new TextEncoder().encode(Base64.decode(encryptedContents))
    console.log(encryptedData)
    const suite = new HGamalSuite(defaultCurve)

    // Convert bignumber to hexstring, pad to 64 characters, convert to byte array, reverse 
    const evmCipherArray = bnToArray(decryption.ciphertext.cipher, true, 32)
    const evmCipher = new HGamalEVM(decryption.ciphertext.random, evmCipherArray)

    // Convert the ciphertext to a format that the Medusa SDK can use
    const cipher = newCiphertext(defaultCurve).fromEvm(evmCipher)._unsafeUnwrap()
    console.log("Cipher", cipher)

    // Create bundle with encrypted data and extraneous cipher (not used)
    const bundle = new EncryptionBundle(encryptedData, cipher)

    // Decrypt ==> Errors... wtf
    const decryptionRes = await suite.decryptFromMedusa(keypair.secret, medusaKey, bundle, cipher)
    console.log("Decryption result", decryptionRes)

    // Decode to string and remove padding
    const msg = new TextDecoder().decode(decryptionRes._unsafeUnwrap()).replaceAll("\0", "")
    console.log("Decrypted contents", msg)
  }
  decryptContent()

  return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{listing.name}</h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{listing.description}</p>
      <p className="mb-3">{BigNumber.from(0).eq(listing.price) ? "Free" : `${formatEther(listing.price)} ETH`} </p>
      <a href={listing.uri} target="_blank" className="inline-flex items-center text-blue-600 hover:underline" rel="noreferrer">
        View on IPFS
        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
      </a>
    </div>
  )
}

export default Unlocked
