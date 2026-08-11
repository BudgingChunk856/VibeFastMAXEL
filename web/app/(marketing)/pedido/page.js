import VoiceOrderClient from "./VoiceOrderClient"

export const metadata = {
  title: "Pedido por voz | Carnalito",
  description: "Prueba inicial de captura de voz para pedidos de Los Carnales.",
}

export default function PedidoPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Carnalito
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Haz tu pedido hablando
        </h1>
        <p className="mt-4 text-base-content/70">
          Esta primera etapa valida el acceso al micrófono y convierte la voz en texto.
          Todavía no agrega productos al carrito: primero queremos asegurar que la captura
          funcione de forma estable.
        </p>
      </div>

      <div className="mt-10">
        <VoiceOrderClient />
      </div>
    </section>
  )
}
