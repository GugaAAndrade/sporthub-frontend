import { Calendar, Pencil, Trash } from 'lucide-react'
import { Court } from '../modalReservation'
import { api } from '@/services/api'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface CourtContainerProps {
  court: Court
  handleSelectedCourt: () => void
  selectCourtId: (courtId: string) => void
}

export default function CourtContainer({
  court,
  handleSelectedCourt,
  selectCourtId,
}: CourtContainerProps) {
  function handleDeleteCourt() {
    api
      .delete(`/quadra/${court.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .catch(() => {
        toast.error('Quadra possui agendamentos ativos')
      })
  }

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex gap-2 items-center">
        <div className="w-14 h-14 rounded-lg bg-blue-300">
          <img
            className="h-full rounded-lg w-[256px]"
            src={court.imageUrl}
            alt="imagemQuadra"
          />
        </div>
        <p className="flex text-lg flex-col">
          <span>{court.nome}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => selectCourtId(court.id)}
          className=" p-[6px] border-gray-300 rounded-lg text-lg bg-green-100"
        >
          <Calendar className="size-5" />
        </button>
        <button
          onClick={handleSelectedCourt}
          className=" p-[6px] border-gray-300 rounded-lg text-lg bg-blue-100"
        >
          <Pencil className="size-5" />
        </button>
        <button
          onClick={handleDeleteCourt}
          className=" p-[6px] border-gray-300 rounded-lg text-lg bg-red-100"
        >
          <Trash className="size-5" />
        </button>
      </div>
    </div>
  )
}
