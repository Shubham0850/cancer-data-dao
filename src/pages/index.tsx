import { FC } from 'react'
import { useAccount } from 'wagmi'
import { APP_NAME } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import Signin from '@/components/Signin'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import SubmitPlaintextForm from '@/components/SubmitPlaintextForm'

const Home: FC = () => {
  const { isConnected } = useAccount()

  return (
    <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
      <div className="absolute top-6 right-6">
        {isConnected ? <Signin /> : <ConnectWallet />}
      </div>
      <ThemeSwitcher className="absolute bottom-6 right-6" />
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
          <h1 className="text-6xl font-bold dark:text-white">{APP_NAME}</h1>
        </div>
        <SubmitPlaintextForm />

      </div>
    </div>
  )
}

export default Home
