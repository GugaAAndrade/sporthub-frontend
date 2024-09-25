import { Star } from 'lucide-react'
import { MouseEventHandler } from 'react'
import FilterTag from '../filterTag'

interface CourtCardProps {
  description: string
  imageUrl: string
  name: string
  rating: number
  sports: {
    id: string
    nome: string
  }[]
  handleReserveCourt: MouseEventHandler<HTMLButtonElement>
  handleSetSport: (sport: string) => void
}

export default function CourtCard({
  handleSetSport,
  description,
  imageUrl,
  name,
  rating,
  sports,
  handleReserveCourt,
}: CourtCardProps) {
  return (
    <div className="flex w-full h-full items-center p-3 border rounded-xl gap-3">
      <div className=" flex items-center justify-center rounded-lg">
        <img
          className="h-full rounded-lg w-[256px]"
          src={imageUrl}
          alt="imagemQuadra"
        />
      </div>
      <div className="flex h-full flex-1 justify-between flex-col gap-5">
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-between">
            <div className="flex items-end">{name}</div>
            <div className="flex gap-1">
              <Star className="size-6 text-primary"></Star>
              <p className="text-base text-primary ">{rating}</p>
            </div>
          </div>

          <div className=" flex flex-row items-center gap-2 ">
            {sports.map((sport) => (
              <FilterTag
                handleSetSport={handleSetSport}
                key={sport.id}
                sport={sport.nome}
              ></FilterTag>
            ))}
          </div>

          <div className="max-h-[560px] mt-4">
            <p className="text-sm max-h-[560px] text-justify text-gray-700">
              {description}
            </p>
          </div>
        </div>

        <div className="flex w-full justify-end items-center">
          <button
            onClick={handleReserveCourt}
            className="flex items-center justify-center bg-primary text-black shadow-md rounded-lg text-base px-4 py-3 hover:brightness-95"
          >
            Reservar espaco
          </button>
        </div>
      </div>
    </div>
  )
}
