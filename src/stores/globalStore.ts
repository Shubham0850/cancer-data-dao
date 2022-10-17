import { KeyPair, SecretKey, PublicKey } from '@medusa-network/medusa-sdk'
import create from 'zustand'

interface GlobalState {
  keypair: KeyPair<SecretKey, PublicKey<SecretKey>> | null
  distributedKey: PublicKey<SecretKey> | null
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>>) => void
  updateDistributedKey: (distributedKey: PublicKey<SecretKey>) => void
}

const useGlobalStore = create<GlobalState>()((set) => ({
  keypair: null,
  distributedKey: null,
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>>) => set((state) => ({ keypair })),
  updateDistributedKey: (distributedKey: PublicKey<SecretKey>) => set((state) => ({ distributedKey })),
}))

export default useGlobalStore
