import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import useGlobalStore, { Sale } from '@/stores/globalStore'
import { suite, EncryptionBundle, HGamalEVM, HGamalSuite, HGamalCipher } from '@medusa-network/medusa-sdk'
import { BigNumber } from 'ethers'
import { arrayify, formatEther, hexZeroPad } from 'ethers/lib/utils'
import { Base64 } from 'js-base64'
import { ipfsGatewayLink } from '@/lib/utils'

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

  const [plaintext, setPlaintext] = useState('Sign in to decrypt this secret')
  const [downloadLink, setDownloadLink] = useState('')

  useEffect(() => {
    const decryptContent = async () => {
      if (!decryption || !keypair) return

      const { ciphertext } = decryption

      console.log("Downloading encrypted content from ipfs")
      const ipfsDownload = ipfsGatewayLink(listing.uri)
      const response = await fetch(ipfsDownload)
      const encryptedContents = await response.text()

      // Base64 decode into Uint8Array
      const encryptedData = Base64.toUint8Array(encryptedContents)

      const hgamalSuite = new HGamalSuite(suite)

      // Convert bignumber to hexstring, pad to 64 characters (32 bytes), convert to byte array
      const evmCipherArray = bnToArray(ciphertext.cipher, false, 32)
      const evmCipher = new HGamalEVM(ciphertext.random, evmCipherArray, ciphertext.random2, ciphertext.dleq)

      // Convert the ciphertext to a format that the Medusa SDK can use
      const cipher = HGamalCipher.default(suite).fromEvm(evmCipher)._unsafeUnwrap()

      // Create bundle with encrypted data and extraneous cipher (not used)
      const bundle = new EncryptionBundle(encryptedData, cipher)

      // Decrypt
      try {
        const decryptionRes = await hgamalSuite.decryptFromMedusa(keypair.secret, medusaKey, bundle, cipher)
        // Decode to string
        const msg = new TextDecoder().decode(decryptionRes._unsafeUnwrap())
        setPlaintext(msg)
        if (isFile(msg)) {
          const fileData = msg.split(',')[1]
          setDownloadLink(window.URL.createObjectURL(
            new Blob([Base64.toUint8Array(fileData)]),
          ))
        } else {
          setDownloadLink(window.URL.createObjectURL(
            new Blob([msg]),
          ))
        }

      } catch (e) {
        setPlaintext("Decryption failed")
      }
    }
    decryptContent()
  }, [decryption, keypair, medusaKey, listing.uri])

  const isFile = (data: string) => {
    return data.startsWith('data:')
  }

  const isImage = (data: string): Boolean => {
    return data.startsWith('data:image')
  }

  return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{listing.name}</h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{listing.description}</p>
      <p className="mb-3">{BigNumber.from(0).eq(listing.price) ? "Free" : `${formatEther(listing.price)} ETH`} </p>
      <a href={downloadLink} download={listing.name} className="inline-flex items-center text-blue-600 hover:underline">
        Download
        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
      </a>

      <a href={ipfsGatewayLink(listing.uri)} target="_blank" className="inline-flex items-center text-blue-600 hover:underline" rel="noreferrer">
        View Encrypted on IPFS
        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
      </a>
      {plaintext && isImage(plaintext) ?
        <Image src={plaintext} width={300} height={300} alt="Decrypted Image" /> :
        <textarea
          readOnly
          disabled
          className="form-textarea mt-1 block w-full h-24 dark:bg-gray-800 dark:text-white"
          rows={3}
          placeholder="Encrypted Content"
          value={plaintext}
        />
      }
    </div>
  )
}

export default Unlocked