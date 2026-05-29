'use client'

import { useCarrinho } from '../CarrinhoContext'

export default function CarrinhoPage() {
  const { itens, remover, limpar } = useCarrinho()

  const total = itens.reduce((acc, item) => acc + item.preco, 0)

  async function finalizarCompra() {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      alert('Você precisa fazer login antes de finalizar a compra.')
      window.location.href = '/login'
      return
    }

    const usuario = JSON.parse(usuarioSalvo)

    const resposta = await fetch('http://localhost:3333/pagamento-carrinho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itens,
        usuarioId: usuario.id
      })
    })

    const dados = await resposta.json()

    if (dados.url) {
      limpar()
      window.location.href = dados.url
    } else {
      alert(dados.erro || 'Erro ao finalizar compra')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-4xl font-black mb-10 text-cyan-400">
        🛒 Carrinho
      </h1>

      {itens.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-2xl border border-cyan-500/20">
          <p className="text-gray-400 mb-6">Seu carrinho está vazio.</p>

          <a
            href="/"
            className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold"
          >
            Voltar para loja
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {itens.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-gray-900 p-5 rounded-2xl border border-cyan-500/20 flex items-center justify-between gap-5"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={`/imagens/${item.imagem}`}
                    alt={item.nome}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <div>
                    <h2 className="text-xl font-bold">
                      {item.nome}
                    </h2>

                    <p className="text-cyan-400 font-bold">
                      R$ {item.preco.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => remover(index)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-bold"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-black p-6 rounded-2xl border border-cyan-500/20">
            <p className="text-3xl font-black text-cyan-400">
              Total: R$ {total.toFixed(2)}
            </p>

            <div className="flex gap-4 mt-5">
              <button
                onClick={finalizarCompra}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl font-bold"
              >
                Finalizar Compra
              </button>

              <button
                onClick={limpar}
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-bold"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}