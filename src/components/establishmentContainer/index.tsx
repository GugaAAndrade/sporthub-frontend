import { Court } from '../modalReservation'
import CourtContainer from '../courtContainer'
import { Pencil, Plus, Trash } from 'lucide-react'
import { Establishment, EstablishmentWithCourts } from '@/app/(auth)/admin/page'
import { api } from '@/services/api'
import Cookies from 'js-cookie'

interface EstablishmentContainerProps {
  establishment: EstablishmentWithCourts
  setSelectedCourt: (court: Court) => void
  setSelectedEstablishment: (establishment: EstablishmentWithCourts) => void
  setSelectedButtonEditEstablishment: (value: Establishment) => void
  selectCourtId: (courtId: string) => void
}

export default function EstablishmentContainer({
  establishment,
  setSelectedCourt,
  setSelectedEstablishment,
  setSelectedButtonEditEstablishment,
  selectCourtId,
}: EstablishmentContainerProps) {
  function handleSelectedCourt(court: Court) {
    setSelectedCourt(court)
    setSelectedEstablishment(establishment)
  }

  function handleSelectedButtonEditEstablishment() {
    setSelectedButtonEditEstablishment(establishment)
  }

  function handleDeleteEstablishment() {
    api.delete(`/estabelecimento/${establishment.id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
      },
    })

    window.location.reload()
  }

  return (
    <div className="w-full border border-black rounded-lg gap-4 flex flex-col p-4">
      <div className="flex justify-between">
        <p className="text-2xl">Quadras - {establishment.nome}</p>
        <div className="flex gap-1">
          <button
            className="flex gap-1 items-center text-base bg-green-100 py-1 px-2 rounded-lg"
            onClick={() => setSelectedEstablishment(establishment)}
          >
            {' '}
            <Plus className="size-4" />
            Adicionar Quadra
          </button>

          <button
            onClick={handleSelectedButtonEditEstablishment}
            className="flex gap-1 items-center text-base bg-blue-100 py-1 px-2 rounded-lg"
          >
            {' '}
            <Pencil className="size-4" />
            Editar Estabelecimento
          </button>
          <button
            onClick={handleDeleteEstablishment}
            className="flex gap-1 items-center justify-center text-base bg-red-100 py-1 px-2 rounded-lg"
          >
            {' '}
            <Trash className="size-4" />
            Deletar Estabelecimento
          </button>
        </div>
      </div>

      {establishment.quadras.length > 0 ? (
        establishment.quadras.map((establishmentCourt) => (
          <CourtContainer
            court={establishmentCourt}
            key={establishmentCourt.id}
            handleSelectedCourt={() => handleSelectedCourt(establishmentCourt)}
            selectCourtId={selectCourtId}
          />
        ))
      ) : (
        <div className="text-center">Nenhum resultado encontrado</div>
      )}
    </div>
  )
}
