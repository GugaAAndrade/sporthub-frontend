'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()

  const goToLoginPage = () => {
    router.push('/login')
  }

  const goToEsportsPage = () => {
    router.push('/esportes')
  }

  const goToHomePage = () => {
    router.push('/')
  }

  const goToEstabelecimentosPage = () => {
    router.push('/estabelecimentos')
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

          <div className="flex items-center gap-9 ">
            <button
              className="hover:text-primary transition duration-250"
              onClick={goToHomePage}
            >
              Home
            </button>
            <button
              className="hover:text-primary transition duration-250"
              onClick={goToEsportsPage}
            >
              Esportes
            </button>
            <button
              className="hover:text-primary transition duration-250"
              onClick={goToEstabelecimentosPage}
            >
              Estabelecimento
            </button>
          </div>

          <div className="flex items-center gap-7">
            <button
              className="text-primary hover:text-primary/50 transition duration-250 "
              onClick={goToLoginPage}
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
        </div>
      </div>
      <div className="h-20"></div>
    </>
  )
}
