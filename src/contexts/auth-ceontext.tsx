import { createContext } from 'react'

interface SignInData {
  email: string
  senha: string
}

type UserAuthType = {
  id: string
  nome: string
  email: string
  role: string
}

interface AuthContextType {
  user: UserAuthType | null
  signIn: (data: SignInData, route: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext({} as AuthContextType)

export { AuthContext }

export type { AuthContextType, SignInData, UserAuthType }
