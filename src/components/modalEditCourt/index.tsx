import { X } from 'lucide-react'
import { Court } from '@/components/modalReservation'
import { api } from '@/services/api'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

interface ModalEditCourtProps {
  court: Court
  onClose: () => void
}

interface Esporte {
  id: string
  nome: string
}

export default function ModalEditCourt({
  court,
  onClose,
}: ModalEditCourtProps) {
  const [name, setName] = useState(court.nome)
  const [description, setDescription] = useState(court.descricao)
  const [value, setValue] = useState(court.valorHora)
  const [note, setNote] = useState(court.nota)
  const [capacity, setCapacity] = useState(court.capacidade)
  const [image, setImage] = useState(court.imageUrl)
  const [selectedSports, setSelectedSports] = useState<string[]>([])

  const [esportes, setEsportes] = useState<Esporte[]>([])
  const [loading, setLoading] = useState(true)

  function handleEditCourt() {
    api.put(
      `/quadra/${court.id}`,
      {
        nome: name,
        capacidade: capacity,

        // esportes: selectedSports,
        nota: note,
        descricao: description,
        valorHora: value,
        imageUrl: image,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      },
    )
  }

  useEffect(() => {
    api
      .get('/esporte', {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      })
      .then((response) => {
        setEsportes(response.data.content)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function handleSportChange(
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) {
    if (event.target.checked) {
      setSelectedSports([...selectedSports, id])
    } else {
      setSelectedSports(selectedSports.filter((sportId) => sportId !== id))
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 ">
      <div className="p-6 bg-white max-w-xl w-full rounded-lg">
        <div className="flex justify-between">
          <p className="text-primary text-2xl">Editar Quadra</p>
          <X className="size-5 cursor-pointer" onClick={onClose} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-400">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Capacidade</label>
            <input
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Nota</label>
            <input
              value={note}
              onChange={(e) => setNote(Number(e.target.value))}
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Valor Hora (R$)</label>
            <input
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              min="0"
              step="0.01"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-400">Descricao</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-400">Imagem (URL)</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-400">Esportes</label>
            <div className="flex flex-wrap">
              {loading ? (
                <p>Carregando...</p>
              ) : (
                esportes.map((esporte) => (
                  <div key={esporte.id} className="mr-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={esporte.id}
                        checked={selectedSports.includes(esporte.id)}
                        onChange={(e) => handleSportChange(e, esporte.id)}
                      />
                      <span>{esporte.nome}</span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleEditCourt}
          className="bg-primary w-full rounded-lg py-2 mt-4"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
