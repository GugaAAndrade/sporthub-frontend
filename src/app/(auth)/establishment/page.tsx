import { Pencil } from 'lucide-react'

export default function Establishment() {
  return (
    <div className="flex py-16 justify-center w-full min-h-[calc(100vh-11rem)]">
      <div className="text-[30px] w-full max-w-5xl gap-6 flex flex-col">
        <div className="flex justify-between">
          <p>Seja bem vindo dono do site</p>
          <button className="text-base bg-primary py-2 px-4 rounded-lg">
            {' '}
            Cadastrar estabelecimento
          </button>
        </div>

        <div className="w-full border border-black rounded-lg gap-4 flex flex-col p-4">
          <div className="flex justify-between">
            <p className="text-2xl">Quadras - Camisa 10</p>
            <button className="text-base bg-primary py-2 px-4 rounded-lg">
              {' '}
              Cadastrar quadra
            </button>
          </div>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-14 h-14 rounded-lg bg-blue-300"></div>
              <p className="flex text-lg flex-col">
                <span>Copa do Mundo Futebol Society</span>
                <span>14/06/2023</span>
              </p>
            </div>

            <button className=" p-[6px] border-gray-300 rounded-lg text-lg bg-gray-100">
              <Pencil className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-14 h-14 rounded-lg bg-blue-300"></div>
              <p className="flex text-lg flex-col">
                <span>Copa do Mundo Futebol Society</span>
                <span>14/06/2023</span>
              </p>
            </div>

            <button className=" p-[6px] border-gray-300 rounded-lg text-lg bg-gray-100">
              <Pencil className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
