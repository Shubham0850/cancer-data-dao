export function ipfsGatewayLink(cidOrUri: string): string {
  const cid = cidOrUri.split('//').pop()
  return `https://w3s.link/ipfs/${cid}`
}
