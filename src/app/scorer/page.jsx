"use client"

import { useState } from "react"
import Link from "next/link"
import { PERSONAS } from "@/lib/personas"
import PersonaCard from "@/components/PersonaCard"

export default function ScorerPage() {
  const [persona, setPersona] = useState(null)
  const [pitch, setPitch] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  async function score() {
    if (!persona || !pitch.trim()) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId: persona.id, pitch }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor =
    result?.score >= 70 ? "text-green-600" : result?.score >= 45 ? "text-amber-500" : "text-red-500"
  const barColor =
    result?.score >= 70 ? "bg-green-500" : result?.score >= 45 ? "bg-amber-400" : "bg-red-400"

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Home</Link>
          <span className="text-gray-200">|</span>
          <h1 className="font-medium text-gray-900 text-sm">Pitch Scorer</h1>
        </div>
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
                onClick={() => { setPersona(p); setResult(null) }}
              />
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {persona && (
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{persona.name} · {persona.role}</div>
                <div className="text-sm text-gray-500">{persona.company}</div>
              </div>
              {result && (
                <div className="text-right">
                  <div className={`text-3xl font-semibold ${scoreColor}`}>{result.score}</div>
                  <div className="text-xs text-gray-400">resonance</div>
                  <div className="w-20 h-1 bg-gray-100 rounded-full mt-1 ml-auto">
                    <div className={`h-1 rounded-full ${barColor}`} style={{ width: `${result.score}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            {!persona && (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Select a persona from the sidebar to begin
              </div>
            )}

            {persona && !result && (
              <div className="max-w-2xl">
                {/* Triggers grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Triggers</div>
                    {persona.triggers.map((t) => (
                      <div key={t} className="flex gap-2 text-xs text-gray-600 mb-1.5">
                        <span className="text-gray-300 mt-0.5">•</span>{t}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Red flags</div>
                    {persona.redFlags.map((t) => (
                      <div key={t} className="flex gap-2 text-xs text-gray-600 mb-1.5">
                        <span className="text-red-300 mt-0.5">•</span>{t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="max-w-2xl space-y-5">
                <div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Reaction</div>
                  <p className="text-sm text-gray-800 leading-relaxed">{result.reaction}</p>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">What's missing</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.missing}</p>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">One thing that would make me act</div>
                  <p className="text-sm text-blue-700 leading-relaxed">{result.oneThingToAct}</p>
                </div>
                {result.rewrite && (
                  <div className="border-t border-gray-100 pt-5">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Suggested rewrite</div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">{result.rewrite}</p>
                    <button
                      onClick={() => setPitch(result.rewrite)}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Use this version →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input area */}
          {persona && (
            <div className="border-t border-gray-200 bg-white p-4">
              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Paste your pitch, launch message, or sales copy here..."
                className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-gray-300"
                rows={4}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={score}
                  disabled={loading || !pitch.trim()}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Scoring..." : "Score it"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
