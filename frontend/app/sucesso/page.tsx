export default function Sucesso() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-10 text-center">
        <h1 className="text-5xl mb-4">✅</h1>
        <h2 className="text-3xl font-bold text-green-400 mb-4">
          Pagamento aprovado!
        </h2>
        <p className="text-gray-400 mb-6">
          Obrigado pela sua compra!
        </p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
          Voltar para a loja
        </a>
      </div>
    </main>
  )
}