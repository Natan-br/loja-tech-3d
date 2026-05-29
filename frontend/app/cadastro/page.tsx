'use client'

import { useState } from 'react'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function cadastrar() {
    const resposta = await fetch('http://localhost:3333/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    })

    const dados = await resposta.json()

    if (dados.erro) {
      alert(dados.erro)
      return
    }

    localStorage.setItem('usuario', JSON.stringify(dados))
    alert('Cadastro realizado!')
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-cyan-500/20">
        <h1 className="text-3xl font-black text-cyan-400 mb-6">Criar Conta</h1>

        <input
          placeholder="Nome"
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        <input
          placeholder="E-mail"
          className="w-full p-3 mb-4 rounded bg-black border border-gray-700"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Senha"
          type="password"
          className="w-full p-3 mb-6 rounded bg-black border border-gray-700"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <button
          onClick={cadastrar}
          className="w-full bg-cyan-500 text-black py-3 rounded-xl font-bold"
        >
          Cadastrar
        </button>

        <a href="/login" className="block mt-4 text-cyan-400">
          Já tenho conta
        </a>
      </div>
    </main>
  )
}