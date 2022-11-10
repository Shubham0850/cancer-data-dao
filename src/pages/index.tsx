import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import { useAccount, useContract, useContractEvent, useContractRead, useProvider } from 'wagmi'
import { EVMPoint, HGamalEVM, PublicKey, SecretKey, init } from '@medusa-network/medusa-sdk'
import { G1 } from '@medusa-network/medusa-sdk/lib/bn254_iden'

import { APP_NAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import Signin from '@/components/Signin'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import ListingForm from '@/components/ListingForm'
import Listings from '@/components/Listings'
import { Listing, Sale, Decryption, default as useGlobalStore } from '@/stores/globalStore'
import { ethers } from 'ethers'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'
import { useTheme } from 'next-themes'

const Home: FC = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // Necessary to avoid "Hyrdation Mismatch" between server and client
  useEffect(() => {
    setMounted(true)
  }, [])

  const provider = useProvider()

  const { address } = useAccount()

  const updateMedusaKey = useGlobalStore((state) => state.updateMedusaKey)
  const medusaKey = useGlobalStore((state) => state.medusaKey)
  const updateListings = useGlobalStore((state) => state.updateListings)
  const updateSales = useGlobalStore((state) => state.updateSales)
  const updateDecryptions = useGlobalStore((state) => state.updateDecryptions)
  const addListing = useGlobalStore((state) => state.addListing)
  const addSale = useGlobalStore((state) => state.addSale)
  const addDecryption = useGlobalStore((state) => state.addDecryption)

  useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'publicKey',
    watch: false,
    enabled: !Boolean(medusaKey),
    onSuccess: async (medusaKey: EVMPoint) => {
      await init()
      try {
        const key = new G1().fromEvm(medusaKey)._unsafeUnwrap()
        console.log('Retrieved key from medusa oracle', key)
        updateMedusaKey(key)
      } catch (e) {
        console.log("Failed to convert medusa key from EVMPoint: ", e);
      }
    },
    onError: (e: any) => {
      console.log('Error requesting medusa key from contract', e)
    }
  })

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'NewListing',
    listener(seller, cipherId, name, description, price, uri) {
      addListing({ seller, cipherId, name, description, price, uri })
    },
  })

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'NewSale',
    listener(buyer, seller, requestId, cipherId) {
      if (buyer === address) {
        addSale({ buyer, seller, requestId, cipherId })
      }
    },
  })

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ListingDecryption',
    listener(requestId, ciphertext) {
      addDecryption({ requestId, ciphertext })
    },
  })


  const medusaFans = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    signerOrProvider: provider
  })

  useEffect(() => {
    const getEvents = async () => {
      const iface = new ethers.utils.Interface(CONTRACT_ABI)

      const newListingFilter = medusaFans.filters.NewListing()
      const newListings = await medusaFans.queryFilter(newListingFilter)

      if (iface && newListings) {
        const listings = newListings.reverse().map((filterTopic: any) => {
          const result = iface.parseLog(filterTopic)
          const { seller, cipherId, name, description, price, uri } = result.args
          return { seller, cipherId, name, description, price, uri } as Listing
        })
        updateListings(listings)
      }

      const newSaleFilter = medusaFans.filters.NewSale(address)
      const newSales = await medusaFans.queryFilter(newSaleFilter)

      if (iface && newSales) {
        const sales = newSales.reverse().map((filterTopic: any) => {
          const result = iface.parseLog(filterTopic)
          const { buyer, seller, requestId, cipherId } = result.args
          return { buyer, seller, requestId, cipherId } as Sale
        })
        updateSales(sales)
      }

      const listingDecryptionFilter = medusaFans.filters.ListingDecryption()
      const listingDecryptions = await medusaFans.queryFilter(listingDecryptionFilter)

      if (iface && listingDecryptions) {
        const decryptions = listingDecryptions.reverse().map((filterTopic: any) => {
          const result = iface.parseLog(filterTopic)
          const { requestId, ciphertext } = result.args
          return { requestId, ciphertext } as Decryption
        })
        updateDecryptions(decryptions)
      }
    }
    getEvents()
  }, [address])

  return (
    <>
      <Head>
        <title>{`Medusa - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Toaster
        position="top-center"
        reverseOrder={true}
      />

      <Header />

      <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex pt-8 justify-center sm:pt-0 my-7">
            <h1 className="text-6xl font-mono font-light dark:text-white">{APP_NAME}</h1>

          </div>
          <div className="flex justify-center sm:pt-0 my-7">
            <p className="text-lg font-mono font-light dark:text-white ml-2">Encrypt & upload your content and set your price for people to see it!</p>
          </div>

          <ListingForm />

          <PurchasedSecrets />

          <Listings />

        </div>
      </div>
    </>
  )
}

export default Home
