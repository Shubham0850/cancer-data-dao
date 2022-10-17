import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes'
import { useContractRead } from 'wagmi'
import { PublicKey, SecretKey } from '@medusa-network/medusa-sdk'

import Web3Provider from '@/components/Web3Provider'
import useGlobalStore from '@/stores/globalStore'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'

const App = ({ Component, pageProps }) => {
  const updateDistributedKey = useGlobalStore((state) => state.updateDistributedKey)
  const distributedKey = useGlobalStore((state) => state.distributedKey)

  useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'distributedKey',
    watch: false,
    staleTime: Infinity,
    enabled: Boolean(distributedKey),
    // TODO: Convert this type properly from EVM G1Point
    onSuccess: (distributedKey: PublicKey<SecretKey>) => {
      updateDistributedKey(distributedKey)
    }
  })

  return (
    <ThemeProvider attribute="class">
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </ThemeProvider>
  )
}

export default App
