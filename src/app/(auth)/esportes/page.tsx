'use client'

import CourtCard from '@/components/courtCard'
import ReservationModal, { Court } from '@/components/modalReservation'
import SportTag from '@/components/sportTag'
import { api } from '@/services/api'
import { LoaderCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EsportesPage() {
  const searchParams = useSearchParams()

  const sport = searchParams.get('sport')

  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)

  const [courts, setCourts] = useState<Court[]>([])

  const [loading, setLoading] = useState(true)

  function getCourts() {
    api
      .get('/courts')
      .then((response) => {
        setCourts(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleReserveCourt(court: Court) {
    setSelectedCourt(court)
  }

  useEffect(() => {
    getCourts()
  }, [])

  return (
    <div className="flex py-16 justify-center w-full min-h-[calc(100vh-11rem)]">
      <div className="text-[30px] w-full max-w-5xl gap-6 flex flex-col">
        <div>
          Buscando por <span className="text-primary">{sport || 'todos'}</span>
        </div>
        <div className="flex gap-2">
          <SportTag sport=""></SportTag>
          <SportTag sport="Futebol"></SportTag>
          <SportTag sport="Volei"></SportTag>
          <SportTag sport="Basquete"></SportTag>
        </div>
        <div className="flex flex-col w-full gap-8">
          {courts.length > 0 ? (
            courts
              .filter((court) => !sport || court.sports.includes(sport))
              .map((court) => (
                <CourtCard
                  key={court.id}
                  description={court.description}
                  imageUrl={court.imageUrl}
                  name={court.name}
                  rating={court.rating}
                  sports={court.sports}
                  handleReserveCourt={() => handleReserveCourt(court)}
                ></CourtCard>
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
        <ReservationModal
          court={selectedCourt}
          onClose={() => setSelectedCourt(null)}
        />
      )}
    </div>
  )
}
