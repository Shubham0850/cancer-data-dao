import { FC } from 'react'
import { useSignMessage } from 'wagmi'
import { calculateKeyPair, defaultCurve, init } from '@medusa-network/medusa-sdk'
import useGlobalStore from '@/stores/globalStore'


const Signin: FC = () => {
  const keypair = useGlobalStore((state) => state.keypair)
  const updateKeypair = useGlobalStore((state) => state.updateKeypair)

  const { signMessage } = useSignMessage({
    message: 'Sign in to Medusa',
    async onSuccess(data) {
      await init();
      const keypair = calculateKeyPair(defaultCurve, data)
      updateKeypair(keypair)
    },
  })

  if (keypair) {
    return <button
      className="bg-gray-700 hover:bg-gray-500 hover:cursor-pointer text-gray-50 py-2 px-4 rounded"
      onClick={() => updateKeypair(null)}
    >
      Sign out
    </button>
  }

  return <button
    className="bg-gray-700 hover:bg-gray-500 hover:cursor-pointer text-gray-50 py-2 px-4 rounded"
    onClick={() => signMessage()}
  >
    Sign in
  </button>
}

export default Signin;
