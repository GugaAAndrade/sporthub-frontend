'use client'

import { AuthContext } from '@/contexts/auth-ceontext'
import { api } from '@/services/api'
import { X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface Horario {
  id: string
  horarioInicio: string
  diaSemana: number
  isReserved: boolean
}

interface ScheduleItem {
  horario: {
    horarioInicio: string
  }
  dataReserva: string
}

export interface Court {
  nome: string
  valorHora: number
  esportes: {
    id: string
    nome: string
  }[]
  imageUrl: string
  descricao: string
  nota: number
  id: string
  horarios: Horario[]
  capacidade: number
}

interface Group {
  id: string
  nome: string
}

interface ReservationModalProps {
  court: Court
  onClose: () => void
}

export default function ReservationModal({
  court,
  onClose,
}: ReservationModalProps) {
  const { user } = useContext(AuthContext)
  const [selectedHorarios, setSelectedHorarios] = useState<string[]>([])
  const [inputData, setInputData] = useState('')
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [userGroups, setUserGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const handleHorarioClick = (horarioId: string) => {
    if (selectedHorarios.includes(horarioId)) {
      setSelectedHorarios(selectedHorarios.filter((h) => h !== horarioId))
    } else {
      setSelectedHorarios([...selectedHorarios, horarioId])
    }
  }

  const getDayOfWeek = (date: string): number => {
    const selectedDate = new Date(date)
    selectedDate.setHours(selectedDate.getHours() + 3)

    return selectedDate.getDay()
  }

  // Função para buscar os grupos do usuário
  function getUserGroups() {
    if (!user) return

    api
      .get(`/grupo`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setUserGroups(response.data.content)
      })
      .catch((error) => {
        console.error('Erro ao buscar grupos do usuário:', error)
      })
  }

  useEffect(() => {
    getUserGroups() // Chama a função para buscar os grupos assim que o componente é montado
  }, [user])

  useEffect(() => {
    // Buscar agendamentos existentes para a quadra
    api
      .get(`/reserva/quadra/${court.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setSchedule(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [court.id])

  function sendReservation() {
    for (const horarioId of selectedHorarios) {
      api.post(
        '/reserva',
        {
          horarioId,
          dataReserva: inputData,
          ativa: true,
          usuarioId: user?.id,
          grupoId: selectedGroup, // Inclui o ID do grupo se selecionado
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
          },
        },
      )
    }
  }

  const filteredHorarios = inputData
    ? court.horarios
        .filter((horario) => horario.diaSemana === getDayOfWeek(inputData))
        .map((horario) => {
          const isReserved = schedule.some(
            (s) =>
              s.horario.horarioInicio === horario.horarioInicio &&
              s.dataReserva === inputData,
          )

          return {
            ...horario,
            isReserved,
          }
        })
    : []

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="p-6 bg-white max-w-xl w-full rounded-lg">
        <div className="flex justify-between">
          <p className="text-primary text-2xl">Reserve sua quadra</p>
          <X className="size-5 cursor-pointer" onClick={onClose} />
        </div>

        <p className="text-sm text-gray-400">Quadra</p>
        <p className="text-xl">{court.nome}</p>
        <p className="text-sm text-gray-400">Valor</p>
        <p className="text-xl">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(court.valorHora)}
          /hora
        </p>

        <p className="text-sm text-gray-400">Data</p>
        <input
          type="date"
          className="text-xl border rounded-lg p-2"
          value={inputData}
          onChange={(event) => setInputData(event.target.value)}
        />

        <p className="text-sm text-gray-400">Selecione um grupo (opcional)</p>
        <select
          className="w-1/3 border rounded-lg p-2"
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(e.target.value || null)}
        >
          <option value="">Sem grupo</option>
          {userGroups?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.nome}
            </option>
          ))}
        </select>

        {inputData ? (
          filteredHorarios.length > 0 ? (
            <div>
              <p className="text-sm text-gray-400">Horários</p>
              <div className="flex gap-2 overflow-auto justify-center items-center flex-wrap">
                {filteredHorarios
                  .sort((a, b) =>
                    a.horarioInicio.localeCompare(b.horarioInicio),
                  )
                  .map((horario) => (
                    <button
                      key={horario.id}
                      disabled={horario.isReserved}
                      onClick={() => handleHorarioClick(horario.id)}
                      className={`w-14 py-2 rounded-md border ${
                        horario.isReserved
                          ? 'bg-gray-300 text-gray-400'
                          : selectedHorarios.includes(horario.id)
                            ? 'bg-primary text-white'
                            : 'border-gray-400'
                      }`}
                    >
                      {horario.horarioInicio.split(':')[0]}h
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Não há horários disponíveis para este dia.
            </p>
          )
        ) : (
          <p className="text-sm text-gray-400">
            Selecione uma data para ver os horários.
          </p>
        )}

        <button
          className="bg-primary w-full rounded-lg py-2 mt-4"
          onClick={sendReservation}
        >
          Reservar
        </button>
      </div>
    </div>
  )
}
