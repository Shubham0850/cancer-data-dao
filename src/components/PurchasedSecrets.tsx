import { FC, useEffect } from 'react'
import { useAccount, useContract, useContractEvent, useProvider } from 'wagmi'
import { EVMPoint, HGamalEVM, PublicKey, SecretKey, init } from '@medusa-network/medusa-sdk'
import { G1 } from '@medusa-network/medusa-sdk/lib/bn254'

import { APP_NAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import useGlobalStore from '@/stores/globalStore'
import { ethers } from 'ethers'
import Unlocked from './Unlocked'

const PurchasedSecrets: FC = () => {
  const sales = useGlobalStore((state) => state.sales)

  return <>
    <h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">Purchased Secrets</h1>
    <div className="flex flex-row mt-10 space-x-5">

      {sales.map(sale => <Unlocked key={sale.requestId.toNumber()} {...sale} />)}
    </div>
  </>
}

export default PurchasedSecrets
