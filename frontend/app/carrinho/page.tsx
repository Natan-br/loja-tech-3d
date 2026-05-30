'use client'

import { useCarrinho } from '../CarrinhoContext'

export default function CarrinhoPage() {
  const { itens, remover, limpar } = useCarrinho()

  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0)

  function finalizarCompra() {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      alert('Você precisa fazer login antes de finalizar a compra.')
      window.location.href = '/login'
      return
    }

    window.location.href = '/checkout'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-8 md:p-10">
      <h1 className="text-3xl md:text-4xl font-black mb-8 text-cyan-400">
        🛒 Carrinho
      </h1>

      {itens.length === 0 ? (
        <div className="bg-gray-900 p-6 md:p-8 rounded-2xl border border-cyan-500/20">
          <p className="text-gray-400 mb-6">Seu carrinho está vazio.</p>

          <a href="/" className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold">
            Voltar para loja
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {itens.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-gray-900 p-4 rounded-2xl border border-cyan-500/20 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`/imagens/${item.imagem}`}
                    alt={item.nome}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                  />

                  <div>
                    <h2 className="text-base md:text-xl font-bold">{item.nome}</h2>

                    <p className="text-cyan-400 font-bold">
                      {Number(item.preco).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => remover(index)}
                  className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-xl text-sm font-bold"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-black p-5 md:p-6 rounded-2xl border border-cyan-500/20">
            <p className="text-2xl md:text-3xl font-black text-cyan-400">
              Total:{' '}
              {total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-5">
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