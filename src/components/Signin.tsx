import { FC } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { calculateKeyPair, defaultCurve, init } from '@medusa-network/medusa-sdk'

type Visibility = 'always' | 'signed_in' | 'not_signed_in'

const Signin: FC<{ show?: Visibility }> = ({ show = 'always' }) => {
  const { isConnected } = useAccount()
  const { signMessage } = useSignMessage({
    message: 'Sign in to Medusa',
    async onSuccess(data) {
      await init();
      const keypair = calculateKeyPair(defaultCurve, data)
      console.log('Keypair', keypair)
    },
  })

  if ((show == 'signed_in' && !isConnected) || (show == 'not_signed_in' && isConnected)) return null

  return (
    <button className="btn btn-primary" onClick={() => signMessage()}>Sign in</button>
  )
}

export default Signin;
