'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { api } from '@/services/api'
import Image from 'next/image'

export interface Group {
  id: string
  nome: string
  descricao: string
  // Adicione outros campos se necessário
}

export interface Participant {
  id: string
  nome: string
  email: string
  // Adicione outros campos se necessário
}

export interface GroupEvent {
  id: string
  dataEvento: string
  descricao: string
  // Adicione outros campos se necessário
}

export default function GroupPage() {
  const searchParams = useSearchParams()

  const [group, setGroup] = useState<Group | null>({
    id: '1',
    nome: 'Teste',
    descricao: 'Descrição do grupo',
  })
  const [participants, setParticipants] = useState<Participant[]>([])
  const [groupEvents, setGroupEvents] = useState<GroupEvent[]>([])

  const groupId = searchParams.get('id')

  useEffect(() => {
    if (!groupId) return

    // Buscar detalhes do grupo
    api
      .get(`/grupo/${groupId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setGroup(response.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar grupo:', error)
      })

    // Buscar participantes do grupo
    api
      .get(`/grupo/${groupId}/participantes`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setParticipants(response.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar participantes:', error)
      })

    // Buscar agendamentos do grupo
    api
      .get(`/grupo/${groupId}/agendamentos`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setGroupEvents(response.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar agendamentos do grupo:', error)
      })
  }, [groupId])

  const handleAddParticipant = () => {
    // Implementar lógica para adicionar um participante
    // Pode abrir um modal ou redirecionar para outra página
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] py-16 justify-center w-full">
      <div className="max-w-5xl w-full flex flex-col items-center gap-5">
        {group ? (
          <>
            {/* Detalhes do Grupo */}
            <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
              <h1 className="text-2xl font-bold">{group.nome}</h1>
              <p>{group.descricao}</p>
            </div>

            {/* Seção de Participantes */}
            <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
              <div className="flex justify-between items-center">
                <p className="text-lg">Participantes</p>
                <button
                  onClick={handleAddParticipant}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Adicionar Participante
                </button>
              </div>

              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                        {/* Pode adicionar uma imagem ou ícone representativo do participante */}
                        <span className="text-white text-xl">
                          {participant.nome.charAt(0)}
                        </span>
                      </div>
                      <p className="flex flex-col">
                        <span className="font-semibold">
                          {participant.nome}
                        </span>
                        <span className="text-sm text-gray-600">
                          {participant.email}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Não há participantes neste grupo.</p>
              )}
            </div>

            {/* Seção de Agendamentos do Grupo */}
            <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
              <p className="text-lg">Agendamentos do Grupo</p>

              {groupEvents.length > 0 ? (
                groupEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <div className="w-14 h-14 rounded-lg bg-blue-300 flex items-center justify-center">
                        {/* Pode adicionar uma imagem ou ícone representativo do evento */}
                        <Image
                          src="/event-icon.png"
                          alt="Evento"
                          width={56}
                          height={56}
                          quality={100}
                        />
                      </div>
                      <p className="flex flex-col">
                        <span>{event.descricao}</span>
                        <span>{event.dataEvento}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Não há agendamentos para este grupo.</p>
              )}
            </div>
          </>
        ) : (
          <p>Carregando informações do grupo...</p>
        )}
      </div>
    </div>
  )
}
