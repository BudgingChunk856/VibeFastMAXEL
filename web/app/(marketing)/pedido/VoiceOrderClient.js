"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, RotateCcw } from "lucide-react"

function getSpeechRecognition() {
  if (typeof window === "undefined") return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export default function VoiceOrderClient() {
  const recognitionRef = useRef(null)
  const [supported, setSupported] = useState(true)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [status, setStatus] = useState("Listo para escuchar tu pedido.")
  const [error, setError] = useState("")

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition()

    if (!SpeechRecognition || !navigator.mediaDevices?.getUserMedia) {
      setSupported(false)
      setStatus("Este navegador no ofrece reconocimiento de voz compatible.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "es-MX"
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setListening(true)
      setError("")
      setStatus("Escuchando… di tu pedido con naturalidad.")
    }

    recognition.onresult = (event) => {
      let text = ""
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript
      }
      setTranscript(text.trim())
    }

    recognition.onerror = (event) => {
      setListening(false)
      const messages = {
        "not-allowed": "No se concedió permiso para usar el micrófono.",
        "audio-capture": "No se detectó un micrófono disponible.",
        "no-speech": "No se detectó voz. Intenta nuevamente.",
        network: "El reconocimiento de voz tuvo un problema de red.",
      }
      const message = messages[event.error] || "No fue posible reconocer la voz."
      setError(message)
      setStatus("La prueba se detuvo.")
    }

    recognition.onend = () => {
      setListening(false)
      setStatus((current) =>
        current.startsWith("La prueba") ? current : "Captura terminada. Revisa el texto reconocido."
      )
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
      recognitionRef.current = null
    }
  }, [])

  async function startListening() {
    setError("")

    if (!supported || !recognitionRef.current) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setTranscript("")
      recognitionRef.current.start()
    } catch (permissionError) {
      console.error(permissionError)
      setError("No se pudo acceder al micrófono. Revisa los permisos del navegador.")
      setStatus("Permiso de micrófono requerido.")
    }
  }

  function stopListening() {
    recognitionRef.current?.stop()
  }

  function resetTranscript() {
    setTranscript("")
    setError("")
    setStatus("Listo para escuchar tu pedido.")
  }

  return (
    <div className="rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Prueba de micrófono</p>
          <p className="mt-1 text-sm text-base-content/60">{status}</p>
        </div>

        <button
          type="button"
          className={`btn ${listening ? "btn-error" : "btn-primary"}`}
          onClick={listening ? stopListening : startListening}
          disabled={!supported}
        >
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
          {listening ? "Detener" : "Hablar"}
        </button>
      </div>

      {!supported && (
        <div className="alert alert-warning mt-5" role="status">
          <span>
            Prueba esta función en una versión reciente de Chrome o Edge. El pedido escrito
            seguirá siendo una alternativa cuando añadamos el flujo completo.
          </span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mt-5" role="alert">
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-base-200 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-base-content/70">Texto reconocido</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={resetTranscript}
            disabled={!transcript && !error}
          >
            <RotateCcw size={15} />
            Limpiar
          </button>
        </div>

        <p className="mt-4 min-h-20 text-lg leading-relaxed" aria-live="polite">
          {transcript || "Aquí aparecerá lo que diga el cliente."}
        </p>
      </div>

      <div className="mt-5 text-sm text-base-content/60">
        Ejemplo: “Quiero dos órdenes de tacos, una quesicarne y dos aguas de Jamaica.”
      </div>
    </div>
  )
}
