"use client"

import { useRef, useState } from "react"
import { LoaderCircle, Mic, MicOff, RotateCcw } from "lucide-react"

export default function VoiceOrderClient() {
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])

  const [supported] = useState(() =>
    typeof window === "undefined"
      ? true
      : Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder)
  )
  const [listening, setListening] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [status, setStatus] = useState("Listo para escuchar tu pedido.")
  const [error, setError] = useState("")

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  async function transcribeAudio(blob) {
    setProcessing(true)
    setStatus("Transcribiendo tu pedido…")

    try {
      const formData = new FormData()
      const extension = blob.type.includes("ogg") ? "ogg" : "webm"
      formData.append("audio", blob, `pedido.${extension}`)

      const response = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "No fue posible transcribir el audio.")
      }

      setTranscript(data.text)
      setStatus("Captura terminada. Revisa el texto reconocido.")
    } catch (transcriptionError) {
      console.error(transcriptionError)
      setError(transcriptionError.message || "No fue posible transcribir el audio.")
      setStatus("La prueba se detuvo.")
    } finally {
      setProcessing(false)
    }
  }

  async function startListening() {
    setError("")
    setTranscript("")

    if (!supported) {
      setError("Este navegador no permite grabar audio desde esta página.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const preferredType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : ""

      const recorder = preferredType
        ? new MediaRecorder(stream, { mimeType: preferredType })
        : new MediaRecorder(stream)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onerror = () => {
        setListening(false)
        stopStream()
        setError("Ocurrió un problema mientras se grababa el audio.")
        setStatus("La prueba se detuvo.")
      }

      recorder.onstop = async () => {
        setListening(false)
        const mimeType = recorder.mimeType || "audio/webm"
        const blob = new Blob(chunksRef.current, { type: mimeType })
        stopStream()

        if (blob.size === 0) {
          setError("No se capturó audio. Intenta nuevamente.")
          setStatus("La prueba se detuvo.")
          return
        }

        await transcribeAudio(blob)
      }

      recorderRef.current = recorder
      recorder.start()
      setListening(true)
      setStatus("Escuchando… di tu pedido y luego presiona Detener.")
    } catch (permissionError) {
      console.error(permissionError)
      stopStream()
      setError("No se pudo acceder al micrófono. Revisa los permisos del navegador.")
      setStatus("Permiso de micrófono requerido.")
    }
  }

  function stopListening() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop()
    }
  }

  function resetTranscript() {
    if (listening || processing) return
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
          disabled={!supported || processing}
        >
          {processing ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : listening ? (
            <MicOff size={18} />
          ) : (
            <Mic size={18} />
          )}
          {processing ? "Procesando" : listening ? "Detener" : "Hablar"}
        </button>
      </div>

      {!supported && (
        <div className="alert alert-warning mt-5" role="status">
          <span>
            Este navegador no ofrece grabación de audio compatible. El pedido escrito seguirá
            disponible como alternativa cuando añadamos el flujo completo.
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
            disabled={listening || processing || (!transcript && !error)}
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
