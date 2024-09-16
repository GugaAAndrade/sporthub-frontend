'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
export default function LoginPage() {
  const router = useRouter()
  function goToHomePage() {
    router.push('/')
  }

  return (
    <>
      <div className="h-screen flex w-full">
        <div className="w-1/2 flex justify-center items-center flex-col gap-6">
          <div className="">
            <button
              onClick={goToHomePage}
              className="flex gap-2 justify-center "
            >
              <Image
                src="/logo_amarela.svg"
                alt="logo"
                width={30}
                height={30}
                quality={100}
                priority
              />
              <h1 className="text-3xl font-bold ">
                SPORTS
                <span className="text-primary">HUB</span>
              </h1>
            </button>
          </div>

          <div className="w-2/3">
            <p className="text-4xl">SEJA BEM-VINDO</p>
            <p>entre com sua conta para continuar</p>
          </div>

          <div className="w-2/3">
            <form action="" className="flex flex-col gap-4">
              <input
                className="w-full border-2 rounded-lg p-4"
                type="email"
                placeholder="Digite seu email"
              />
              <input
                className="w-full border-2 rounded-lg p-4"
                type="password"
                placeholder="Digite sua senha"
              />

              <button className="flex w-full px-4 py-4 bg-primary hover:brightness-95 rounded-lg items-center justify-center text-lg">
                Entrar
              </button>
            </form>
          </div>
          <div className="flex items-center justify-center gap-4 w-2/3">
            <div className="h-px w-full bg-black"></div>
            ou
            <div className="h-px w-full  bg-black"></div>
          </div>
          <div className="w-2/3">
            <button className="flex w-full p-4 border-2 rounded-lg items-center justify-center text-lg gap-2">
              <Image
                src="/google_icon.svg"
                alt="logo"
                width={24}
                height={24}
                quality={100}
                priority
              />
              Entrar com Google
            </button>
          </div>

          <div>
            Nao tem conta?{' '}
            <a href="#" className="text-blue-600">
              Clique Aqui
            </a>{' '}
            para criar
          </div>
        </div>
        <div className="w-1/2 h-screen flex justify-center p-6">
          <Image
            className=" w-auto h-full"
            src="/bg_login.png"
            width={1029}
            height={915}
            alt="Picture of the author"
          />
        </div>
      </div>
    </>
  )
}
