import { FC, useEffect } from 'react'
import { useAccount, useContract, useContractEvent, useProvider } from 'wagmi'
import { EVMPoint, HGamalEVM, PublicKey, SecretKey, init } from '@medusa-network/medusa-sdk'
import { G1 } from '@medusa-network/medusa-sdk/lib/bn254'

import { APP_NAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import useGlobalStore from '@/stores/globalStore'
import { ethers } from 'ethers'
import Listing from './Listing'

const Listings: FC = () => {
  const { isConnected } = useAccount()

  const listings = useGlobalStore((state) => state.listings)

  // useContractEvent({
  //   address: CONTRACT_ADDRESS,
  //   abi: CONTRACT_ABI,
  //   eventName: 'NewListing',
  //   listener(seller, cipherId, name, description, price, uri) {
  //     console.log(seller, cipherId, name, description, price, uri)
  //   },
  // })



  return <>
    <h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">Buy Secrets</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full">
      {listings.map(listing => <Listing key={listing.cipherId.toNumber()} {...listing} />)}
    </div>
  </>
}

// <div className="flex flex-row mt-10 space-x-5">

// <div class="w-full p-4 bg-yellow-400">
//     Column 1
// </div>
// <div class="w-full p-4 bg-gray-400">
//     Column 2
// </div>
// <div class="w-full 2xl:hidden p-4 bg-blue-400">
//     Column 3
// </div>

export default Listings
