export default function Banner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-800 rounded-3xl p-12 text-white shadow-2xl">

        <h1 className="text-5xl font-black mb-4">
          ⚡ Loja Tech 3D
        </h1>

        <p className="text-xl text-cyan-100 mb-8">
          Produtos gamer, periféricos e tecnologia premium para elevar seu setup.
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-black/20 px-4 py-2 rounded-xl">
            🚚 Frete para todo Brasil
          </div>

          <div className="bg-black/20 px-4 py-2 rounded-xl">
            💳 Até 12x sem juros
          </div>

          <div className="bg-black/20 px-4 py-2 rounded-xl">
            🔥 Ofertas exclusivas
          </div>
        </div>

        <a
          href="#produtos"
          className="inline-block bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
        >
          Comprar Agora
        </a>

      </div>
    </section>
  )
}