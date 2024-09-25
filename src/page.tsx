'use client'

import CourtCard from '@/components/courtCard'
import FilterTag from '@/components/filterTag'
import ReservationModal, { Court } from '@/components/modalReservation'
import { api } from '@/services/api'
import { LoaderCircle } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function CourtsPage() {
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [sportChoice, setSportChoice] = useState(
    searchParams.get('sport') || '',
  )

  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)

  const [courts, setCourts] = useState<Court[]>([])

  const [loading, setLoading] = useState(true)

  const filteredCourts = () => {
    return courts.filter(
      (court) =>
        !sportChoice || court.esportes.some((e) => e.nome === sportChoice),
    )
  }

  useEffect(() => {
    replace(pathname)
  }, [replace, pathname])

  function getCourts() {
    api
      .get('/quadra', {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
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
          Buscando por{' '}
          <span className="text-primary">{sportChoice || 'todos'}</span>
        </div>
        <div className="flex gap-2">
          <FilterTag handleSetSport={setSportChoice} sport=""></FilterTag>
          <FilterTag
            handleSetSport={setSportChoice}
            sport="Futebol"
          ></FilterTag>
          <FilterTag handleSetSport={setSportChoice} sport="Volei"></FilterTag>
          <FilterTag
            handleSetSport={setSportChoice}
            sport="Basquete"
          ></FilterTag>
        </div>
        <div className="flex flex-col w-full gap-6">
          {filteredCourts().length > 0 ? (
            filteredCourts().map((court) => (
              <CourtCard
                key={court.id}
                description={court.descricao}
                imageUrl={court.imageUrl}
                name={court.nome}
                rating={court.nota}
                sports={court.esportes}
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
