"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Beef,
  CupSoda,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  UserRound,
  UtensilsCrossed,
} from "lucide-react"

const categories = [
  { id: "todos", label: "Todo" },
  { id: "tacos", label: "Tacos" },
  { id: "especialidades", label: "Especialidades" },
  { id: "bebidas", label: "Bebidas" },
]

const products = [
  {
    id: "orden-tacos",
    name: "Orden de tacos",
    category: "tacos",
    detail: "4 piezas",
    description: "Una orden clásica para disfrutar el sabor de Los Carnales.",
    ingredients: ["Tortillas de maíz", "200 g de carne"],
    price: null,
    icon: Beef,
    featured: true,
  },
  {
    id: "montado",
    name: "Montado",
    category: "especialidades",
    detail: "Especialidad",
    description: "Tortilla de harina con carne y asadero, preparada al estilo de la casa.",
    ingredients: ["Tortilla de harina", "150 g de carne", "Asadero"],
    price: null,
    icon: UtensilsCrossed,
    featured: true,
  },
  {
    id: "quesicarne",
    name: "Quesicarne",
    category: "especialidades",
    detail: "Especialidad",
    description: "Tortilla de maíz con carne y asadero para una combinación sencilla y contundente.",
    ingredients: ["Tortilla de maíz", "150 g de carne", "Asadero"],
    price: null,
    icon: Sparkles,
    featured: false,
  },
  {
    id: "refresco",
    name: "Refresco",
    category: "bebidas",
    detail: "Bebida",
    description: "Acompaña tu pedido con un refresco. La disponibilidad puede variar.",
    ingredients: [],
    price: null,
    icon: CupSoda,
    featured: false,
  },
  {
    id: "agua-fresca",
    name: "Agua fresca",
    category: "bebidas",
    detail: "Bebida",
    description: "Una opción fresca para acompañar tu comida. Consulta los sabores disponibles.",
    ingredients: [],
    price: null,
    icon: CupSoda,
    featured: true,
  },
  {
    id: "agua",
    name: "Agua",
    category: "bebidas",
    detail: "Bebida",
    description: "Agua para acompañar tu pedido.",
    ingredients: [],
    price: null,
    icon: CupSoda,
    featured: false,
  },
]

function formatPrice(price) {
  if (typeof price !== "number") return "Precio por definir"

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(price)
}

function normalizedPhone(value) {
  return value.replace(/\D/g, "").slice(0, 10)
}

