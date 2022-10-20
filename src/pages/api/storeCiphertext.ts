import { NextApiRequest, NextApiResponse } from 'next'
import { Web3Storage, File } from 'web3.storage'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, ciphertext } = req.body
  console.log('name', name)
  console.log('ciphertext', ciphertext)
  const storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN })

  const file = new File([ciphertext], name, { type: 'text/plain' })
  const cid = await storage.put([file])
  console.log(`IPFS CID: ${cid}`)
  console.log(`Gateway URL: https://w3s.link/ipfs/${cid}/${name}`)
  res.status(200).json({ cid })
}

export default handler
