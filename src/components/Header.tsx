import { FC, useState } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import requestFaucet from '@/lib/requestFaucet'
import ConnectWallet from './ConnectWallet'
import Signin from './Signin'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC = () => {
  const { isConnected, address } = useAccount()
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  const handleFaucet = async (event: any) => {
    event.preventDefault()

    try {
      const _txHash = await requestFaucet(address)
      setTxHash(_txHash)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="relative bg-gray-100 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-black dark:border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="https://cryptonet.org/projects/project-medusa-scalable-threshold-network-on-chain">
              <span className="sr-only">Medusa</span>
              <img className="h-12 w-auto sm:h-16" src="/logo.png" alt="" />
            </a>
          </div>

          <div className="items-center justify-end flex flex-1 lg:w-0 space-x-3">
            <button
              disabled={!address}
              onClick={handleFaucet}
              className="text-base font-medium text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 disabled:cursor-not-allowed disabled:opacity-25"
            >
              Faucet
            </button>
            <ThemeSwitcher />
            {isConnected ? <Signin /> : <ConnectWallet />}
          </div>
        </div>
      </div>
      {txHash && <a href={`https://goerli.arbiscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">Sent 0.01 ETH - View transaction</a>}
      {error && <p>Faucet Error: {error}</p>}
    </div>
  )
}
export default Header
