'use client'

import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { AuthContext, SignInData, UserAuthType } from '@/contexts/auth-ceontext'

interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const router = useRouter()
  const [user, setUser] = useState<UserAuthType | null>(null)

  useEffect(() => {
    const user = Cookies.get('sportshub@user')

    if (user) {
      setUser(JSON.parse(user))
    }
  }, [router])

  async function signIn(data: SignInData) {
    return api.post('/auth/login', data).then((response) => {
      Cookies.set('sportshub@token', response.data.token)
      Cookies.set('sportshub@user', JSON.stringify(response.data.usuario))

      setUser(response.data.usuario)

      router.push('/')
    })
  }

  function signOut() {
    setUser(null)

    api.defaults.headers.Authorization = null

    Cookies.remove('sportshub@token')
    Cookies.remove('sportshub@user')
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
