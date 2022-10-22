// Request 0.01 ETH from the faucet
// Returns the txHash of the faucet transaction
export default async function requestFaucet(address: string): Promise<string> {
  console.log('Requesting faucet for address', address)

  if (!address) {
    console.log('No address provided')
    return
  }

  const endpoint = '/api/faucet'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
    })
  }

  const response = await fetch(endpoint, options)
  const { txHash, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  return txHash
}
