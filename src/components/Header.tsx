import Link from 'next/link'
import { FC } from 'react'
import { useAccount } from 'wagmi'
import ConnectWallet from './ConnectWallet'
import Signin from './Signin'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC = () => {
  const { isConnected } = useAccount()

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
          <nav className="space-x-10 hidden sm:flex">
            <a href="https://goerli-faucet.pk910.de/" target="_blank" className="text-base font-medium text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400" rel="noreferrer">Faucet</a>
            <a href="https://chainlist.org/" target="_blank" className="text-base font-medium text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400" rel="noreferrer">Add Arbitrum Goerli</a>
          </nav>
          <div className="items-center justify-end flex flex-1 lg:w-0 space-x-3">
            <ThemeSwitcher />
            {isConnected ? <Signin /> : <ConnectWallet />}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header
