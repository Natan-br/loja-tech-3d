import type { Metadata } from 'next'
import './globals.css'
import { CarrinhoProvider } from './CarrinhoContext'

export const metadata: Metadata = {
  title: 'Loja Tech 3D',
  description: 'Loja futurista tech 3D'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CarrinhoProvider>
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  )
}