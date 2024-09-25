import { api } from '@/services/api'
import { X } from 'lucide-react'
import { useState } from 'react'
import Cookies from 'js-cookie'

interface ModalCreateHorarioProps {
  quadraId: string
  onClose: () => void
}

export default function ModalCreateHorario({
  quadraId,
  onClose,
}: ModalCreateHorarioProps) {
  const [horarioInicio, setHorarioInicio] = useState('')
  const [horarioFim, setHorarioFim] = useState('')

  const [diaSemana, setDiaSemana] = useState<
    'Domingo' | 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado'
  >('Domingo')

  const handleSubmit = async () => {
    const diasSemanaMap = {
      Domingo: 0,
      Segunda: 1,
      Terça: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
      Sábado: 6,
    }

    function submit() {
      api
        .post(
          '/horario',
          {
            horarioInicio: horarioInicio + ':00',
            horarioFim: '23:59:59',
            diaSemana: diasSemanaMap[diaSemana],
            quadraId,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
            },
          },
        )
        .then(() => {
          window.location.reload()
        })
    }
    submit()
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="p-6 bg-white max-w-xl w-full rounded-lg">
        <div className="flex justify-between">
          <p className="text-primary text-2xl">Criar Horário</p>
          <X className="size-5 cursor-pointer" onClick={onClose} />
        </div>

        <div className="flex flex-col space-y-4 mt-4">
          <div>
            <label className="text-sm text-gray-400">Horário Início</label>
            <input
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              type="time"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Horário Fim</label>
            <input
              value={horarioFim}
              onChange={(e) => setHorarioFim(e.target.value)}
              type="time"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Dia da Semana</label>
            <select
              value={diaSemana}
              onChange={(e) =>
                setDiaSemana(
                  e.target.value as
                    | 'Domingo'
                    | 'Segunda'
                    | 'Terça'
                    | 'Quarta'
                    | 'Quinta'
                    | 'Sexta'
                    | 'Sábado',
                )
              }
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="Domingo">Domingo</option>
              <option value="Segunda">Segunda</option>
              <option value="Terça">Terça</option>
              <option value="Quarta">Quarta</option>
              <option value="Quinta">Quinta</option>
              <option value="Sexta">Sexta</option>
              <option value="Sábado">Sábado</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary w-full rounded-lg py-2 mt-4"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
