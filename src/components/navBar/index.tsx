'use client'

import { AuthContext } from '@/contexts/auth-ceontext'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export default function NavBar() {
  const router = useRouter()

  const { user, signOut } = useContext(AuthContext)

  const goToLoginPage = () => {
    router.push('/login')
  }

  const goToCreateAccountPage = () => {
    router.push('/create-account')
  }

  const goToCourtsPage = () => {
    router.push('/courts')
  }

  const goToHomePage = () => {
    router.push('/')
  }

  const goToAboutUsPage = () => {
    router.push('/about-us')
  }
  return (
    <>
      <div className="bg-white text-secundary flex items-center fixed  w-full h-20  border-b">
        <div className="container mx-auto flex items-center justify-between max-w-5xl ">
          <button className="flex items-center gap-2" onClick={goToHomePage}>
            <Image
              src="/logo_amarela.svg"
              alt="logo"
              width={24}
              height={24}
              quality={100}
              priority
            />
            <h1 className="text-2xl font-bold ">
              SPORTS
              <span className="text-primary">HUB</span>
            </h1>
          </button>

          {user?.role !== 'ESTABLISHMENT' && (
            <div className="flex items-center gap-9 ">
              <button
                className="hover:text-primary transition duration-250"
                onClick={goToHomePage}
              >
                Home
              </button>
              <button
                className="hover:text-primary transition duration-250"
                onClick={goToCourtsPage}
              >
                Quadras
              </button>
              <button
                className="hover:text-primary transition duration-250"
                onClick={goToAboutUsPage}
              >
                Sobre
              </button>
            </div>
          )}

          {user ? (
            <div className="flex gap-2 items-center">
              {/* <Link href="/profile" className="flex items-center gap-2">
                {user.nome}
              </Link> */}
              {user?.role === 'ESTABLISHMENT' ? (
                <Link href="/admin" className="flex items-center gap-2">
                  {user.nome}
                </Link>
              ) : (
                <Link href="/profile" className="flex items-center gap-2">
                  {user.nome}
                </Link>
              )}

              <button
                onClick={signOut}
                className="px-4 py-2 bg-primary text-black rounded-[14px] hover:brightness-95 flex items-center transform active:scale-95"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-7">
              <button
                className="text-primary hover:text-primary/50 transition duration-250 "
                onClick={goToCreateAccountPage}
              >
                Criar Conta
              </button>

              <button
                onClick={goToLoginPage}
                className="px-4 py-2 bg-primary text-black rounded-[14px] hover:brightness-95 flex items-center transform active:scale-95"
              >
                Entrar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-20"></div>
    </>
  )
}
