const bcrypt = require('bcryptjs')
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
//const mercadopago = require('mercadopago')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express()
const prisma = new PrismaClient()

// mercadopago.configure({
//   access_token: process.env.MP_ACCESS_TOKEN
// })

app.use(cors())
app.use(express.json())

const pastaImagens = path.join(__dirname, '../uploads')

if (!fs.existsSync(pastaImagens)) {
  fs.mkdirSync(pastaImagens, { recursive: true })
}

app.use('/imagens', express.static(pastaImagens))

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, pastaImagens)
  },
  filename: (req: any, file: any, cb: any) => {
    const nomeUnico = Date.now() + '-' + file.originalname.replace(/\s/g, '-')
    cb(null, nomeUnico)
  }
})

const upload = multer({ storage })

app.get('/', (req: any, res: any) => {
  res.send('Servidor funcionando')
})

app.post('/upload', upload.single('imagem'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhuma imagem enviada' })
  }

  res.json({ arquivo: req.file.filename })
})

app.get('/dashboard', async (req: any, res: any) => {
  const totalProdutos = await prisma.produto.count()
  const totalUsuarios = await prisma.usuario.count()
  const totalPedidos = await prisma.pedido.count()
  const pedidos = await prisma.pedido.findMany()

  const faturamento = pedidos.reduce((total: number, pedido: any) => {
    return total + Number(pedido.total)
  }, 0)

  res.json({
    produtos: totalProdutos,
    usuarios: totalUsuarios,
    pedidos: totalPedidos,
    faturamento
  })
})

app.get('/produtos', async (req: any, res: any) => {
  const produtos = await prisma.produto.findMany()
  res.json(produtos)
})

app.get('/produtos/:id', async (req: any, res: any) => {
  const produto = await prisma.produto.findUnique({
    where: { id: Number(req.params.id) }
  })

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' })
  }

  res.json(produto)
})

app.post('/produtos', async (req: any, res: any) => {
  const { nome, descricao, preco, imagem, modelo3d, categoria } = req.body

  const produto = await prisma.produto.create({
    data: {
      nome,
      descricao,
      preco: Number(preco),
      imagem,
      modelo3d: modelo3d || '',
      categoria: categoria || 'Geral'
    }
  })

  res.json(produto)
})

app.put('/produtos/:id', async (req: any, res: any) => {
  const { nome, descricao, preco, imagem, modelo3d, categoria } = req.body

  const produto = await prisma.produto.update({
    where: { id: Number(req.params.id) },
    data: {
      nome,
      descricao,
      preco: Number(preco),
      imagem,
      modelo3d: modelo3d || '',
      categoria: categoria || 'Geral'
    }
  })

  res.json(produto)
})

app.delete('/produtos/:id', async (req: any, res: any) => {
  await prisma.produto.delete({
    where: { id: Number(req.params.id) }
  })

  res.json({ mensagem: 'Produto excluído com sucesso' })
})

app.post('/cadastro', async (req: any, res: any) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' })
  }

  const usuarioExiste = await prisma.usuario.findUnique({
    where: { email }
  })

  if (usuarioExiste) {
    return res.status(400).json({ erro: 'E-mail já cadastrado' })
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10)

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaCriptografada
    }
  })

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo
  })
})

app.post('/login', async (req: any, res: any) => {
  const { email, senha } = req.body

  const usuario = await prisma.usuario.findUnique({
    where: { email }
  })

  if (!usuario) {
    return res.status(400).json({ erro: 'E-mail ou senha inválidos' })
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

  if (!senhaCorreta) {
    return res.status(400).json({ erro: 'E-mail ou senha inválidos' })
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo
  })
})

app.get('/pedidos', async (req: any, res: any) => {
  const pedidos = await prisma.pedido.findMany({
    include: { usuario: true },
    orderBy: { createdAt: 'desc' }
  })

  res.json(pedidos)
})

app.get('/pedidos/usuario/:usuarioId', async (req: any, res: any) => {
  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: Number(req.params.usuarioId) },
    orderBy: { createdAt: 'desc' }
  })

  res.json(pedidos)
})

app.put('/pedidos/:id/status', async (req: any, res: any) => {
  const { status } = req.body

  const pedido = await prisma.pedido.update({
    where: { id: Number(req.params.id) },
    data: { status }
  })

  res.json(pedido)
})

app.post('/pagamento', async (req: any, res: any) => {
  const { nome, preco } = req.body

  const result = await mercadopago.preferences.create({
    items: [
      {
        id: '1',
        title: nome,
        quantity: 1,
        unit_price: Number(preco),
        currency_id: 'BRL'
      }
    ],
    back_urls: {
      success: 'https://loja-tech-3d.vercel.app',
      failure: 'https://loja-tech-3d.vercel.app',
      pending: 'https://loja-tech-3d.vercel.app'
    },
    auto_return: 'approved'
  })

  res.json({
    url: result.body.init_point || result.init_point
  })
})

app.post('/pagamento-carrinho', async (req: any, res: any) => {
  const { itens, usuarioId } = req.body

  if (!itens || itens.length === 0) {
    return res.status(400).json({ erro: 'Carrinho vazio' })
  }

  const total = itens.reduce((acc: number, item: any) => acc + Number(item.preco), 0)

  if (usuarioId) {
    await prisma.pedido.create({
      data: {
        usuarioId: Number(usuarioId),
        produtos: JSON.stringify(itens),
        total,
        status: 'pendente'
      }
    })
  }

  const result = await mercadopago.preferences.create({
    items: itens.map((item: any) => ({
      id: String(item.id),
      title: item.nome,
      quantity: 1,
      unit_price: Number(item.preco),
      currency_id: 'BRL'
    })),
    back_urls: {
      success: 'https://loja-tech-3d.vercel.app',
      failure: 'https://loja-tech-3d.vercel.app',
      pending: 'https://loja-tech-3d.vercel.app'
    },
    auto_return: 'approved'
  })

  res.json({
    url: result.body.init_point || result.init_point
  })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})