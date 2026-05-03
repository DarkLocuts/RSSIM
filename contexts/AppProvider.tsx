import { ReactNode } from 'react'
import { 
  AuthContextProvider, 
  ToggleContextProvider, 
  PrintQrContextProvider,
  PresenceGuardContextProvider
} from '@contexts'

const registerProviders = [
  AuthContextProvider,
  PresenceGuardContextProvider,
  ToggleContextProvider,
  PrintQrContextProvider
]

export function ContextAppProvider({ children }: { children: ReactNode }) {
  return registerProviders.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}