import { FC, useEffect } from 'react'
import { useAccount, useContract, useContractRead, useProvider } from 'wagmi'
import { EVMPoint, HGamalEVM, PublicKey, SecretKey, init } from '@medusa-network/medusa-sdk'
import { G1 } from '@medusa-network/medusa-sdk/lib/bn254'

import { APP_NAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import Signin from '@/components/Signin'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import ListingForm from '@/components/ListingForm'
import Listings from '@/components/Listings'
import { Listing, Sale, Decryption, default as useGlobalStore } from '@/stores/globalStore'
import { ethers } from 'ethers'
import PurchasedSecrets from '@/components/PurchasedSecrets'

const Home: FC = () => {
  const provider = useProvider()
  const { isConnected, address } = useAccount()

  const updateMedusaKey = useGlobalStore((state) => state.updateMedusaKey)
  const medusaKey = useGlobalStore((state) => state.medusaKey)
  const updateListings = useGlobalStore((state) => state.updateListings)
  const updateSales = useGlobalStore((state) => state.updateSales)
  const updateDecryptions = useGlobalStore((state) => state.updateDecryptions)

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

      if (!address) return

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
    }
    getEvents()
  }, [address])

  return (
    <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
      <div className="absolute top-6 right-6">
        {isConnected ? <Signin /> : <ConnectWallet />}
      </div>
      <ThemeSwitcher className="absolute bottom-6 right-6" />
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-center pt-8 sm:justify-start sm:pt-0 my-7">
          <h1 className="text-6xl font-mono font-bold dark:text-white">{APP_NAME.toLowerCase()}</h1>
          <p className="text-xl mt-10 text-center font-light dark:text-gray-200">by Medusa</p>
        </div>
        <ListingForm />
        <PurchasedSecrets />
        <Listings />

      </div>
    </div>
  )
}

export default Home
