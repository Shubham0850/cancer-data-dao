import { FC, useState } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'

import { CIPHERTEXT_FILENAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { parseEther } from 'ethers/lib/utils'
import storeCiphertext from '@/lib/storeCiphertext'
import useGlobalStore from '@/stores/globalStore'

const ListingForm: FC = () => {
  const keypair = useGlobalStore((state) => state.keypair)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const [plaintext, setPlaintext] = useState('')
  const [ciphertextKey, setCiphertextKey] = useState('')
  const [cid, setCid] = useState('')

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createListing',
    args: [parseEther(price || '0.00'), ciphertextKey, `ipfs://${cid}/${CIPHERTEXT_FILENAME}`],
    enabled: Boolean(cid),
  })

  const { data, write: createListing } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    // TODO: Encrypt Plaintext
    const ciphertext = plaintext

    // TODO: Encrypt ciphertext key to the oracle's public key
    setCiphertextKey('')

    const cid = await storeCiphertext(ciphertext)
    setCid(cid)
    createListing?.()
  }

  // <span className="text-xl dark:text-white">Price</span>
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
              onChange={(e) => setPlaintext(e.target.value)}
            ></textarea>
          </label>
        </div>
        <div

          className="text-center w-full"
        >
          <button
            type="submit"
            disabled={!createListing || isLoading}
            className="transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer font-mono font-semibold mt-5 text-xl text-white py-4 px-4 rounded-sm"
          >
            {isLoading ? 'Submitting...' : 'Sell your Secret'}
          </button>
        </div>
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
