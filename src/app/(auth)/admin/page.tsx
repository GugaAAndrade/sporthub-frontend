'use client'

import { api } from '@/services/api'
import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import EstablishmentContainer from '@/components/establishmentContainer'
import { Pencil } from 'lucide-react'
import { Court } from '@/components/modalReservation'
import { AuthContext } from '@/contexts/auth-ceontext'
import { useRouter } from 'next/navigation'
import ModalEditCourt from '@/components/modalEditCourt'
import ModalCreateCourt from '@/components/modalCreateCourt'
import ModalEditEstablishment from '@/components/modalEditEstablishment'
import ModalCreateHorario from '@/components/modalCreateHorario'

export interface Establishment {
  nome: string
  email: string
  cnpj: string
  contato: string
  endereco: string
  cep: string
  descricao: string
  id: string
}

export interface EstablishmentWithCourts extends Establishment {
  quadras: Court[]
}

export default function EstablishmentPage() {
  const router = useRouter()

  const { user } = useContext(AuthContext)

  const [establishment, setEstablishment] =
    useState<EstablishmentWithCourts | null>(null)
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [selectCourtId, setSelectCourtId] = useState<string | null>(null)

  function handleEditEstablishment() {
    setIsEditModalOpen(true)
  }

  function getEstablishment() {
    api
      .get(`/estabelecimento/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setEstablishment(response.data)
      })
  }

  useEffect(() => {
    if (!user) {
      return
    }
    if (user?.role !== 'ESTABLISHMENT') {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    if (!user) return

    getEstablishment()
  }, [user])

  return (
    <div className="flex py-16 justify-center w-full min-h-[calc(100vh-11rem)]">
      <div className="text-[30px] w-full max-w-5xl gap-6 flex flex-col">
        <div className="flex justify-between flex-col gap-6">
          <div className="flex justify-between">
            <p>Seja bem vindo {user?.nome}</p>

            <button
              onClick={handleEditEstablishment}
              className="flex gap-1 items-center text-base bg-blue-100 py-1 px-2 rounded-lg"
            >
              {' '}
              <Pencil className="size-4" />
              Editar Estabelecimento
            </button>
          </div>
          <EstablishmentContainer
            establishment={establishment}
            setSelectedCourt={setSelectedCourt}
            setSelectedEstablishment={setSelectedEstablishment}
            selectCourtId={setSelectCourtId}
            key={establishment?.id}
          />
        </div>
      </div>
      {selectedCourt && (
        <ModalEditCourt
          court={selectedCourt}
          onClose={() => {
            setSelectedCourt(null)
            setSelectedEstablishment(null)
          }}
        />
      )}

      {selectedEstablishment && !selectedCourt && (
        <ModalCreateCourt
          estabelecimentoId={selectedEstablishment.id}
          onClose={() => setSelectedEstablishment(null)}
        />
      )}

      {isEditModalOpen && establishment && (
        <ModalEditEstablishment
          establishment={establishment}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {selectCourtId && (
        <ModalCreateHorario
          quadraId={selectCourtId}
          onClose={() => setSelectCourtId(null)}
        />
      )}
    </div>
  )
}
