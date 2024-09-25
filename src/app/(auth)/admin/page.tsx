'use client'

import { api } from '@/services/api'
import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import EstablishmentContainer from '@/components/establishmentContainer'
import { LoaderCircle } from 'lucide-react'
import { Court } from '@/components/modalReservation'
import { AuthContext } from '@/contexts/auth-ceontext'
import { useRouter } from 'next/navigation'
import ModalEditCourt from '@/components/modalEditCourt'
import ModalCreateCourt from '@/components/modalCreateCourt'
import ModalCreateEstablishment from '@/components/modalCreateEstablishment'
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

  const [establishment, setEstablishment] = useState<EstablishmentWithCourts[]>(
    [],
  )
  const [loading, setLoading] = useState(true)
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [selectedStablishment, setSelectedStablishment] =
    useState<Establishment | null>(null)

  const [selectedButtonEditEstablishment, setSelectedButtonEditEstablishment] =
    useState<Establishment | null>(null)

  const [
    selectedButtonCreateEstablishment,
    setSelectedButtonCreateEstablishment,
  ] = useState<boolean | null>(false)

  const [selectCourtId, setSelectCourtId] = useState<string | null>(null)

  function handleSelectedButtonCreateEstablishment() {
    setSelectedButtonCreateEstablishment(true)
  }

  function getEstablishment() {
    api
      .get('/estabelecimento', {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setEstablishment(response.data.content)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!user) {
      return
    }
    if (user?.roles !== 'ADMIN') {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    getEstablishment()
  }, [])
  return (
    <div className="flex py-16 justify-center w-full min-h-[calc(100vh-11rem)]">
      <div className="text-[30px] w-full max-w-5xl gap-6 flex flex-col">
        <div className="flex justify-between flex-col gap-6">
          <div className="flex justify-between">
            <p>Seja bem vindo dono do site</p>
            <button
              onClick={handleSelectedButtonCreateEstablishment}
              className="text-base bg-primary py-2 px-4 rounded-lg"
            >
              {' '}
              Cadastrar estabelecimento
            </button>
          </div>
          {establishment.length > 0 ? (
            establishment.map((estab) => (
              <EstablishmentContainer
                establishment={estab}
                setSelectedCourt={setSelectedCourt}
                setSelectedStablishment={setSelectedStablishment}
                setSelectedButtonEditEstablishment={
                  setSelectedButtonEditEstablishment
                }
                selectCourtId={setSelectCourtId}
                key={estab.id}
              />
            ))
          ) : loading ? (
            <div className=" flex justify-center items-center text-center ">
              <LoaderCircle className="size-6 animate-spin" />
            </div>
          ) : (
            <div className="text-center">Nenhum resultado encontrado</div>
          )}
        </div>
      </div>
      {selectedCourt && (
        <ModalEditCourt
          court={selectedCourt}
          onClose={() => {
            setSelectedCourt(null)
            setSelectedStablishment(null)
          }}
        />
      )}

      {selectedStablishment && !selectedCourt && (
        <ModalCreateCourt
          estabelecimentoId={selectedStablishment.id}
          onClose={() => setSelectedStablishment(null)}
        />
      )}

      {selectedButtonCreateEstablishment && (
        <ModalCreateEstablishment
          onClose={() => setSelectedButtonCreateEstablishment(null)}
        />
      )}

      {selectedButtonEditEstablishment && (
        <ModalEditEstablishment
          establishment={selectedButtonEditEstablishment}
          onClose={() => setSelectedButtonEditEstablishment(null)}
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
