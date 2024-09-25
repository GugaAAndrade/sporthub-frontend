import { X } from 'lucide-react'
import { api } from '@/services/api'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { Establishment } from '@/app/(auth)/admin/page'

interface ModalEditEstablishmentProps {
  onClose: () => void
  establishment: Establishment
}

export default function ModalEditEstablishment({
  establishment,
  onClose,
}: ModalEditEstablishmentProps) {
  const [name, setName] = useState(establishment.nome)
  const [email, setEmail] = useState(establishment.email)
  const [cnpj, setCnpj] = useState(establishment.cnpj)
  const [contact, setContact] = useState(establishment.contato)
  const [address, setAddress] = useState(establishment.endereco)
  const [cep, setCep] = useState(establishment.cep)
  const [description, setDescription] = useState(establishment.descricao)

  function handleEditEstablishment() {
    api.put(
      `/estabelecimento/${establishment.id}`,
      {
        nome: name,
        email,
        cnpj,
        contato: contact,
        endereco: address,
        cep,
        descricao: description,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
        },
      },
    )

    window.location.reload()
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 ">
      <div className="p-6 bg-white max-w-xl w-full rounded-lg">
        <div className="flex justify-between">
          <p className="text-primary text-2xl">Criar Estabelecimento</p>
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
            <label className="text-sm text-gray-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">CNPJ</label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Contato</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Endereco</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">CEP</label>
            <input
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
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
        </div>

        <button
          onClick={handleEditEstablishment}
          className="bg-primary w-full rounded-lg py-2 mt-4"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
