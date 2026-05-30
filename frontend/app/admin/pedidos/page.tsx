'use client'

import { useEffect, useState } from 'react'

const API_URL = 'https://loja-tech-3d-production.up.railway.app'

interface Pedido {
  id: number
  produtos: string
  total: number
  status: string
  createdAt: string
  usuario: {
    nome: string
    email: string
  }
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      window.location.href = '/login'
      return
    }

    const usuario = JSON.parse(usuarioSalvo)

    if (usuario.tipo !== 'admin') {
      alert('Acesso negado.')
      window.location.href = '/'
      return
    }

    carregarPedidos()
  }, [])

  async function carregarPedidos() {
    try {
      const resposta = await fetch(`${API_URL}/pedidos`)
      const dados = await resposta.json()
      setPedidos(dados)
    } catch (erro) {
      alert('Erro ao carregar pedidos')
    } finally {
      setCarregando(false)
    }
  }

  function converterProdutos(produtos: string) {
    try {
      return JSON.parse(produtos)
    } catch {
      return []
    }
  }

  async function alterarStatus(id: number, status: string) {
    await fetch(`${API_URL}/pedidos/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })

    carregarPedidos()
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Carregando pedidos...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-cyan-400">
          📦 Pedidos da Loja
        </h1>

        <a href="/admin" className="text-cyan-400">
          ← Voltar ao Admin
        </a>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-2xl border border-cyan-500/20">
          <p className="text-gray-400">
            Nenhum pedido encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map(pedido => {
            const produtos = converterProdutos(pedido.produtos)

            return (
              <div
                key={pedido.id}
                className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20"
              >
                <div className="flex justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Pedido #{pedido.id}
                    </h2>

                    <p className="text-gray-400">
                      Cliente: {pedido.usuario?.nome}
                    </p>

                    <p className="text-gray-500">
                      {pedido.usuario?.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-cyan-400 text-2xl font-black">
                      R$ {Number(pedido.total).toFixed(2)}
                    </p>

                    <span className="inline-block mt-2 bg-yellow-600 px-3 py-1 rounded-full text-sm">
                      {pedido.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {produtos.map((produto: any, index: number) => (
                    <div
                      key={index}
                      className="bg-black p-4 rounded-xl flex items-center gap-4"
                    >
                      <img
                        src={`/imagens/${produto.imagem}`}
                        alt={produto.nome}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div>
                        <p className="font-bold">{produto.nome}</p>

                        <p className="text-cyan-400">
                          R$ {Number(produto.preco).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => alterarStatus(pedido.id, 'pago')}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-bold"
                  >
                    Marcar como Pago
                  </button>

                  <button
                    onClick={() => alterarStatus(pedido.id, 'enviado')}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-bold"
                  >
                    Marcar como Enviado
                  </button>

                  <button
                    onClick={() => alterarStatus(pedido.id, 'cancelado')}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}