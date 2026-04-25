import { ReactNode } from 'react'
import { 
  AuthContextProvider, 
  ToggleContextProvider, 
  PrintQrContextProvider,
} from '@contexts'

const registerProviders = [
  AuthContextProvider,
  ToggleContextProvider,
  PrintQrContextProvider
]

export function ContextAppProvider({ children }: { children: ReactNode }) {
  return registerProviders.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}