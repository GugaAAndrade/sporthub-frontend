import Image from 'next/image'

export default function profile() {
  return (
    <div className="flex min-h-[calc(100vh-11rem)] py-16 justify-center w-full">
      <div className="max-w-5xl w-full flex flex-col items-center gap-5">
        <div className=" w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
          <div className="flex start justify-between w-full gap-3">
            <div className="flex items-center gap-3">
              <div className="w-24 h-24  rounded-full  bg-blue-500"></div>
              <div className="flex flex-col">
                <p className="text-xl">George Soares</p>
                <p>
                  <span className="text-sm">20</span>{' '}
                  <span className="text-xs">eventos</span>
                </p>
              </div>
            </div>

            <div className="flex items-start -mt-4">
              <Image
                src="/bandeira-bronze.png"
                alt="logo"
                width={30}
                height={30}
                quality={100}
                priority
              />
              <Image
                src="/bandeira-prata.png"
                alt="logo"
                width={30}
                height={30}
                quality={100}
                priority
              />
              <Image
                src="/bandeira-amarela.png"
                alt="logo"
                width={30}
                height={30}
                quality={100}
                priority
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p>Esportes favoritos</p>
            <div className="flex text-sm gap-2">
              <div className="rounded-full border border-black bg-gray-200 text-gray-600 py-[2px] px-2 ">
                Futebol
              </div>
              <div className="rounded-full border border-black bg-gray-200 text-gray-600 py-[2px] px-2 ">
                Basquete
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
          <p className="text-lg">Agendamento</p>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-14 h-14 rounded-lg bg-blue-300"></div>
              <p className="flex flex-col">
                <span>Copa do Mundo Futebol Society</span>
                <span>14/06/2023</span>
              </p>
            </div>

            <button className="bg-red-100 py-[2px] px-2 rounded-[10px] border-2 border-red-600 text-red-600">
              Cancelar
            </button>
          </div>

          <div className="h-px w-full bg-gray-400"></div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-14 h-14 rounded-lg bg-blue-300"></div>
              <p className="flex flex-col">
                <span>Copa do Mundo Futebol Society</span>
                <span>14/06/2023</span>
              </p>
            </div>

            <button className="bg-red-100 py-[2px] px-2 rounded-[10px] border-2 border-red-600 text-red-600">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
