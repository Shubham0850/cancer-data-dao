import { FC, useState } from 'react'
import { useAccount } from 'wagmi'

import requestFaucet from '@/lib/requestFaucet'
import ConnectWallet from './ConnectWallet'
import Signin from './Signin'
import ThemeSwitcher from './ThemeSwitcher'
import toast from 'react-hot-toast'

const Nav: FC = () => {
  const { isConnected, address } = useAccount()

  const handleFaucet = async (event: any) => {
    event.preventDefault()

    toast.promise(
      requestFaucet(address),
      {
        loading: 'Requesting faucet...',
        success: (txHash) => <a
          href={`https://goerli.arbiscan.io/tx/${txHash}`}
          className="inline-flex items-center text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Sending 0.01 ETH to your wallet - View on Etherscan
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
        </a>,
        error: (error) => `Error requesting faucet: ${error.message}`
      }
    )
  }

  return (
    <div className="relative">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="/">
            <h3 className="h3">🧬Cure DA💿</h3>
            </a>
          </div>

          <div className="items-center justify-end flex flex-1 lg:w-0 space-x-3">
            <button
              disabled={!address}
              onClick={handleFaucet}
              className="btns"
            >
              Faucet
            </button>
            {/* <ThemeSwitcher /> */}
            {isConnected ? <Signin /> : <ConnectWallet />}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Nav
