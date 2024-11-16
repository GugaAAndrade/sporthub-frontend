'use client'
import { api } from '@/services/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function CreateAccountPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmed, setPasswordConfirmed] = useState('')
  const [cpf, setCpf] = useState('')
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [genero, setGenero] = useState('')
  const [telefone, setTelefone] = useState('')

  function goToHomePage() {
    router.push('/')
  }

  const goToLoginPage = () => {
    router.push('/login')
  }

  const goToCreateEstablishmentAccount = () => {
    router.push('/create-establishment-account')
  }

  function handleCreateAccount(event: React.FormEvent) {
    event.preventDefault()

    api.post('/auth/register', {
      nome: name,
      email,
      senha: password,
      cpf,
      dataNascimento: dateOfBirth,
      genero,
      telefone,
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
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="text"
                  placeholder="Digite seu CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="date"
                  placeholder="Digite sua data de nascimento"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <select
                  className="w-1/2 border-2 rounded-lg p-4"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione seu gênero
                  </option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
                <input
                  className="w-1/2 border-2 rounded-lg p-4"
                  type="tel"
                  placeholder="Digite seu telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
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

              <button
                type="submit"
                className="flex w-full px-4 py-4 bg-primary hover:brightness-95 rounded-lg items-center justify-center text-lg"
              >
                Criar Conta
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <div>
              Tem um estabelecimento?{' '}
              <button
                onClick={goToCreateEstablishmentAccount}
                className="text-blue-600"
              >
                Clique Aqui
              </button>{' '}
              para fazer parte da nossa rede!
            </div>
            <div>
              Ja tem conta?{' '}
              <button onClick={goToLoginPage} className="text-blue-600">
                Clique Aqui
              </button>{' '}
              para entrar
            </div>
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
