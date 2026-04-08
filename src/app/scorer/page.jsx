"use client"

import { useState } from "react"
import Link from "next/link"
import { PERSONAS } from "@/lib/personas"

const AVATAR_COLORS = {
  malik:  "#1D9E75",
  diana:  "#BA7517",
  carter: "#2F81F7",
  paul:   "#8B5CF6",
}

function Avatar({ persona, size = 36 }) {
  const color = AVATAR_COLORS[persona.id] || "#888"
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 600, color }}>{persona.name[0]}</span>
    </div>
  )
}

function ScoreRing({ score }) {
  const color = score >= 70 ? "var(--score-high)" : score >= 45 ? "var(--score-mid)" : "var(--score-low)"
  const r = 28, c = 2 * Math.PI * r
  const dash = (score / 100) * c
  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
      <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--navy-3)" strokeWidth="4" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 600, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "var(--text-tertiary)", letterSpacing: "0.05em", fontFamily: "'DM Mono', monospace" }}>/ 100</span>
      </div>
    </div>
  )
}

export default function ScorerPage() {
  const [persona, setPersona] = useState(null)
  const [pitch, setPitch] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [versions, setVersions] = useState([])

  async function score() {
    if (!persona || !pitch.trim()) return
    setLoading(true); setError(""); setResult(null)
    try {
      const res = await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ personaId: persona.id, pitch }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setVersions(v => [...v, { score: data.score, pitch: pitch.slice(0, 60) + "..." }])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const accentColor = persona ? (AVATAR_COLORS[persona.id] || "#888") : "#1D9E75"

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--navy)" }}>

      {/* Header */}
      <header style={{ height: 52, borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "var(--text-tertiary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Home
          </Link>
          <div style={{ width: 1, height: 16, background: "var(--border)" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Pitch Scorer</span>
        </div>
        {result && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace" }}>resonance</span>
            <span style={{ fontSize: 20, fontWeight: 600, color: result.score >= 70 ? "var(--score-high)" : result.score >= 45 ? "var(--score-mid)" : "var(--score-low)" }}>{result.score}</span>
          </div>
        )}
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        <aside style={{ width: 240, borderRight: "1px solid var(--border-light)", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Personas</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PERSONAS.map(p => {
              const color = AVATAR_COLORS[p.id] || "#888"
              const active = persona?.id === p.id
              return (
                <div key={p.id} onClick={() => { setPersona(p); setResult(null) }}
                  style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, border: `1px solid ${active ? color + "40" : "transparent"}`, background: active ? color + "10" : "transparent", transition: "all 0.12s" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--navy-2)"; e.currentTarget.style.borderColor = "var(--border)" } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent" } }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Avatar persona={p} size={32} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontStyle: "italic", fontFamily: "'DM Mono', monospace", paddingLeft: 42, lineHeight: 1.4 }}>
                    "{p.opener}"
                  </div>
                </div>
              )
            })}
          </div>
          {versions.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-light)", padding: "12px 16px" }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Version history</div>
              {versions.slice(-4).map((v, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>v{i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: v.score >= 70 ? "var(--score-high)" : v.score >= 45 ? "var(--score-mid)" : "var(--score-low)" }}>{v.score}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Persona header */}
          {persona && (
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar persona={persona} size={40} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>{persona.name} · {persona.role}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{persona.company}</div>
                </div>
              </div>
              {result && <ScoreRing score={result.score} />}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {!persona && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="var(--text-tertiary)" strokeWidth="1.5"/><path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Select a persona to begin</span>
              </div>
            )}

            {persona && !result && (
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
                  <div style={{ background: "var(--navy-2)", border: "1px solid var(--border-light)", borderRadius: 12, padding: "16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: accentColor, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>Triggers</div>
                    {persona.triggers.map(t => (
                      <div key={t} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>
                        <span style={{ color: accentColor, marginTop: 1, flexShrink: 0 }}>+</span>{t}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "var(--navy-2)", border: "1px solid var(--border-light)", borderRadius: 12, padding: "16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "var(--score-low)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>Red flags</div>
                    {persona.redFlags.map(t => (
                      <div key={t} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>
                        <span style={{ color: "var(--score-low)", marginTop: 1, flexShrink: 0 }}>−</span>{t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Reaction", content: result.reaction, color: "var(--text-primary)" },
                  { label: "What's missing", content: result.missing, color: "var(--text-secondary)" },
                  { label: "One thing that would make me act", content: result.oneThingToAct, color: accentColor },
                ].map(s => (
                  <div key={s.label} style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{s.label}</div>
                    <p style={{ fontSize: 14, color: s.color, lineHeight: 1.7, margin: 0 }}>{s.content}</p>
                  </div>
                ))}
                {result.rewrite && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>Suggested rewrite</div>
                    <div style={{ background: "var(--navy-2)", border: "1px solid var(--border-light)", borderRadius: 10, padding: "16px" }}>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 12px", fontStyle: "italic" }}>{result.rewrite}</p>
                      <button onClick={() => setPitch(result.rewrite)} style={{ fontSize: 12, color: accentColor, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                        Use this version →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          {persona && (
            <div style={{ borderTop: "1px solid var(--border-light)", padding: "16px 24px", background: "var(--navy)", flexShrink: 0 }}>
              {error && <div style={{ fontSize: 12, color: "var(--score-low)", marginBottom: 8 }}>{error}</div>}
              <textarea
                value={pitch}
                onChange={e => setPitch(e.target.value)}
                placeholder={`Paste your pitch, email, or message for ${persona.name}...`}
                style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", resize: "none", outline: "none", lineHeight: 1.6 }}
                rows={4}
                onFocus={e => e.target.style.borderColor = accentColor}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace" }}>{pitch.length} chars</span>
                <button onClick={score} disabled={loading || !pitch.trim()}
                  style={{ padding: "8px 20px", background: loading || !pitch.trim() ? "var(--navy-3)" : accentColor, color: loading || !pitch.trim() ? "var(--text-tertiary)" : "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: loading || !pitch.trim() ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
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
