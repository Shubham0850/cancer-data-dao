import { FC } from 'react'
import { useAccount } from 'wagmi'

import useGlobalStore from '@/stores/globalStore'
import Unlocked from './Unlocked'

const PurchasedSecrets: FC = () => {
  const { address } = useAccount()
  const sales = useGlobalStore((state) => state.sales)

  return <>
    <h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">Purchased Secrets</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 w-full transition-all">
      {sales.filter(sale => sale.buyer == address).map(sale => <Unlocked key={sale.requestId.toNumber()} {...sale} />)}
    </div>
  </>
}

export default PurchasedSecrets
