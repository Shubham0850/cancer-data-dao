import { KeyPair, SecretKey, PublicKey } from '@medusa-network/medusa-sdk'
import create from 'zustand'

interface GlobalState {
  keypair: KeyPair<SecretKey, PublicKey<SecretKey>> | null
  medusaKey: PublicKey<SecretKey> | null
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>>) => void
  updateMedusaKey: (medusaKey: PublicKey<SecretKey>) => void
}

const useGlobalStore = create<GlobalState>()((set) => ({
  keypair: null,
  medusaKey: null,
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>> | null) => set((state) => ({ keypair })),
  updateMedusaKey: (medusaKey: PublicKey<SecretKey>) => set((state) => ({ medusaKey })),
}))

export default useGlobalStore
