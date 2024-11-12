'use client'

import { AuthContext } from '@/contexts/auth-ceontext'
import { api } from '@/services/api'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Court } from '@/components/modalReservation'
import CreateGroupModal from '@/components/CreateGroupModal' // Import do modal
import Link from 'next/link'

export interface Usuario {
  id: string
  cpf: string
  nome: string
  email: string
  dataNascimento: string
  genero: 'masculino' | 'feminino' | 'outro'
  telefone: string
  roles: 'USER' | 'ADMIN'
  dataCriacao: string
}

export interface UserReservationInfo {
  id: string
  dataReserva: string
  ativa: boolean
  horario: {
    id: string
    horarioInicio: string
    diaSemana: number
    quadra: string
  }
}

export interface Group {
  id: string
  nome: string
  descricao: string
  // Adicione outros campos se necessário
}

export default function Profile() {
  const { user } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState<Usuario>()
  const [userReservations, setUserReservations] = useState<
    UserReservationInfo[]
  >([])
  const [courts, setCourts] = useState<Court[]>([])
  const [userGroups, setUserGroups] = useState<Group[]>([])

  const [unicReservationsCourts, setUnicReservationsCourts] = useState<
    string[]
  >([])

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)

  function getUser() {
    if (!user) return

    api
      .get(`/usuario/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data)
      })
  }

  function getUserReserves() {
    if (!user) return

    api
      .get(`/reserva/usuario/${user.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setUserReservations(response.data)
        const responsedata = response.data as UserReservationInfo[]
        const unicCourts = responsedata
          .map((reserve) => reserve.horario.quadra)
          .filter((value, index, self) => self.indexOf(value) === index)
        setUnicReservationsCourts(unicCourts)
      })
  }

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
    console.log(user)
    getUser()
    getUserReserves()
    getUserGroups()
  }, [user])

  useEffect(() => {
    console.log(unicReservationsCourts)
    async function getCourts() {
      for (let i = 0; i < unicReservationsCourts.length; i++) {
        const response = await api.get(`/quadra/${unicReservationsCourts[i]}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
          },
        })

        setCourts((prev) => [...prev, response.data])
      }
    }
    getCourts()
  }, [unicReservationsCourts])

  const handleOpenCreateGroupModal = () => {
    setIsCreateGroupModalOpen(true)
  }

  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false)
  }

  const handleGroupCreated = () => {
    // Atualiza a lista de grupos após a criação de um novo grupo
    getUserGroups()
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] py-16 justify-center w-full">
      <div className="max-w-5xl w-full flex flex-col items-center gap-5">
        {/* Seção de Perfil */}
        <div className=" w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
          <div className="flex start justify-between w-full gap-3">
            <div className="flex items-center gap-3">
              <div className="w-24 h-24  rounded-full  bg-blue-500"></div>
              <div className="flex flex-col">
                <p className="text-xl">{user?.nome}</p>
                <p>
                  <span className="text-sm">20</span>{' '}
                  <span className="text-xs">eventos</span>
                </p>
                <p className="text-sm">{userInfo?.email}</p>
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

        {/* Seção de Quadras Reservadas */}
        <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
          <p className="text-lg">Quadras Reservadas</p>

          {userReservations.length > 0 ? (
            userReservations.map((reserve) => (
              <div
                key={reserve.id}
                className="flex items-center gap-2 justify-between"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-14 h-14 rounded-lg bg-blue-300">
                    <img
                      className="h-full rounded-lg w-[256px]"
                      src={
                        courts.find(
                          (court) => court.id === reserve.horario.quadra,
                        )?.imageUrl
                      }
                      alt="imagemQuadra"
                    />
                  </div>
                  <p className="flex flex-col">
                    <span>
                      {
                        courts.find(
                          (court) => court.id === reserve.horario.quadra,
                        )?.nome
                      }
                    </span>
                    <span>{reserve.dataReserva}</span>
                  </p>
                </div>

                {/* <button className="bg-red-100 py-[2px] px-2 rounded-[10px] border-2 border-red-600 text-red-600">
                  Cancelar
                </button> */}
              </div>
            ))
          ) : (
            <p>Você não possui quadras reservadas</p>
          )}
        </div>

        {/* Seção de Grupos */}
        <div className="w-2/3 border border-black rounded-lg gap-4 flex flex-col p-4">
          <div className="flex justify-between items-center">
            <p className="text-lg">Grupos</p>
            <button
              onClick={handleOpenCreateGroupModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Criar Grupo
            </button>
          </div>

          {userGroups.length > 0 ? (
            userGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-2 justify-between"
              >
                <Link href={`/grupo/${group.id}`}>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                      {/* Pode adicionar uma imagem ou ícone representativo do grupo aqui */}
                      <span className="text-white text-xl">
                        {group.nome.charAt(0)}
                      </span>
                    </div>
                    <p className="flex flex-col">
                      <span className="font-semibold">{group.nome}</span>
                      <span className="text-sm text-gray-600">
                        {group.descricao}
                      </span>
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Você não participa de nenhum grupo.</p>
          )}
        </div>
      </div>

      {/* Modal de Criação de Grupo */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={handleCloseCreateGroupModal}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  )
}
