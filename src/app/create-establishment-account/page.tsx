'use client'
import { api } from '@/services/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function CreateStablishmentAccountPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmed, setPasswordConfirmed] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [cep, setCep] = useState('')
  const [description, setDescription] = useState('')

  function goToHomePage() {
    router.push('/')
  }

  const goToLoginPage = () => {
    router.push('/login-establishment')
  }

  function handleCreateAccount(event: React.FormEvent) {
    event.preventDefault()

    api
      .post('/auth/register/estabelecimento', {
        nome: name,
        email,
        senha: password,
        cnpj,
        contato: contact,
        endereco: address,
        cep,
        descricao: description,
      })
      .then(() => {
        router.push('/login-establishment')
      })
  }

  return (
    <>
      <div className="h-screen flex w-full">
        <div className="w-1/2 flex justify-center items-center flex-col gap-6">
          <div className="">
            <button
              onClick={goToHomePage}
              className="flex gap-2 justify-center"
            >
              <Image
                src="/logo_amarela.svg"
                alt="logo"
                width={30}
                height={30}
                quality={100}
                priority
              />
              <h1 className="text-3xl font-bold ">
                SPORTS
                <span className="text-primary">HUB</span>
              </h1>
            </button>
          </div>

          <div className="w-2/3">
            <p className="text-4xl">Cadastre-se</p>
            <p>Junte-se a nos e descubra um mundo de possibilidades</p>
          </div>

          <div className="w-2/3">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleCreateAccount}
            >
              <div className="flex gap-4">
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="text"
                  placeholder="Digite o nome do estabelecimento"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="email"
                  placeholder="Digite o email do estabelecimento"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="text"
                  placeholder="Digite o CNPJ"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="text"
                  placeholder="Digite o endereço do estabelecimento"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="tel"
                  placeholder="Digite o telefone para contato"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="tel"
                  placeholder="Digite o CEP do estabelecimento"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={passwordConfirmed}
                  onChange={(e) => setPasswordConfirmed(e.target.value)}
                />
              </div>

              <input
                className="w-full border-2 rounded-lg p-4"
                type="text"
                placeholder="Descrição do estabelecimento"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                type="submit"
                className="flex w-full px-4 py-4 bg-primary hover:brightness-95 rounded-lg items-center justify-center text-lg"
              >
                Criar Conta
              </button>
            </form>
          </div>

          <div>
            Já tem conta?{' '}
            <button onClick={goToLoginPage} className="text-blue-600">
              Clique Aqui
            </button>{' '}
            para entrar
          </div>
        </div>

        <div className="w-1/2 h-screen flex justify-center p-6">
          <Image
            className="w-auto h-full"
            src="/bg_login.png"
            width={1029}
            height={915}
            alt="Background"
          />
        </div>
      </div>
    </>
  )
}
