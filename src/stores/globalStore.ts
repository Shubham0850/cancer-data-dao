import { KeyPair, SecretKey, PublicKey } from '@medusa-network/medusa-sdk'
import create from 'zustand'

interface GlobalState {
  keypair: KeyPair<SecretKey, PublicKey<SecretKey>> | null
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>>) => void
}

const useGlobalStore = create<GlobalState>()((set) => ({
  keypair: null,
  updateKeypair: (keypair: KeyPair<SecretKey, PublicKey<SecretKey>>) => set((state) => ({ keypair })),
}))

export default useGlobalStore
