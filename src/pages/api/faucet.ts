import { getNetwork } from '@wagmi/core'
import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import { arbitrumGoerli } from 'wagmi/chains'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.body
  const key = process.env.FAUCET_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider('https://goerli-rollup.arbitrum.io/rpc')
  const wallet = new ethers.Wallet(key)
  const signer = wallet.connect(provider)
  if ((await signer.getBalance()).lt(ethers.utils.parseEther('0.1'))) {
    return res.status(400).json({ error: 'Faucet is empty' })
  }
  const tx = await signer.sendTransaction({ value: ethers.utils.parseEther('0.01'), to: address })

  res.status(200).json({ txHash: tx.hash })
}

export default handler
