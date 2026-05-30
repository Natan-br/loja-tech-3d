'use client'

import { useEffect, useState } from 'react'
import { useCarrinho } from '../CarrinhoContext'

export default function CheckoutPage() {
  const { itens, limpar } = useCarrinho()
  const [usuario, setUsuario] = useState<any>(null)
  const [copiado, setCopiado] = useState(false)

  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0)

  const chavePix = 'seuemail@pix.com'
  const pixCopiaCola = `00020126580014BR.GOV.BCB.PIX0136${chavePix}520400005303986540${total.toFixed(2)}5802BR5920Loja Tech 3D6009Fortaleza62070503***6304ABCD`

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      window.location.href = '/login'
      return
    }

    setUsuario(JSON.parse(usuarioSalvo))
  }, [])

  function copiarPix() {
    navigator.clipboard.writeText(pixCopiaCola)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function confirmarPedido() {
    alert('Pedido recebido! Envie o comprovante pelo WhatsApp para confirmação.')
    limpar()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-8 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-cyan-400 text-sm">
          ← Voltar para loja
        </a>

        <h1 className="text-3xl md:text-5xl font-black text-cyan-400 mt-6 mb-2">
          Finalizar Compra
        </h1>

        <p className="text-gray-400 mb-8">
          Escolha uma forma de pagamento para concluir seu pedido.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-gray-900 border border-cyan-500/20 rounded-3xl p-5 md:p-8">
            <h2 className="text-2xl font-bold mb-5">
              🧾 Resumo do Pedido
            </h2>

            {itens.length === 0 ? (
              <p className="text-gray-400">Seu carrinho está vazio.</p>
            ) : (
              <div className="space-y-4">
                {itens.map((item, index) => (
                  <div key={index} className="flex gap-4 bg-black/40 p-4 rounded-2xl">
                    <img
                      src={`/imagens/${item.imagem}`}
                      alt={item.nome}
                      className="w-20 h-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold">{item.nome}</h3>

                      <p className="text-cyan-400 font-bold">
                        {Number(item.preco).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-cyan-500/20 pt-5 mt-5">
                  <p className="text-gray-400">Cliente</p>
                  <p className="font-bold">{usuario?.nome}</p>

                  <p className="text-gray-400 mt-3">Total</p>
                  <p className="text-4xl font-black text-cyan-400">
                    {total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="bg-gray-900 border border-cyan-500/20 rounded-3xl p-5 md:p-8">
              <h2 className="text-2xl font-bold mb-4">
                🔷 Pagamento via PIX
              </h2>

              <div className="bg-white rounded-2xl p-5 flex items-center justify-center mb-5">
                <div className="w-44 h-44 bg-gray-200 text-black flex items-center justify-center text-center rounded-xl font-bold">
                  QR CODE PIX
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-3">
                Chave PIX:
              </p>

              <div className="bg-black p-4 rounded-xl border border-cyan-500/20 break-all text-sm">
                {chavePix}
              </div>

              <button
                onClick={copiarPix}
                className="w-full mt-4 bg-cyan-500 text-black py-3 rounded-xl font-bold"
              >
                {copiado ? 'PIX copiado!' : 'Copiar PIX'}
              </button>
            </div>

            <div className="bg-gray-900 border border-cyan-500/20 rounded-3xl p-5 md:p-8 opacity-80">
              <h2 className="text-2xl font-bold mb-4">
                💳 Cartão de Crédito
              </h2>

              <div className="bg-gradient-to-r from-slate-800 to-slate-950 border border-gray-700 rounded-2xl p-5 mb-4">
                <p className="text-gray-400 text-sm">Cartão</p>
                <p className="text-2xl font-black tracking-widest mt-5">
                  **** **** **** 1234
                </p>

                <div className="flex justify-between mt-6 text-sm text-gray-400">
                  <span>NOME DO CLIENTE</span>
                  <span>12/30</span>
                </div>
              </div>

              <p className="text-yellow-400 text-sm">
                Função visual. Integração com cartão será configurada depois.
              </p>
            </div>

            <button
              onClick={confirmarPedido}
              disabled={itens.length === 0}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400 text-black py-4 rounded-2xl font-black text-lg"
            >
              Confirmar Pedido
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}