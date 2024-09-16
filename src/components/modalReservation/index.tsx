import { X } from 'lucide-react'
import { useState } from 'react'

export interface Court {
  name: string
  valor: number
  sports: string[]
  imageUrl: string
  description: string
  rating: number
  id: number
  horario: string[]
}

interface ReservationModalProps {
  court: Court
  onClose: () => void
}

export default function ReservationModal({
  court,
  onClose,
}: ReservationModalProps) {
  const [selectedHorarios, setSelectedHorarios] = useState<string[]>([])

  const handleHorarioClick = (horario: string) => {
    if (selectedHorarios.includes(horario)) {
      setSelectedHorarios(selectedHorarios.filter((h) => h !== horario))
    } else {
      setSelectedHorarios([...selectedHorarios, horario])
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 ">
      <div className="p-6 bg-white max-w-xl w-full rounded-lg">
        <div className="flex justify-between">
          <p className="text-primary text-2xl">Reserve sua quadra</p>
          <X className="size-5" onClick={onClose} />
        </div>

        <p className="text-sm text-gray-400">Quadra</p>
        <p className="text-xl ">{court.name}</p>
        <p className="text-sm text-gray-400">Valor</p>
        <p className="text-xl">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(court.valor)}
          /hora
        </p>
        <p className="text-sm text-gray-400">Horários</p>
        <div className="flex gap-2 overflow-auto justify-center items-center flex-wrap">
          {court.horario.map((horario) => (
            <button
              key={horario}
              onClick={() => handleHorarioClick(horario)}
              className={`w-14 py-2 rounded-md border ${
                selectedHorarios.includes(horario)
                  ? 'bg-primary text-white'
                  : 'border-gray-400'
              }`}
            >
              {horario}
            </button>
          ))}
        </div>

        <button className="bg-primary w-full rounded-lg py-2 mt-4">
          Reservar
        </button>
      </div>
    </div>
  )
}
