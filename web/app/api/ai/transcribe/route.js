import { NextResponse } from "next/server"
import { openai } from "@/lib/openai/client"

const MAX_AUDIO_BYTES = 8 * 1024 * 1024

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audio = formData.get("audio")

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

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "gpt-4o-mini-transcribe",
      language: "es",
      prompt:
        "Pedido para la taquería Los Carnales. Puede mencionar tacos, montados, quesicarnes, bebidas, cantidades y notas como sin cebolla o sin hielo.",
    })

    const text = transcription.text?.trim()

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
      { error: "No fue posible transcribir el audio." },
      { status: 500 }
    )
  }
}
