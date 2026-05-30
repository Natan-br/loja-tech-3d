'use client'

import Banner from './components/Banner'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCarrinho } from './CarrinhoContext'

interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem: string
  categoria: string
}

const banners = [
  {
    titulo: '⚡ Tecnologia do Futuro',
    subtitulo: 'Até 15% OFF em notebooks, periféricos e acessórios gamer',
    imagem: '/banner/foto_3d.jpg'
  },
  {
    titulo: '🎮 Setup Gamer Completo',
    subtitulo: 'Mouse, teclado, headset e notebook para elevar seu jogo',
    imagem: '/banner/foto_3d_1.jpg'
  },
  {
    titulo: '🚀 Experiência Next Level',
    subtitulo: 'Compre com segurança, estilo e produtos futuristas',
    imagem: '/banner/foto_3d_3.jpg'
  }
]

const categorias = ['Todos', 'Geral', 'Tênis', 'Mouse', 'Teclado', 'Notebook', 'Headset']

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [bannerAtual, setBannerAtual] = useState(0)
  const [usuario, setUsuario] = useState<any>(null)
  const [pesquisa, setPesquisa] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
  const { itens, adicionar } = useCarrinho()

  useEffect(() => {
    fetch('https://loja-tech-3d-production.up.railway.app/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
  }, [])

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')
    if (usuarioSalvo) setUsuario(JSON.parse(usuarioSalvo))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerAtual(prev => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  function proximoBanner() {
    setBannerAtual((bannerAtual + 1) % banners.length)
  }

  function bannerAnterior() {
    setBannerAtual(bannerAtual === 0 ? banners.length - 1 : bannerAtual - 1)
  }

  function sair() {
    localStorage.removeItem('usuario')
    setUsuario(null)
    window.location.href = '/'
  }

  function seloProduto(produto: Produto) {
    if (produto.categoria === 'Notebook') return '🔥 PROMOÇÃO'
    if (produto.categoria === 'Headset') return '⭐ MAIS VENDIDO'
    if (produto.categoria === 'Teclado') return '🚀 LANÇAMENTO'
    if (produto.categoria === 'Mouse') return '⭐ RECOMENDADO'
    if (produto.categoria === 'Tênis') return '🔥 DESTAQUE'
    return 'NOVO'
  }

  function avaliacaoProduto(produto: Produto) {
    if (produto.categoria === 'Notebook') return { nota: '5.0', total: 52 }
    if (produto.categoria === 'Headset') return { nota: '4.9', total: 143 }
    if (produto.categoria === 'Teclado') return { nota: '4.8', total: 81 }
    if (produto.categoria === 'Mouse') return { nota: '4.8', total: 94 }
    if (produto.categoria === 'Tênis') return { nota: '4.9', total: 127 }
    return { nota: '4.7', total: 35 }
  }

  async function comprar(nome: string, preco: number) {
    const resposta = await fetch('https://loja-tech-3d-production.up.railway.app/pagamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, preco })
    })

    const dados = await resposta.json()

    if (dados.url) {
      window.location.href = dados.url
    } else {
      alert('Erro ao criar pagamento')
    }
  }

  const produtosFiltrados = produtos.filter(produto => {
    const correspondePesquisa =
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(pesquisa.toLowerCase())

    const correspondeCategoria =
      categoriaSelecionada === 'Todos' ||
      produto.categoria === categoriaSelecionada

    return correspondePesquisa && correspondeCategoria
  })

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-cyan-500/20 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">
          ⚡ Loja Tech 3D
        </h1>

        <div className="flex gap-5 items-center">
          <a href="#produtos" className="text-gray-300 hover:text-cyan-400">
            Produtos
          </a>

          <a href="/carrinho" className="text-gray-300 hover:text-cyan-400">
            🛒 Carrinho ({itens.length})
          </a>

          <a href="/meus-pedidos" className="text-gray-300 hover:text-cyan-400">
            📦 Meus Pedidos
          </a>

          {usuario ? (
            <div className="flex gap-3 items-center">
              <span className="text-cyan-400 font-bold">
                Olá, {usuario.nome}
              </span>

              <button
                onClick={sair}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl text-sm font-bold"
              >
                Sair
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-xl text-sm font-bold"
            >
              Entrar
            </a>
          )}
        </div>
      </nav>

      <section className="relative h-[560px] overflow-hidden flex items-center justify-center">
        <motion.img
          key={bannerAtual}
          src={banners[bannerAtual].imagem}
          alt="Banner"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h2
            key={banners[bannerAtual].titulo}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black mb-6 text-white"
          >
            {banners[bannerAtual].titulo}
          </motion.h2>

          <motion.p
            key={banners[bannerAtual].subtitulo}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            {banners[bannerAtual].subtitulo}
          </motion.p>

          <a
            href="#produtos"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.45)]"
          >
            Ver Produtos
          </a>
        </div>

        <button
          onClick={bannerAnterior}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-cyan-500/80 w-14 h-14 rounded-full text-3xl"
        >
          ←
        </button>

        <button
          onClick={proximoBanner}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-cyan-500/80 w-14 h-14 rounded-full text-3xl"
        >
          →
        </button>

        <div className="absolute bottom-7 flex gap-3 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerAtual(i)}
              className={`w-4 h-4 rounded-full ${
                i === bannerAtual ? 'bg-cyan-400' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="px-8 py-12 bg-gradient-to-r from-cyan-950 via-blue-950 to-gray-950 border-y border-cyan-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-8 text-cyan-400">
            🔥 Promoções da Semana
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-3xl border border-cyan-500/20">
              <span className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                OFERTA
              </span>

              <h3 className="text-2xl font-bold mt-4">Notebook Pro X</h3>
              <p className="line-through text-gray-500">R$ 6.999,90</p>
              <p className="text-4xl font-black text-cyan-400">R$ 5.999,90</p>
              <p className="text-blue-300 mt-2">Economize 15%</p>
            </div>

            <div className="bg-black/40 p-6 rounded-3xl border border-cyan-500/20">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                MAIS VENDIDO
              </span>

              <h3 className="text-2xl font-bold mt-4">Headset Gamer 7.1</h3>
              <p className="line-through text-gray-500">R$ 550,00</p>
              <p className="text-4xl font-black text-cyan-400">R$ 399,90</p>
              <p className="text-blue-300 mt-2">Economia de R$ 150</p>
            </div>

            <div className="bg-black/40 p-6 rounded-3xl border border-cyan-500/20">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                LANÇAMENTO
              </span>

              <h3 className="text-2xl font-bold mt-4">Teclado Mecânico RGB</h3>
              <p className="line-through text-gray-500">R$ 299,90</p>
              <p className="text-4xl font-black text-cyan-400">R$ 199,90</p>
              <p className="text-blue-300 mt-2">Desconto Especial</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-10 bg-black border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
            <p className="text-4xl mb-3">🚚</p>
            <h3 className="font-bold text-cyan-400">Frete para todo Brasil</h3>
            <p className="text-gray-400 text-sm mt-2">Receba seus produtos com segurança.</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
            <p className="text-4xl mb-3">🔒</p>
            <h3 className="font-bold text-cyan-400">Pagamento Seguro</h3>
            <p className="text-gray-400 text-sm mt-2">Compra protegida via Mercado Pago.</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
            <p className="text-4xl mb-3">⭐</p>
            <h3 className="font-bold text-cyan-400">Clientes Satisfeitos</h3>
            <p className="text-gray-400 text-sm mt-2">Produtos selecionados para gamers.</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
            <p className="text-4xl mb-3">🎧</p>
            <h3 className="font-bold text-cyan-400">Suporte 24h</h3>
            <p className="text-gray-400 text-sm mt-2">Atendimento rápido quando precisar.</p>
          </div>
        </div>
      </section>

      <section id="produtos" className="px-8 py-16">
        <h2 className="text-4xl font-black mb-3 text-center">
          ✨ Produtos Futuristas
        </h2>

        <p className="text-gray-400 text-center mb-10">
          Gadgets, acessórios e tecnologia premium para seu setup.
        </p>

        <div className="max-w-xl mx-auto mb-6">
          <input
            type="text"
            placeholder="🔍 Pesquisar produto..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="w-full bg-gray-900 border border-cyan-500/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`px-5 py-2 rounded-xl font-bold transition-all ${
                categoriaSelecionada === categoria
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-900 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-black'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {produtosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400">
            Nenhum produto encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {produtosFiltrados.map((produto, index) => {
              const avaliacao = avaliacaoProduto(produto)

              return (
                <motion.div
                  key={produto.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative bg-gray-900 rounded-3xl overflow-hidden border border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all"
                >
                  <div className="absolute top-4 left-4 z-20 bg-cyan-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                    {seloProduto(produto)}
                  </div>

                  <div className="absolute top-4 right-4 z-20 bg-black/70 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                    {produto.categoria || 'Geral'}
                  </div>

                  <a href={`/produto/${produto.id}`} className="block overflow-hidden h-56 bg-black">
                    {produto.imagem ? (
                      <img
                        src={`/imagens/${produto.imagem}`}
                        alt={produto.nome}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-7xl">🚀</span>
                      </div>
                    )}
                  </a>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {produto.nome}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4">
                      {produto.descricao}
                    </p>

                    <div className="mb-5">
                      <p className="text-yellow-400 font-bold">
                        ⭐⭐⭐⭐⭐ {avaliacao.nota}
                      </p>

                      <p className="text-gray-500 text-sm">
                        {avaliacao.total} avaliações
                      </p>
                    </div>

                    <span className="text-cyan-400 text-3xl font-bold">
                      R$ {produto.preco.toFixed(2)}
                    </span>

                    <a
                      href={`/produto/${produto.id}`}
                      className="block mt-5 text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      Ver detalhes →
                    </a>

                    <button
                      onClick={() =>
                        adicionar({
                          id: produto.id,
                          nome: produto.nome,
                          preco: produto.preco,
                          imagem: produto.imagem
                        })
                      }
                      className="mt-5 w-full py-3 rounded-xl border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all font-bold"
                    >
                      ➕ Adicionar ao Carrinho
                    </button>

                    <button
                      onClick={() => comprar(produto.nome, produto.preco)}
                      className="mt-3 w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all"
                    >
                      🛒 Comprar Agora
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      <footer className="bg-black border-t border-cyan-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-2xl font-black text-cyan-400 mb-4">
                ⚡ Loja Tech 3D
              </h3>

              <p className="text-gray-400">
                Produtos gamer, periféricos e tecnologia futurista para elevar seu setup ao próximo nível.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">
                Navegação
              </h4>

              <div className="flex flex-col gap-2">
                <a href="#produtos" className="text-gray-400 hover:text-cyan-400">
                  Produtos
                </a>

                <a href="/carrinho" className="text-gray-400 hover:text-cyan-400">
                  Carrinho
                </a>

                <a href="/meus-pedidos" className="text-gray-400 hover:text-cyan-400">
                  Meus Pedidos
                </a>

                <a href="/login" className="text-gray-400 hover:text-cyan-400">
                  Login
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">
                Atendimento
              </h4>

              <div className="flex flex-col gap-2 text-gray-400">
                <span>📧 suporte@lojatech3d.com</span>
                <span>📱 (85) 99999-9999</span>
                <span>🕒 Atendimento 24h</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">
                Segurança
              </h4>

              <div className="flex flex-col gap-2 text-gray-400">
                <span>🔒 Pagamento Seguro</span>
                <span>🚚 Frete para todo Brasil</span>
                <span>⭐ Clientes Satisfeitos</span>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-500/20 mt-10 pt-6 text-center text-gray-500">
            © 2026 Loja Tech 3D — Todos os direitos reservados
          </div>
        </div>
      </footer>
    </main>
  )
}