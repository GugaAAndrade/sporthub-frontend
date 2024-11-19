import { Court } from '../modalReservation'
import CourtContainer from '../courtContainer'
import { Plus } from 'lucide-react'
import { EstablishmentWithCourts } from '@/app/(auth)/admin/page'

interface EstablishmentContainerProps {
  establishment: EstablishmentWithCourts | null
  setSelectedCourt: (court: Court) => void
  setSelectedEstablishment: (establishment: EstablishmentWithCourts) => void
  selectCourtId: (courtId: string) => void
}

export default function EstablishmentContainer({
  establishment,
  setSelectedCourt,
  setSelectedEstablishment,
  selectCourtId,
}: EstablishmentContainerProps) {
  function handleSelectedCourt(court: Court) {
    setSelectedCourt(court)
    setSelectedEstablishment(establishment as EstablishmentWithCourts)
  }

  if (!establishment) {
    return <div>Nenhum estabelecimento encontrado</div>
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
