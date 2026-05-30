'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCarrinho } from '../../CarrinhoContext'

interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem: string
}

export default function ProdutoPage() {
  const params = useParams()
  const id = params.id
  const [produto, setProduto] = useState<Produto | null>(null)
  const { adicionar } = useCarrinho()

  useEffect(() => {
    fetch(`https://loja-tech-3d-production.up.railway.app/produtos/${id}`)
      .then(res => res.json())
      .then(data => setProduto(data))
  }, [id])

  function comprar() {
    if (!produto) return

    adicionar({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem
    })

    window.location.href = '/checkout'
  }

  if (!produto) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Carregando...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-20 md:px-8 md:py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-cyan-500/20">
          <img
            src={`/imagens/${produto.imagem}`}
            alt={produto.nome}
            className="w-full h-[320px] md:h-[500px] object-cover"
          />
        </div>

        <div>
          <span className="bg-cyan-400 text-black px-4 py-1 rounded-full text-sm font-bold">
            PRODUTO TECH
          </span>

          <h1 className="text-3xl md:text-5xl font-black mt-6 mb-4">
            {produto.nome}
          </h1>

          <p className="text-gray-400 text-base md:text-lg mb-6">
            {produto.descricao}
          </p>

          <p className="text-cyan-400 text-4xl md:text-5xl font-black mb-8">
            {Number(produto.preco).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>

          <button
            onClick={comprar}
            className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 rounded-2xl font-bold text-lg"
          >
            🛒 Comprar Agora
          </button>

          <a href="/" className="block mt-6 text-gray-400 hover:text-cyan-400">
            ← Voltar para loja
          </a>
        </div>
      </div>
    </main>
  )
}