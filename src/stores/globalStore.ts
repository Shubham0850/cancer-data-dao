import { KeyPair, SecretKey, PublicKey } from '@medusa-network/medusa-sdk'
import create from 'zustand'

export interface Listing {
  seller: string
  cipherId: string
  name: string
  description: string
  price: string
  uri: string
}

interface GlobalState {
  keypair: KeyPair<SecretKey, PublicKey<SecretKey>> | null
  medusaKey: PublicKey<SecretKey> | null
  listings: Listing[]
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>>) => void
  updateMedusaKey: (medusaKey: PublicKey<SecretKey>) => void
  updateListings: (listings: Listing[]) => void,
}

const useGlobalStore = create<GlobalState>()((set) => ({
  keypair: null,
  medusaKey: null,
  listings: [],
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>> | null) => set((state) => ({ keypair })),
  updateMedusaKey: (medusaKey: PublicKey<SecretKey>) => set((state) => ({ medusaKey })),
  updateListings: (listings: Listing[]) => set((state) => ({ listings })),
}))

export default useGlobalStore
