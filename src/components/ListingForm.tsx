import { FC, useState, useEffect } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { defaultCurve, HGamalSuite } from '@medusa-network/medusa-sdk'

import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { parseEther } from 'ethers/lib/utils'
import storeCiphertext from '@/lib/storeCiphertext'
import useGlobalStore from '@/stores/globalStore'
import { EVMCipher } from '@medusa-network/medusa-sdk/lib/hgamal'
import { Base64 } from 'js-base64'

const ListingForm: FC = () => {
  const keypair = useGlobalStore((state) => state.keypair)
  const medusaKey = useGlobalStore((state) => state.medusaKey)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const [plaintext, setPlaintext] = useState('')
  const [ciphertextKey, setCiphertextKey] = useState<EVMCipher>()
  const [cid, setCid] = useState('')

  const { config, error: prepareError, isError: isPrepareError, isSuccess: readyToSendTransaction } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createListing',
    args: [ciphertextKey, name, description, parseEther(price || '0.00'), `ipfs://${cid}/${name}`],
    enabled: Boolean(cid),
    chainId: arbitrumGoerli.id
  })

  const { data, error, isError, write: createListing } = useContractWrite(config)

  useEffect(() => {
    if (readyToSendTransaction) {
      createListing?.()
      setCid('')
    }
  }, [readyToSendTransaction]);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    console.log("Submitting new listing");

    const suite = new HGamalSuite(defaultCurve)
    const buff = new TextEncoder().encode(plaintext.padEnd(32, "\0"));
    try {
      const bundle = (await suite.encryptToMedusa(buff, medusaKey))._unsafeUnwrap();
      setCiphertextKey(bundle.encryptedKey.toEvm())
      const encodedCiphertext = Base64.encode(new TextDecoder('utf8').decode(bundle.encryptedData))
      const cid = await storeCiphertext(name, encodedCiphertext)
      setCid(cid)
      console.log(createListing)
    } catch (e) {
      console.log("Encryption or storeCiphertext API call Failed: ", e);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">Create a Listing</h1>
      <form onSubmit={handleSubmit}>
        <label className="py-3 block">
          <textarea
            required
            className="form-textarea mt-1 block w-full h-24 dark:bg-gray-800 dark:text-white"
            rows={3}
            placeholder="Enter your content"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          ></textarea>
        </label>
        <div className="flex flex-row space-x-5 mt-5">
          <div>
            <label className="block">
              <span className="text-lg font-mono font-light dark:text-white my-4">Name</span>
              <input
                required
                type="text"
                placeholder="dEaD-creds.txt"
                className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="block">
              <span className="text-lg font-mono font-light dark:text-white my-4">Price</span>
              <input
                required
                type="number"
                placeholder="ETH"
                className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="">
          <span className="text-lg font-mono font-light dark:text-white my-4">Description</span>
          <label className="py-3 block">
            <textarea
              required
              className="form-textarea mt-1 block w-full h-24 dark:bg-gray-800 dark:text-white"
              rows={3}
              placeholder="Buy access to the private key for the 0xdEaD address"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
        </div>
        <div

          className="text-center w-full"
        >
          <button
            type="submit"
            disabled={isLoading || !keypair || !medusaKey}
            className="font-mono font-semibold mt-5 text-xl text-white py-4 px-4 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
          >
            {isLoading ? 'Submitting...' : keypair ? 'Sell your Secret' : 'Please sign in'}
          </button>
        </div>
        {(isPrepareError || isError) && (
          <div>Error: {(prepareError || error)?.message}</div>
        )}
      </form >
      {
        isSuccess && (
          <div>
            Successfully listed your ciphertext!
            <div>
              <a href={`https://goerli.arbiscan.io/tx/${data?.hash}`}>Etherscan</a>
            </div>
          </div>
        )
      }
    </>
  )
}

export default ListingForm
