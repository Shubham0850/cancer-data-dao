// Stores a ciphertext by submitting it to the endpoint in @/api/storeCiphertext.ts
// Returns the CID from Web3.Storage
export default async function storeCiphertext(name: string, ciphertext: string): Promise<string> {
  const endpoint = '/api/storeCiphertext'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      ciphertext,
    })
  }

  const response = await fetch(endpoint, options)

  const { cid } = await response.json()
  return cid
}
