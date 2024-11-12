'use client'
import SportContainer from '@/components/sportContainer'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const goToCourtsPage = () => {
    router.push('/courts')
  }

  const goToLoginPage = () => {
    router.push('/login')
  }

  const handleRedirect = (sportChoice: string) => {
    router.push(`/courts?sport=${sportChoice}`)
  }

  return (
    <>
      <div className="bg-[url('/card_home_page.png')] bg-no-repeat bg-center py-16 flex justify-center w-full">
        <div className="flex flex-col items-center justify-center max-w-5xl w-full">
          <div className="w-full h-[640px] space-y-16">
            <div className="flex h-[500px] px-20 items-center">
              <p className="text-white text-7xl">
                <span className="text-primary">SIMPLIFIQUE</span> A SUA VIDA,{' '}
                <br />
                <span className="text-primary">OTIMIZE</span> SEU TEMPO E <br />
                <span className="text-primary">ELEVE</span> SEU JOGO
              </p>
            </div>

            <div className="w-full flex justify-end px-5">
              <button
                onClick={goToLoginPage}
                className=" rounded-[12px] py-3 px-7 flex shadow-md bg-secondary text-lg text-primary hover:bg-secondary/90 transform active:scale-95 transition-transform"
              >
                BORA COMECAR
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center ">
        <div className="flex flex-col  max-w-5xl w-full ">
          {' '}
          <p className="text-7xl text-primary">ESPORTES</p>
          <div className="flex justify-center gap-28 py-10 flex-wrap">
            <button onClick={() => handleRedirect('Futebol')}>
              <SportContainer sport="Futebol" imageUrl="/football_card.png" />
            </button>
            <button onClick={() => handleRedirect('Basquete')}>
              <SportContainer sport="Basquete" imageUrl="/basket_card.png" />
            </button>
            <button onClick={() => handleRedirect('Volei')}>
              <SportContainer sport="Volei" imageUrl="/voley_card.png" />
            </button>
          </div>
          <div className="flex w-full justify-end pb-24">
            <button
              onClick={goToCourtsPage}
              className="py-3 px-7 bg-primary rounded-xl shadow-md transform active:scale-95 transition-transform hover:brightness-95"
            >
              Reservar Espaco
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
