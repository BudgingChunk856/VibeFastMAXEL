import { NextResponse } from "next/server"

const MAX_AUDIO_BYTES = 8 * 1024 * 1024
const TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions"

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim()

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada en el servidor." },
        { status: 500 }
      )
    }

    const incomingForm = await request.formData()
    const audio = incomingForm.get("audio")

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        { error: "No se recibió una grabación válida." },
        { status: 400 }
      )
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "La grabación es demasiado grande. Intenta un pedido más corto." },
        { status: 413 }
      )
    }

    const formData = new FormData()
    formData.append("file", audio, audio.name || "pedido.webm")
    formData.append("model", "gpt-4o-mini-transcribe")
    formData.append("language", "es")
    formData.append(
      "prompt",
      "Pedido para la taquería Los Carnales. Puede mencionar tacos, montados, quesicarnes, bebidas, cantidades y notas como sin cebolla o sin hielo."
    )

    const response = await fetch(TRANSCRIPTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const upstreamMessage = payload?.error?.message || "Error de transcripción en OpenAI."
      console.error("[ai/transcribe] OpenAI", response.status, upstreamMessage)

      return NextResponse.json(
        { error: upstreamMessage },
        { status: response.status >= 400 && response.status < 500 ? response.status : 502 }
      )
    }

    const text = payload?.text?.trim()

    if (!text) {
      return NextResponse.json(
        { error: "No se detectó voz suficiente para transcribir." },
        { status: 422 }
      )
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error("[ai/transcribe]", error)
    return NextResponse.json(
      { error: "No fue posible conectar con el servicio de transcripción." },
      { status: 502 }
    )
  }
}
