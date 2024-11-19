import { X } from 'lucide-react'
import { api } from '@/services/api'
import Cookies from 'js-cookie'
import { useState } from 'react'

interface CreateTorneioModalProps {
  idGrupo: string
  onClose: () => void
}

export default function CreateTorneioModal({
  onClose,
}: CreateTorneioModalProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  function handleAddTorneio() {
    api.post(
      `/torneio`,
      {
        nome,
        descricao,
        // grupoId: idGrupo,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      },
    )

    // window.location.reload()
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 ">
      <div className="p-6 bg-white max-w-xl w-full rounded-lg">
        <div className="flex justify-between">
          <p className="text-primary text-2xl">Criar torneio</p>
          <X className="size-5 cursor-pointer" onClick={onClose} />
        </div>

        <div className="gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-400">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        <div className="gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-400">Descricao</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        <button
          onClick={handleAddTorneio}
          className="bg-primary w-full rounded-lg py-2 mt-4"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
