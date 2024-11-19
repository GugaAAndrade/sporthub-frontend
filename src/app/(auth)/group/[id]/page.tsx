'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { api } from '@/services/api'
import { Usuario } from '../../profile/page'
import ModalAddUsuarioToGrupoModal from '@/components/addUsuarioToGroupModal'
import { Trash } from 'lucide-react'
import CreateTorneioModal from '@/components/createTorneioModal'

export interface Group {
  id: string
  nome: string
  descricao: string
  // Adicione outros campos se necessário
}

export interface Jogo {
  id: string
  torneioId: string
  // Outros campos se necessário
}

export interface Torneio {
  id: string
  nome: string
  descricao: string
  dataCriacao: string
  grupoId: string
  jogos: Jogo[]
}

export default function GroupPage() {
  const { id } = useParams()

  const [group, setGroup] = useState<Group | null>(null)
  const [participants, setParticipants] = useState<Usuario[]>([])
  const [tournaments, setTournaments] = useState<Torneio[]>([])

  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false)
  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] =
    useState(false)

  useEffect(() => {
    if (!id) return

    // Buscar detalhes do grupo
    api
      .get(`/grupo/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        const groupData = response.data
        setGroup(groupData)

        const usersIds = groupData.usuarios

        // Buscar participantes do grupo
        const participantsPromises = usersIds.map((userId: string) =>
          api.get(`/usuario/${userId}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
            },
          }),
        )

        Promise.all(participantsPromises)
          .then((responses) => {
            const users = responses.map((response) => response.data)
            setParticipants(users)
          })
          .catch((error) => {
            console.error('Erro ao buscar participantes:', error)
          })

        // Buscar torneios do grupo
        api
          .get(`/torneio`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
            },
          })
          .then((response) => {
            const torneiosData = response.data.content
            setTournaments(torneiosData)
          })
          .catch((error) => {
            console.error('Erro ao buscar torneios:', error)
          })
      })
      .catch((error) => {
        console.error('Erro ao buscar grupo:', error)
      })
  }, [id])

  const handleAddParticipant = () => {
    setIsModalAddUserOpen(true)
  }

  const handleCreateTournament = () => {
    setIsCreateTournamentModalOpen(true)
  }

  const handleDeleteTournament = (tournamentId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este torneio?')) return

    api
      .delete(`/torneio/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then(() => {
        // Remover o torneio do estado local
        setTournaments((prevTournaments) =>
          prevTournaments.filter((t) => t.id !== tournamentId),
        )
      })
      .catch((error) => {
        console.error('Erro ao remover torneio:', error)
      })
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] py-16 justify-center w-full">
      {isModalAddUserOpen && (
        <ModalAddUsuarioToGrupoModal
          idGrupo={id as string}
          onClose={() => setIsModalAddUserOpen(false)}
        />
      )}
      {isCreateTournamentModalOpen && group && (
        <CreateTorneioModal
          idGrupo={group.id}
          onClose={() => setIsCreateTournamentModalOpen(false)}
        />
      )}
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

            {/* Seção de Torneios */}
            <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
              <div className="flex justify-between items-center">
                <p className="text-lg">Torneios</p>
                <button
                  onClick={handleCreateTournament}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Criar Torneio
                </button>
              </div>

              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="border p-4 rounded-lg mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {tournament.nome}
                      </h3>
                      <button
                        onClick={() => handleDeleteTournament(tournament.id)}
                        className="text-red-500"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                    <p>{tournament.descricao}</p>
                    {/* Seção de Jogos */}
                    <div className="mt-2">
                      <p className="font-semibold">Jogos:</p>
                      {tournament.jogos && tournament.jogos.length > 0 ? (
                        tournament.jogos.map((jogo) => (
                          <div key={jogo.id} className="ml-4">
                            <p>Jogo ID: {jogo.id}</p>
                            {/* Outros detalhes do jogo */}
                          </div>
                        ))
                      ) : (
                        <p className="ml-4">Não há jogos neste torneio.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>Não há torneios neste grupo.</p>
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
