import { FC, useState, useEffect } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { suite, HGamalSuite, Label } from '@medusa-network/medusa-sdk'

import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { parseEther } from 'ethers/lib/utils'
import storeCiphertext from '@/lib/storeCiphertext'
import useGlobalStore from '@/stores/globalStore'
import { EVMCipher } from '@medusa-network/medusa-sdk/lib/hgamal'
import { Base64 } from 'js-base64'
import toast from 'react-hot-toast'
import { ipfsGatewayLink } from '@/lib/utils'
import { sendDataToIPFS, sendDataToIpfsWeb3Storage } from '@/lib/PostData'

const ListingForm: FC = () => {
  const keypair = useGlobalStore((state) => state.keypair)
  const medusaKey = useGlobalStore((state) => state.medusaKey)
  const { address } = useAccount()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const [plaintext, setPlaintext] = useState('')
  const [file, setFile] = useState<File>()
  const [ciphertextKey, setCiphertextKey] = useState<EVMCipher>()
  const [cid, setCid] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
      toast.loading("Submitting secret to Medusa...")
      createListing?.()
      setCid('')
    }
  }, [readyToSendTransaction]);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (txData) => {
      toast.dismiss()
      toast.success(
        <a
          href={`https://goerli.arbiscan.io/tx/${txData.transactionHash}`}
          className="inline-flex items-center text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Secret successfully submitted to Medusa! View on Etherscan
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
        </a>

      )
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Failed to submit secret to Medusa: ${e.message}`)
    }
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSubmitting(true)
    console.log("Submitting new listing");

    const hgamalSuite = new HGamalSuite(suite)
    const buff = new TextEncoder().encode(plaintext)
    
      const label = Label.from(medusaKey, CONTRACT_ADDRESS, address);
      const bundle = (await hgamalSuite.encryptToMedusa(buff, medusaKey, label))._unsafeUnwrap();
      setCiphertextKey(bundle.encryptedKey.toEvm())
      const encodedCiphertext = Base64.fromUint8Array(bundle.encryptedData);

      console.log("encoded ciphertext: 😇", encodedCiphertext)

      // uploading encoded ciphertext to ipfs
      // const IPFSHash = await sendDataToIpfsWeb3Storage("just upload");

      // console.log("ipfs cid: ✅", IPFSHash)

      toast.promise(
        storeCiphertext(name, encodedCiphertext),
        {
          loading: 'Uploading encrypted secret to IPFS...',
          success: (cid) => {
            setCid(cid)
            return <a
              href={ipfsGatewayLink(cid)}
              className="inline-flex items-center text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              View secret on IPFS
              <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
            </a>
          },
          error: (error) => {
            console.log(error)
            return `Error uploading to IPFS: ${error.message}`
          }
        }
      )
    
    setSubmitting(false)
  }

  const handleFileChange = (event: any) => {
    toast.success("File uploaded successfully!")
    const file = event.target.files[0]
    setName(file.name)
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const plaintext = event.target?.result as string
      setPlaintext(plaintext)
    }
    reader.onerror = (error) => {
      console.log('File Input Error: ', error);
    };
  }

  return (
    <>
      <form className="max-w-[500px]" onSubmit={handleSubmit}>
        <div className="">
          <label className="w-64 flex flex-col items-center px-4 py-6 rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-gray-800 hover:text-white dark:hover:text-blue-400">
            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">{name ?? "SELECT A FILE"}</span>
            <input type='file' className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="pt-3">
          <label className="block">
            <span className="text-lg font-light dark:text-white">Name</span>
            <input
              required
              type="text"
              placeholder="dEaD-creds.txt"
              className="form-input block w-full dark:bg-gray-800 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        <div className="pt-3">
          <label className="block">
            <span className="text-lg font-light dark:text-white">Price</span>
            <input
              required
              type="number"
              placeholder="ETH"
              className="form-input block w-full dark:bg-gray-800 dark:text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>

        <div className="pt-3">
          <span className="text-lg font-light dark:text-white my-4">Description</span>
          <label className=" block">
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
            disabled={isLoading || submitting || !keypair || !medusaKey}
            className="btns mt-5"
          >
            {isLoading || submitting ? 'Submitting...' : keypair ? 'Upload to Cure DAO' : 'Please sign in'}
          </button>
        </div>
        {
          (isPrepareError || isError) && (
            <div>Error: {(prepareError || error)?.message}</div>
          )
        }
      </form >
    </>
  )
}

export default ListingForm
