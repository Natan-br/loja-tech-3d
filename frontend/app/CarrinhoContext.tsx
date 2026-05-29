'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ProdutoCarrinho {
  id: number
  nome: string
  preco: number
  imagem: string
}

interface CarrinhoContextType {
  itens: ProdutoCarrinho[]
  adicionar: (produto: ProdutoCarrinho) => void
  remover: (index: number) => void
  limpar: () => void
}

const CarrinhoContext = createContext({} as CarrinhoContextType)

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ProdutoCarrinho[]>([])

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho')
    if (carrinhoSalvo) {
      setItens(JSON.parse(carrinhoSalvo))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens))
  }, [itens])

  function adicionar(produto: ProdutoCarrinho) {
    setItens(prev => [...prev, produto])
    alert('Produto adicionado ao carrinho!')
  }

  function remover(index: number) {
    setItens(prev => prev.filter((_, i) => i !== index))
  }

  function limpar() {
    setItens([])
  }

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, limpar }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  return useContext(CarrinhoContext)
}