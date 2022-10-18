import { FC, useState } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'

import { CIPHERTEXT_FILENAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { parseEther } from 'ethers/lib/utils'
import storeCiphertext from '@/lib/storeCiphertext'
import useGlobalStore from '@/stores/globalStore'

const SubmitPlaintextForm: FC = () => {
  const keypair = useGlobalStore((state) => state.keypair)

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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label className="py-3 block">
          <span className="text-xl dark:text-white">Plaintext</span>
          <textarea
            required
            className="form-textarea mt-1 block w-full h-24 dark:bg-gray-800 dark:text-white"
            rows={3}
            placeholder="Enter your content"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          ></textarea>
        </label>
        <label className="py-5 block">
          <span className="text-xl dark:text-white">Price</span>
          <input
            required
            type="number"
            placeholder="ETH"
            className="form-input mt-1 block w-full dark:bg-gray-800 dark:text-white"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={!createListing || isLoading}
          className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form >
      {isSuccess && (
        <div>
          Successfully listed your ciphertext!
          <div>
            <a href={`https://goerli.arbiscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </>
  )
}

export default SubmitPlaintextForm
