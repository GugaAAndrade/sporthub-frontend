'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { api } from '@/services/api'
import { Usuario } from '../../profile/page'
import ModalAddUsuarioToGrupoModal from '@/components/addUsuarioToGroupModal'

export interface Group {
  id: string
  nome: string
  descricao: string
}

export interface Agendamento {
  id: string
  dataReserva: string
  local: string
  horario: {
    horarioInicio: string
    quadra: string
  }
  usuario: {
    nome: string
  }
}

interface Team {
  id: number
  members: Usuario[]
}

interface Match {
  id: number
  team1: Team
  team2: Team | null
  winnerTeamId?: number | null
  goals?: {
    [playerId: string]: number // Player ID to goals scored
  }
}

interface GeneratedTournamentData {
  id: number | null
  teams: Team[]
  matches: Match[]
  date: string
}

interface PlayerStats {
  goalsScored: number
  matchesPlayed: number
  matchesWon: number
  winRate: number
}

export default function GroupPage() {
  const { id } = useParams()

  const [group, setGroup] = useState<Group | null>(null)
  const [participants, setParticipants] = useState<Usuario[]>([])
  const [schedules, setSchedules] = useState<Agendamento[]>([])
  const [establishmentNames, setEstablishmentNames] = useState<{
    [key: string]: {
      courtName: string
      establishmentName: string
      imageUrl: string
    }
  }>({})

  const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false)
  const [isGenerateTournamentModalOpen, setIsGenerateTournamentModalOpen] =
    useState(false)
  const [tournamentData, setTournamentData] =
    useState<GeneratedTournamentData | null>(null)
  const [savedTournaments, setSavedTournaments] = useState<
    GeneratedTournamentData[]
  >([])

  const [isViewingSavedTournament, setIsViewingSavedTournament] =
    useState(false)
  const [tournamentIdCounter, setTournamentIdCounter] = useState(1)

  const [playerStats, setPlayerStats] = useState<{
    [playerId: string]: PlayerStats
  }>({}) // New state for player statistics

  function getGroupReserves() {
    api
      .get(`/reserva/grupo/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setSchedules(response.data)
        fetchEstablishmentNames(
          response.data.map((s: Agendamento) => s.horario.quadra),
        )
      })
  }

  function fetchEstablishmentNames(courtIds: string[]) {
    const uniqueCourtIds = Array.from(new Set(courtIds))
    const promises = uniqueCourtIds.map((courtId) =>
      api
        .get(`/quadra/${courtId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
          },
        })
        .then((response) => ({
          courtId,
          courtName: response.data.nome,
          establishmentName: response.data.estabelecimento.nome,
          imageUrl: response.data.imageUrl,
        }))
        .catch((error) => {
          console.error(
            `Erro ao buscar informações para quadra ${courtId}:`,
            error,
          )
          return {
            courtId,
            courtName: 'Desconhecido',
            establishmentName: 'Desconhecido',
            imageUrl: '',
          }
        }),
    )

    Promise.all(promises).then((results) => {
      const names = results.reduce(
        (acc, { courtId, courtName, establishmentName, imageUrl }) => ({
          ...acc,
          [courtId]: { courtName, establishmentName, imageUrl },
        }),
        {},
      )
      setEstablishmentNames(names)
    })
  }

  useEffect(() => {
    getGroupReserves()
  }, [id])

  useEffect(() => {
    if (!id) return

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

        const uniqueUsersIds = Array.from(new Set(usersIds)) as string[]

        const participantsPromises = uniqueUsersIds.map((userId: string) =>
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

        api
          .get(`/reserva/grupo/${id}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
            },
          })
          .then((response) => {
            const agendamentosData = response.data
            setSchedules(agendamentosData)
          })
          .catch((error) => {
            console.error('Erro ao buscar agendamentos:', error)
          })
      })
      .catch((error) => {
        console.error('Erro ao buscar grupo:', error)
      })
  }, [id])

  // Recalculate player statistics whenever saved tournaments or participants change
  useEffect(() => {
    calculatePlayerStats()
  }, [savedTournaments, participants])

  const calculatePlayerStats = () => {
    const stats: { [playerId: string]: PlayerStats } = {}

    // Initialize stats for each participant
    participants.forEach((player) => {
      stats[player.id] = {
        goalsScored: 0,
        matchesPlayed: 0,
        matchesWon: 0,
        winRate: 0,
      }
    })

    savedTournaments.forEach((tournament) => {
      tournament.matches.forEach((match) => {
        // If the match has both teams
        if (match.team2) {
          // Update matches played for each player
          match.team1.members.forEach((player) => {
            stats[player.id].matchesPlayed += 1
          })
          match.team2.members.forEach((player) => {
            stats[player.id].matchesPlayed += 1
          })

          // Update matches won
          if (match.winnerTeamId) {
            const winningTeam =
              match.winnerTeamId === match.team1.id ? match.team1 : match.team2
            winningTeam.members.forEach((player) => {
              stats[player.id].matchesWon += 1
            })
          }

          // Update goals scored
          if (match.goals) {
            Object.entries(match.goals).forEach(([playerId, goals]) => {
              stats[playerId].goalsScored += goals
            })
          }
        } else {
          // Match with a bye, team1 advances automatically
          match.team1.members.forEach((player) => {
            stats[player.id].matchesWon += 1
            stats[player.id].matchesPlayed += 1
          })
        }
      })
    })

    // Calculate win rate
    Object.values(stats).forEach((playerStat) => {
      if (playerStat.matchesPlayed > 0) {
        playerStat.winRate = parseFloat(
          ((playerStat.matchesWon / playerStat.matchesPlayed) * 100).toFixed(2),
        )
      } else {
        playerStat.winRate = 0
      }
    })

    setPlayerStats(stats)
  }

  const handleAddParticipant = () => {
    setIsModalAddUserOpen(true)
  }

  const handleGenerateTournament = () => {
    generateTournament()
    setIsViewingSavedTournament(false)
    setIsGenerateTournamentModalOpen(true)
  }

  const generateTournament = () => {
    // Copy participants array
    const participantsCopy = [...participants]

    // Shuffle participants
    for (let i = participantsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[participantsCopy[i], participantsCopy[j]] = [
        participantsCopy[j],
        participantsCopy[i],
      ]
    }

    // Create teams of 4 (or fewer if not enough participants)
    const teams: Team[] = []
    let teamId = 1
    for (let i = 0; i < participantsCopy.length; i += 4) {
      const teamMembers = participantsCopy.slice(i, i + 4)
      teams.push({
        id: teamId++,
        members: teamMembers,
      })
    }

    // Shuffle teams
    const teamsCopy = [...teams]
    for (let i = teamsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[teamsCopy[i], teamsCopy[j]] = [teamsCopy[j], teamsCopy[i]]
    }

    // Generate matches
    const matches: Match[] = []
    let matchId = 1
    for (let i = 0; i < teamsCopy.length; i += 2) {
      if (i + 1 < teamsCopy.length) {
        matches.push({
          id: matchId++,
          team1: teamsCopy[i],
          team2: teamsCopy[i + 1],
          winnerTeamId: null,
          goals: {},
        })
      } else {
        // Odd number of teams, team gets a bye
        matches.push({
          id: matchId++,
          team1: teamsCopy[i],
          team2: null,
          winnerTeamId: teamsCopy[i].id,
          goals: {},
        })
      }
    }

    const generatedData: GeneratedTournamentData = {
      id: null,
      teams,
      matches,
      date: new Date().toLocaleString('pt-BR'),
    }

    setTournamentData(generatedData)
  }

  const handleSaveTournament = () => {
    if (tournamentData) {
      const newTournament = {
        ...tournamentData,
        id: tournamentIdCounter,
      }
      setSavedTournaments([...savedTournaments, newTournament])
      setTournamentIdCounter(tournamentIdCounter + 1)
      setIsGenerateTournamentModalOpen(false)
      setTournamentData(null)
    }
  }

  const handleDeleteTournament = () => {
    if (tournamentData) {
      const updatedTournaments = savedTournaments.filter(
        (t) => t.id !== tournamentData.id,
      )
      setSavedTournaments(updatedTournaments)
      setIsGenerateTournamentModalOpen(false)
      setTournamentData(null)
    }
  }

  const handleUpdateMatchResult = (
    matchId: number,
    winnerTeamId: number | null,
    goals: { [playerId: string]: number },
  ) => {
    if (!tournamentData) return

    const updatedMatches = tournamentData.matches.map((match) => {
      if (match.id === matchId) {
        return {
          ...match,
          winnerTeamId,
          goals,
        }
      }
      return match
    })

    const updatedTournamentData = {
      ...tournamentData,
      matches: updatedMatches,
    }

    setTournamentData(updatedTournamentData)

    // If viewing a saved tournament, update it in the savedTournaments array
    if (isViewingSavedTournament) {
      const updatedSavedTournaments = savedTournaments.map((tournament) => {
        if (tournament.id === tournamentData.id) {
          return {
            ...tournament,
            matches: updatedMatches,
          }
        }
        return tournament
      })
      setSavedTournaments(updatedSavedTournaments)
    }

    // Recalculate player statistics after updating match results
    calculatePlayerStats()
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] py-16 justify-center w-full">
      {isModalAddUserOpen && (
        <ModalAddUsuarioToGrupoModal
          idGrupo={id as string}
          onClose={() => setIsModalAddUserOpen(false)}
        />
      )}
      {isGenerateTournamentModalOpen && tournamentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsGenerateTournamentModalOpen(false)
                setTournamentData(null)
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center">
              {isViewingSavedTournament
                ? `Torneio ${tournamentData.id}`
                : 'Torneio Gerado'}
            </h2>

            <div className="overflow-y-auto max-h-[70vh]">
              {/* Teams Section */}
              <h3 className="text-2xl font-semibold mb-4">Equipes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournamentData.teams.map((team) => (
                  <div
                    key={team.id}
                    className="border rounded-lg p-4 shadow-lg bg-gray-50"
                  >
                    <p className="font-semibold mb-2 text-center text-lg">
                      Equipe {team.id}
                    </p>
                    <ul className="list-disc list-inside">
                      {team.members.map((member) => (
                        <li key={member.id}>{member.nome}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Matches Section */}
              <h3 className="text-2xl font-semibold mt-8 mb-4">Partidas</h3>
              <div className="space-y-6">
                {tournamentData.matches.map((match) => (
                  <div
                    key={match.id}
                    className="border rounded-lg p-4 shadow-lg bg-gray-50"
                  >
                    <p className="font-semibold mb-2 text-lg">
                      Partida {match.id}
                    </p>
                    <p className="text-center text-gray-700 mb-4">
                      Equipe {match.team1.id}{' '}
                      {match.team2
                        ? `vs Equipe ${match.team2.id}`
                        : '(Aguarda adversário)'}
                    </p>

                    {/* Only allow input if both teams are present */}
                    {match.team2 && (
                      <div>
                        {/* Winner Selection */}
                        <p className="font-semibold mb-2">Resultado:</p>
                        <div className="flex items-center mb-4">
                          <label className="mr-2">
                            <input
                              type="radio"
                              name={`winner-${match.id}`}
                              value={match.team1.id}
                              checked={match.winnerTeamId === match.team1.id}
                              onChange={() =>
                                handleUpdateMatchResult(
                                  match.id,
                                  match.team1.id,
                                  match.goals || {},
                                )
                              }
                            />
                            Equipe {match.team1.id}
                          </label>
                          <label className="ml-4">
                            <input
                              type="radio"
                              name={`winner-${match.id}`}
                              value={match.team2.id}
                              checked={match.winnerTeamId === match.team2.id}
                              onChange={() =>
                                handleUpdateMatchResult(
                                  match.id,
                                  match.team2!.id,
                                  match.goals || {},
                                )
                              }
                            />
                            Equipe {match.team2.id}
                          </label>
                        </div>

                        {/* Goals Scored */}
                        <p className="font-semibold mb-2">Gols Marcados:</p>
                        <div className="space-y-2">
                          {[...match.team1.members, ...match.team2.members].map(
                            (player) => (
                              <div
                                key={player.id}
                                className="flex items-center"
                              >
                                <span className="w-32">{player.nome}:</span>
                                <input
                                  type="number"
                                  min="0"
                                  className="border rounded px-2 py-1 w-16"
                                  value={match.goals?.[player.id] || 0}
                                  onChange={(e) => {
                                    const newGoals = {
                                      ...(match.goals || {}),
                                      [player.id]: parseInt(e.target.value),
                                    }
                                    handleUpdateMatchResult(
                                      match.id,
                                      match.winnerTeamId,
                                      newGoals,
                                    )
                                  }}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Display results if available */}
                    {match.winnerTeamId && (
                      <div className="mt-4">
                        <p className="font-semibold">
                          Vencedor: Equipe {match.winnerTeamId}
                        </p>
                        {/* Display goals scored */}
                        {match.goals && (
                          <>
                            <p className="font-semibold mt-2">Gols Marcados:</p>
                            <ul>
                              {Object.entries(match.goals).map(
                                ([playerId, goals]) => {
                                  const player = participants.find(
                                    (p) => p.id === playerId,
                                  )
                                  return (
                                    <li key={playerId}>
                                      {player?.nome}: {goals} gol(s)
                                    </li>
                                  )
                                },
                              )}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Buttons */}
            {isViewingSavedTournament ? (
              // Buttons when viewing a saved tournament
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleDeleteTournament}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full text-lg font-semibold"
                >
                  Excluir Torneio
                </button>
                <button
                  onClick={() => {
                    setIsGenerateTournamentModalOpen(false)
                    setTournamentData(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg font-semibold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              // Buttons when generating a new tournament
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleSaveTournament}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full text-lg font-semibold"
                >
                  Salvar Torneio
                </button>
                <button
                  onClick={() => {
                    setIsGenerateTournamentModalOpen(false)
                    setTournamentData(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg font-semibold"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="max-w-5xl w-full flex flex-col items-center gap-5">
        {group ? (
          <>
            {/* Detalhes do Grupo */}
            <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{group.nome}</h1>
                <button
                  onClick={handleGenerateTournament}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Gerar Torneio
                </button>
              </div>
              <p>{group.descricao}</p>
            </div>

            {/* Display Saved Tournaments */}
            {savedTournaments.length > 0 && (
              <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
                <p className="text-lg font-semibold">Torneios Salvos</p>
                {savedTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="border p-4 rounded-lg mb-4 bg-gray-50 shadow"
                  >
                    <p className="font-semibold mb-2">
                      Torneio {tournament.id} - {tournament.date}
                    </p>
                    <button
                      onClick={() => {
                        setTournamentData(tournament)
                        setIsViewingSavedTournament(true)
                        setIsGenerateTournamentModalOpen(true)
                      }}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Estatísticas Section */}
            {Object.keys(playerStats).length > 0 && (
              <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
                <p className="text-lg font-semibold">Estatísticas</p>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Jogador</th>
                      <th className="px-4 py-2">Taxa de Vitória (%)</th>
                      <th className="px-4 py-2">Gols Marcados</th>
                      <th className="px-4 py-2">Partidas Jogadas</th>
                      <th className="px-4 py-2">Partidas Vencidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants
                      .sort((a, b) => {
                        // Sort players by win rate
                        return (
                          playerStats[b.id].winRate - playerStats[a.id].winRate
                        )
                      })
                      .map((player) => (
                        <tr key={player.id} className="text-center">
                          <td className="border px-4 py-2">{player.nome}</td>
                          <td className="border px-4 py-2">
                            {playerStats[player.id]?.winRate || 0}%
                          </td>
                          <td className="border px-4 py-2">
                            {playerStats[player.id]?.goalsScored || 0}
                          </td>
                          <td className="border px-4 py-2">
                            {playerStats[player.id]?.matchesPlayed || 0}
                          </td>
                          <td className="border px-4 py-2">
                            {playerStats[player.id]?.matchesWon || 0}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

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

            {/* Agendamentos Section */}
            <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
              <p className="text-lg">Agendamentos</p>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border p-4 rounded-lg mb-4 flex gap-4 items-center"
                  >
                    <img
                      className="h-20 rounded-lg w-20 object-cover"
                      src={
                        establishmentNames[schedule.horario.quadra]?.imageUrl ||
                        '/placeholder-image.jpg'
                      }
                      alt="imagemQuadra"
                    />
                    <div>
                      <p>
                        Estabelecimento:{' '}
                        {
                          establishmentNames[schedule.horario.quadra]
                            ?.establishmentName
                        }
                      </p>
                      <p>
                        Quadra:{' '}
                        {establishmentNames[schedule.horario.quadra]?.courtName}
                      </p>
                      <p>
                        Data:{' '}
                        {schedule.dataReserva.split('-').reverse().join('/')}
                      </p>
                      <p>
                        Horário: {schedule.horario.horarioInicio.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Não há agendamentos neste grupo.</p>
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
