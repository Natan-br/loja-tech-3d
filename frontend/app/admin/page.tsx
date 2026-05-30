'use client'

import { useEffect, useState } from 'react'

interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem: string
  categoria: string
}

export default function AdminPage() {
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [imagem, setImagem] = useState('')
  const [categoria, setCategoria] = useState('Geral')
  const [produtoEditandoId, setProdutoEditandoId] = useState<number | null>(null)

  const [totalProdutos, setTotalProdutos] = useState(0)
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [faturamento, setFaturamento] = useState(0)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      window.location.href = '/login'
      return
    }

    const usuarioConvertido = JSON.parse(usuarioSalvo)

    if (usuarioConvertido.tipo !== 'admin') {
      alert('Acesso negado. Apenas administradores.')
      window.location.href = '/'
      return
    }

    setUsuario(usuarioConvertido)
    setCarregando(false)

    carregarProdutos()
    carregarDashboard()
  }, [])

  async function carregarDashboard() {
    const resposta = await fetch('https://loja-tech-3d-production.up.railway.app/pedidos')
    const dados = await resposta.json()

    setTotalProdutos(dados.produtos)
    setTotalUsuarios(dados.usuarios)
    setTotalPedidos(dados.pedidos)
    setFaturamento(dados.faturamento)
  }

  async function carregarProdutos() {
    const resposta = await fetch('http://localhost:3333/produtos')
    const dados = await resposta.json()

    setProdutos(dados)
  }

  async function enviarImagem(arquivo: File) {
    const formData = new FormData()
    formData.append('imagem', arquivo)

    const resposta = await fetch('http://localhost:3333/upload', {
      method: 'POST',
      body: formData
    })

    const dados = await resposta.json()

    if (dados.arquivo) {
      setImagem(dados.arquivo)
      alert('Imagem enviada!')
    }
  }

  function limparCampos() {
    setNome('')
    setDescricao('')
    setPreco('')
    setImagem('')
    setCategoria('Geral')
    setProdutoEditandoId(null)
  }

  function sair() {
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  }

  async function salvarProduto() {
    if (!nome || !descricao || !preco || !imagem || !categoria) {
      alert('Preencha todos os campos')
      return
    }

    const dadosProduto = {
      nome,
      descricao,
      preco: Number(preco),
      imagem,
      modelo3d: '',
      categoria
    }

    if (produtoEditandoId) {
      await fetch(`http://localhost:3333/produtos/${produtoEditandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosProduto)
      })

      alert('Produto atualizado!')
    } else {
      await fetch('http://localhost:3333/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosProduto)
      })

      alert('Produto cadastrado!')
    }

    limparCampos()
    carregarProdutos()
    carregarDashboard()
  }

  function editarProduto(produto: Produto) {
    setProdutoEditandoId(produto.id)
    setNome(produto.nome)
    setDescricao(produto.descricao)
    setPreco(String(produto.preco))
    setImagem(produto.imagem)
    setCategoria(produto.categoria || 'Geral')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function excluirProduto(id: number) {
    if (!confirm('Excluir produto?')) return

    await fetch(`http://localhost:3333/produtos/${id}`, {
      method: 'DELETE'
    })

    carregarProdutos()
    carregarDashboard()
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Carregando...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-cyan-400">
            🛠️ Painel Admin
          </h1>

          <p className="text-gray-400 mt-2">
            Logado como: {usuario?.nome}
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/admin/pedidos"
            className="bg-cyan-500 text-black px-5 py-2 rounded-xl font-bold"
          >
            Ver Pedidos
          </a>

          <button
            onClick={sair}
            className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl font-bold"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
          <h2 className="text-xl font-bold">📦 Produtos</h2>
          <p className="text-5xl font-black text-cyan-400 mt-3">
            {totalProdutos}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
          <h2 className="text-xl font-bold">👤 Usuários</h2>
          <p className="text-5xl font-black text-cyan-400 mt-3">
            {totalUsuarios}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
          <h2 className="text-xl font-bold">🛒 Pedidos</h2>
          <p className="text-5xl font-black text-cyan-400 mt-3">
            {totalPedidos}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-cyan-500/20">
          <h2 className="text-xl font-bold">💰 Faturamento</h2>
          <p className="text-3xl font-black text-cyan-400 mt-4">
            R$ {faturamento.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-900 p-8 rounded-2xl border border-cyan-500/20">
          <h2 className="text-2xl font-bold mb-6">
            {produtoEditandoId ? 'Editar Produto' : 'Cadastrar Produto'}
          </h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full p-3 mb-4 bg-black rounded border border-gray-700"
          />

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="w-full p-3 mb-4 bg-black rounded border border-gray-700"
          />

          <input
            placeholder="Preço"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            className="w-full p-3 mb-4 bg-black rounded border border-gray-700"
          />

          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full p-3 mb-4 bg-black rounded border border-gray-700"
          >
            <option value="Geral">Geral</option>
            <option value="Tênis">Tênis</option>
            <option value="Mouse">Mouse</option>
            <option value="Teclado">Teclado</option>
            <option value="Notebook">Notebook</option>
            <option value="Headset">Headset</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                enviarImagem(e.target.files[0])
              }
            }}
            className="w-full p-3 mb-4 bg-black rounded border border-gray-700"
          />

          {imagem && (
            <div className="mb-4">
              <p className="text-cyan-400 text-sm mb-2">
                Imagem atual: {imagem}
              </p>

              <img
                src={`/imagens/${imagem}`}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl border border-cyan-500/20"
              />
            </div>
          )}

          <button
            onClick={salvarProduto}
            className="w-full bg-cyan-500 text-black py-3 rounded-xl font-bold"
          >
            {produtoEditandoId ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>

          {produtoEditandoId && (
            <button
              onClick={limparCampos}
              className="w-full mt-3 bg-gray-700 text-white py-3 rounded-xl font-bold"
            >
              Cancelar Edição
            </button>
          )}

          <a href="/" className="block mt-5 text-cyan-400">
            ← Voltar para loja
          </a>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-cyan-500/20">
          <h2 className="text-2xl font-bold mb-6">Produtos</h2>

          {produtos.map(produto => (
            <div
              key={produto.id}
              className="bg-black p-4 rounded-xl mb-3 flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={`/imagens/${produto.imagem}`}
                  alt={produto.nome}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div>
                  <h3 className="font-bold">{produto.nome}</h3>

                  <p className="text-yellow-400 text-sm">
                    {produto.categoria || 'Geral'}
                  </p>

                  <p className="text-cyan-400">
                    R$ {produto.preco.toFixed(2)}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {produto.imagem}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editarProduto(produto)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
                >
                  Editar
                </button>

                <button
                  onClick={() => excluirProduto(produto.id)}
                  className="bg-red-600 px-4 py-2 rounded font-bold"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}