function formatPhone(value) {
  const digits = normalizedPhone(value)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

export default function DigitalMenuClient() {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState("cart")
  const [orderType, setOrderType] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [table, setTable] = useState("")

  const visibleProducts = useMemo(() => {
    if (activeCategory === "todos") return products
    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cart[product.id])
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart]
  )

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const phoneDigits = normalizedPhone(phone)
  const customerDataValid =
    customerName.trim().length >= 2 &&
    phoneDigits.length === 10 &&
    Boolean(orderType) &&
    (orderType !== "dine-in" || table.trim().length > 0)

  function addProduct(productId) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1,
    }))
  }

  function decreaseProduct(productId) {
    setCart((current) => {
      const next = { ...current }
      const nextQuantity = (next[productId] || 0) - 1

      if (nextQuantity <= 0) delete next[productId]
      else next[productId] = nextQuantity

      return next
    })
  }

  function removeProduct(productId) {
    setCart((current) => {
      const next = { ...current }
      delete next[productId]
      return next
    })
  }

  function closeCart() {
    setCartOpen(false)
    setCheckoutStep("cart")
  }

  function openCart() {
    setCheckoutStep("cart")
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-base-200/40 pb-28">
      <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/menu" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-sm">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-black leading-tight text-base-content">Los Carnales</p>
              <p className="text-xs text-base-content/45">Menú digital</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <a href="#menu" className="btn btn-ghost btn-sm rounded-xl">Menú</a>
            <button
              type="button"
              onClick={openCart}
              disabled={itemCount === 0}
              className="btn btn-primary btn-sm rounded-xl"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Mi pedido</span>
              {itemCount > 0 && <span className="font-black">{itemCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <UtensilsCrossed className="h-4 w-4" />
              Menú digital
            </div>
            <h1 className="text-4xl font-black tracking-tight text-base-content sm:text-5xl">
              ¿Qué se te antoja hoy?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/65 sm:text-lg">
              Conoce qué incluye cada producto, elige lo que quieras y arma tu pedido desde el celular.
            </p>
          </div>
        </div>
      </section>

      <main id="menu" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="sticky top-16 z-20 -mx-1 mb-8 overflow-x-auto px-1 py-2">
          <div className="flex min-w-max gap-2 rounded-2xl border border-base-300 bg-base-100/95 p-2 shadow-sm backdrop-blur">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-content shadow-sm"
                    : "text-base-content/70 hover:bg-base-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Los Carnales</p>
            <h2 className="mt-1 text-2xl font-black text-base-content">Nuestro menú</h2>
          </div>
          <span className="hidden text-sm text-base-content/50 sm:block">{visibleProducts.length} productos</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const Icon = product.icon
            const quantity = cart[product.id] || 0

            return (
              <article key={product.id} className="group overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/15 bg-base-100/80 shadow-sm backdrop-blur">
                    <Icon className="h-11 w-11 text-primary" strokeWidth={1.7} />
                  </div>
                  {product.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-base-100 px-3 py-1 text-xs font-bold text-base-content shadow-sm">Favorito</span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/80">{product.detail}</p>
                  <h3 className="mt-1 text-xl font-black text-base-content">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-base-content/60">{product.description}</p>

                  {product.ingredients.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-base-200/70 p-4">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-base-content/55">Incluye</p>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ingredient) => (
                          <span key={ingredient} className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/75">{ingredient}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-base-300 pt-4">
                    <div>
                      <p className="text-xs text-base-content/45">Precio</p>
                      <p className="mt-0.5 text-sm font-extrabold text-base-content">{formatPrice(product.price)}</p>
                    </div>

                    {quantity === 0 ? (
                      <button type="button" onClick={() => addProduct(product.id)} className="btn btn-primary btn-sm rounded-xl px-4">
                        <Plus className="h-4 w-4" /> Agregar
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-base-200 p-1">
                        <button type="button" onClick={() => decreaseProduct(product.id)} className="btn btn-ghost btn-xs h-8 min-h-8 w-8 rounded-lg p-0" aria-label={`Quitar una unidad de ${product.name}`}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-black">{quantity}</span>
                        <button type="button" onClick={() => addProduct(product.id)} className="btn btn-primary btn-xs h-8 min-h-8 w-8 rounded-lg p-0" aria-label={`Agregar una unidad de ${product.name}`}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <footer className="mt-12 border-t border-base-300 bg-base-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 font-black text-base-content">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              Los Carnales
            </div>
            <p className="mt-2 max-w-md text-sm leading-6 text-base-content/55">
              Menú digital en desarrollo. Próximamente añadiremos precios, pago y confirmación del pedido.
            </p>
          </div>
          <p className="text-xs text-base-content/40">© 2026 Los Carnales</p>
        </div>
      </footer>

      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="mx-auto max-w-3xl">
            <button type="button" onClick={openCart} className="flex w-full items-center justify-between rounded-2xl bg-neutral px-5 py-4 text-neutral-content shadow-2xl transition hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-content/10">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-black text-primary-content">{itemCount}</span>
                </span>
                <div className="text-left">
                  <p className="text-sm font-black">Ver mi pedido</p>
                  <p className="text-xs text-neutral-content/60">{itemCount} {itemCount === 1 ? "producto" : "productos"}</p>
                </div>
              </div>
              <span className="text-sm font-bold">Revisar</span>
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 p-4 backdrop-blur-sm" onClick={closeCart}>
          <div className="ml-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-3xl bg-base-100 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-base-300 p-5">
              <div className="flex items-center gap-3">
                {checkoutStep !== "cart" && (
                  <button type="button" onClick={() => setCheckoutStep(checkoutStep === "ready" ? "details" : "cart")} className="btn btn-ghost btn-sm h-10 min-h-10 w-10 rounded-xl p-0" aria-label="Regresar">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Los Carnales</p>
                  <h2 className="mt-1 text-2xl font-black">
                    {checkoutStep === "cart" && "Tu pedido"}
                    {checkoutStep === "details" && "Datos del pedido"}
                    {checkoutStep === "ready" && "Listo para pago"}
                  </h2>
                </div>
              </div>
              <button type="button" onClick={closeCart} className="btn btn-ghost btn-sm rounded-xl">Cerrar</button>
            </div>

            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-base-300 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-base-content">{item.name}</p>
                            <p className="mt-1 text-xs text-base-content/50">{formatPrice(item.price)}</p>
                          </div>
                          <button type="button" onClick={() => removeProduct(item.id)} className="btn btn-ghost btn-xs rounded-lg text-error" aria-label={`Eliminar ${item.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-base-content/50">Cantidad</span>
                          <div className="flex items-center gap-2 rounded-xl bg-base-200 p-1">
                            <button type="button" onClick={() => decreaseProduct(item.id)} className="btn btn-ghost btn-xs h-8 min-h-8 w-8 rounded-lg p-0"><Minus className="h-4 w-4" /></button>
                            <span className="min-w-5 text-center text-sm font-black">{item.quantity}</span>
                            <button type="button" onClick={() => addProduct(item.id)} className="btn btn-primary btn-xs h-8 min-h-8 w-8 rounded-lg p-0"><Plus className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-base-300 bg-base-200/50 p-5">
                  <div className="mb-4 rounded-2xl bg-warning/10 px-4 py-3 text-sm leading-5 text-base-content/70">
                    Los precios todavía no están cargados; por ahora este flujo sirve para validar la experiencia antes del pago real.
                  </div>
                  <button type="button" onClick={() => setCheckoutStep("details")} className="btn btn-primary w-full rounded-xl">Continuar</button>
                </div>
              </>
            )}

            {checkoutStep === "details" && (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  <div>
                    <p className="text-sm font-black text-base-content">¿Cómo quieres tu pedido?</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setOrderType("dine-in")} className={`rounded-2xl border p-4 text-left transition ${orderType === "dine-in" ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-base-300 hover:bg-base-200/60"}`}>
                        <Store className="h-6 w-6 text-primary" />
                        <p className="mt-3 font-black">Comer aquí</p>
                        <p className="mt-1 text-xs leading-5 text-base-content/55">El pedido se entregará en tu mesa.</p>
                      </button>
                      <button type="button" onClick={() => { setOrderType("takeout"); setTable("") }} className={`rounded-2xl border p-4 text-left transition ${orderType === "takeout" ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-base-300 hover:bg-base-200/60"}`}>
                        <PackageCheck className="h-6 w-6 text-primary" />
                        <p className="mt-3 font-black">Para llevar</p>
                        <p className="mt-1 text-xs leading-5 text-base-content/55">Recoge tu pedido cuando esté listo.</p>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-base-content"><UserRound className="h-4 w-4 text-primary" /> Nombre</span>
                      <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Ej. Miguel" autoComplete="name" className="input input-bordered w-full rounded-xl" />
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-base-content"><Phone className="h-4 w-4 text-primary" /> Teléfono</span>
                      <input type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} placeholder="Ej. 614 123 4567" autoComplete="tel" className="input input-bordered w-full rounded-xl" />
                      <span className="mt-2 block text-xs leading-5 text-base-content/50">Lo usaremos para identificar el pedido. Los recibos por SMS se habilitarán más adelante.</span>
                    </label>

                    {orderType === "dine-in" && (
                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-base-content"><MapPin className="h-4 w-4 text-primary" /> Número de mesa</span>
                        <input type="text" inputMode="numeric" value={table} onChange={(event) => setTable(event.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="Ej. 4" className="input input-bordered w-full rounded-xl" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="border-t border-base-300 bg-base-200/50 p-5">
                  <button type="button" disabled={!customerDataValid} onClick={() => setCheckoutStep("ready")} className="btn btn-primary w-full rounded-xl">Revisar antes de pagar</button>
                  {!customerDataValid && <p className="mt-2 text-center text-xs text-base-content/45">Completa tipo de pedido, nombre, teléfono y mesa cuando corresponda.</p>}
                </div>
              </>
            )}

            {checkoutStep === "ready" && (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="rounded-3xl border border-base-300 bg-base-200/40 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">Resumen</p>
                    <dl className="mt-4 space-y-4 text-sm">
                      <div><dt className="text-base-content/45">Cliente</dt><dd className="mt-1 font-black">{customerName.trim()}</dd></div>
                      <div><dt className="text-base-content/45">Teléfono</dt><dd className="mt-1 font-black">{formatPhone(phone)}</dd></div>
                      <div><dt className="text-base-content/45">Tipo de pedido</dt><dd className="mt-1 font-black">{orderType === "dine-in" ? "Comer aquí" : "Para llevar"}</dd></div>
                      {orderType === "dine-in" && <div><dt className="text-base-content/45">Mesa</dt><dd className="mt-1 font-black">Mesa {table.trim()}</dd></div>}
                      <div>
                        <dt className="text-base-content/45">Productos</dt>
                        <dd className="mt-2 space-y-1">
                          {cartItems.map((item) => <div key={item.id} className="flex justify-between gap-3"><span>{item.name}</span><strong>× {item.quantity}</strong></div>)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-4 rounded-2xl bg-info/10 px-4 py-3 text-sm leading-6 text-base-content/70">Este es el punto donde conectaremos el pago. Todavía no se guarda ni se envía ningún pedido real.</div>
                </div>

                <div className="border-t border-base-300 bg-base-200/50 p-5">
                  <button type="button" disabled className="btn btn-primary w-full rounded-xl">Continuar al pago</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
