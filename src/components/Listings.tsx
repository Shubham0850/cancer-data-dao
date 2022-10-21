import { FC } from 'react'

import useGlobalStore from '@/stores/globalStore'
import Listing from './Listing'

const Listings: FC = () => {
  const listings = useGlobalStore((state) => state.listings)

  return <>
    <h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">Buy Secrets</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full transition-all">
      {listings.map(listing => <Listing key={listing.cipherId.toNumber()} {...listing} />)}
    </div>
  </>
}

export default Listings
