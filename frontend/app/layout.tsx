import type { Metadata } from 'next'
import './globals.css'
import { CarrinhoProvider } from './CarrinhoContext'
import { Toaster } from 'react-hot-toast'
import { FaWhatsapp } from 'react-icons/fa'

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

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: '#020617',
                color: '#fff',
                border: '1px solid #06b6d4',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)'
              }
            }}
          />

          <a
            href="https://wa.me/5585999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:scale-110 transition-all"
          >
            <FaWhatsapp />
          </a>
        </CarrinhoProvider>
      </body>
    </html>
  )
}