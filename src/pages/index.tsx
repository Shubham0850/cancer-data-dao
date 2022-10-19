import { FC } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { EVMPoint, HGamalEVM, PublicKey, SecretKey, init } from '@medusa-network/medusa-sdk'
import { G1 } from '@medusa-network/medusa-sdk/lib/bn254'

import { APP_NAME, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import Signin from '@/components/Signin'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import ListingForm from '@/components/ListingForm'
import useGlobalStore from '@/stores/globalStore'

const Home: FC = () => {
  const { isConnected } = useAccount()

  const updateMedusaKey = useGlobalStore((state) => state.updateMedusaKey)
  const medusaKey = useGlobalStore((state) => state.medusaKey)

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

      </div>
    </div>
  )
}

export default Home
