'use client'

import { useEffect, useState } from 'react'

interface Pedido {
  id: number
  produtos: string
  total: number
  status: string
  createdAt: string
}

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      window.location.href = '/login'
      return
    }

    const usuario = JSON.parse(usuarioSalvo)

    fetch(`http://localhost:3333/pedidos/usuario/${usuario.id}`)
      .then(res => res.json())
      .then(data => {
        setPedidos(data)
        setCarregando(false)
      })
  }, [])

  function converterProdutos(produtos: string) {
    try {
      return JSON.parse(produtos)
    } catch {
      return []
    }
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
      <h1 className="text-4xl font-black text-cyan-400 mb-10">
        📦 Meus Pedidos
      </h1>

      {pedidos.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-2xl border border-cyan-500/20">
          <p className="text-gray-400 mb-6">
            Você ainda não tem pedidos.
          </p>

          <a
            href="/"
            className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold"
          >
            Voltar para loja
          </a>
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
                <h2 className="text-2xl font-bold mb-3">
                  Pedido #{pedido.id}
                </h2>

                <p className="text-cyan-400 font-bold text-xl mb-3">
                  Total: R$ {pedido.total.toFixed(2)}
                </p>

                <p className="text-gray-400 mb-4">
                  Status: {pedido.status}
                </p>

                <div className="space-y-3">
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
                        <p className="font-bold">
                          {produto.nome}
                        </p>

                        <p className="text-cyan-400">
                          R$ {Number(produto.preco).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}