"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { PERSONAS, STAGES } from "@/lib/personas"
import PersonaCard from "@/components/PersonaCard"

export default function SimulatorPage() {
  const [persona, setPersona] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [winProb, setWinProb] = useState(25)
  const [nextMove, setNextMove] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  function startSim(p) {
    setPersona(p)
    setStage(0)
    setWinProb(25)
    setNextMove("")
    setMessages([{ role: "assistant", content: p.opener }])
  }

  async function send() {
    if (!input.trim() || !persona || loading) return
    const userMsg = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: persona.id,
          messages: newMessages,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      if (data.meta) {
        setStage(Math.min(5, Math.max(0, data.meta.stage ?? stage)))
        setWinProb(Math.min(100, Math.max(0, data.meta.winProb ?? winProb)))
        if (data.meta.nextMove) setNextMove(data.meta.nextMove)
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + e.message }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  const probColor = winProb >= 60 ? "text-green-600" : winProb >= 35 ? "text-amber-500" : "text-red-500"

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Home</Link>
          <span className="text-gray-200">|</span>
          <h1 className="font-medium text-gray-900 text-sm">Selling Simulator</h1>
        </div>
        {persona && (
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wider mr-2">Stage</span>
              <span className="font-medium text-gray-900">{STAGES[stage]}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wider mr-2">Win prob.</span>
              <span className={`font-medium ${probColor}`}>{winProb}%</span>
            </div>
            {/* Stage dots */}
            <div className="flex items-center gap-1.5">
              {STAGES.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    i < stage ? "bg-green-400" : i === stage ? "bg-blue-500" : "bg-gray-200"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Personas</div>
          </div>
          <div className="p-2 flex-1">
            {PERSONAS.map((p) => (
              <PersonaCard
                key={p.id}
                persona={p}
                active={persona?.id === p.id}
                onClick={() => startSim(p)}
              />
            ))}
          </div>
          {persona && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Proof they trust</div>
              {persona.proof.map((t) => (
                <div key={t} className="text-xs text-gray-500 mb-1.5 flex gap-1.5">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>{t}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Chat */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!persona ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a persona to start the simulation
            </div>
          ) : (
            <>
              {nextMove && (
                <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 flex items-start gap-2">
                  <span className="text-xs font-medium text-blue-500 uppercase tracking-wider whitespace-nowrap mt-0.5">Next move</span>
                  <span className="text-xs text-blue-700">{nextMove}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="text-xs font-medium text-gray-400 mr-2 mt-2 whitespace-nowrap">
                        {persona.name.split(" ")[0]}
                      </div>
                    )}
                    <div className={`max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="text-xs font-medium text-gray-400 mr-2 mt-2">{persona.name.split(" ")[0]}</div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-gray-200 bg-white p-4 flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Your message... (Enter to send)"
                  className="flex-1 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-gray-300 min-h-[42px] max-h-24"
                  rows={1}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
