// components/CreateGroupModal.tsx

import { useContext, useState } from 'react'
import { api } from '@/services/api'
import Cookies from 'js-cookie'
import { AuthContext } from '@/contexts/auth-ceontext'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onGroupCreated: () => void
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
}: CreateGroupModalProps) {
  const { user } = useContext(AuthContext)

  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateGroup = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post(
        '/grupo',
        {
          nome: groupName,
          descricao: groupDescription,
          usuarios: [user?.id],
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('sportshub@token')}`,
          },
        },
      )
      setLoading(false)
      onGroupCreated()
      onClose()
    } catch (err) {
      setLoading(false)
      setError('Erro ao criar o grupo. Tente novamente.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Criar Novo Grupo</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Nome do Grupo</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descrição</label>
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  )
}
