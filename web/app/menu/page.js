import DigitalMenuClient from "./DigitalMenuClient"

export const metadata = {
  title: { absolute: "Menú | Los Carnales" },
  description: "Explora el menú de Los Carnales y arma tu pedido desde el celular.",
}

export default function MenuPage() {
  return (
    <div className="los-carnales-menu">
      <style>{`
        .los-carnales-menu article > div:first-child > span.absolute {
          display: none;
        }
      `}</style>
      <DigitalMenuClient />
    </div>
  )
}
