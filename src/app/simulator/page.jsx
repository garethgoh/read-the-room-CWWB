"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { PERSONAS, STAGES } from "@/lib/personas"

const AVATAR_COLORS = {
  malik:  "#1D9E75",
  diana:  "#BA7517",
  carter: "#2F81F7",
  paul:   "#8B5CF6",
}

function Avatar({ persona, size = 32 }) {
  const color = AVATAR_COLORS[persona.id] || "#888"
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 600, color }}>{persona.name[0]}</span>
    </div>
  )
}

export default function SimulatorPage() {
  const [persona, setPersona] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [winProb, setWinProb] = useState(25)
  const [nextMove, setNextMove] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  function startSim(p) {
    setPersona(p); setStage(0); setWinProb(25); setNextMove("")
    setMessages([{ role: "assistant", content: p.opener }])
  }

  async function send() {
    if (!input.trim() || !persona || loading) return
    const userMsg = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages); setInput(""); setLoading(true)
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ personaId: persona.id, messages: newMessages }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
      if (data.meta) {
        setStage(Math.min(5, Math.max(0, data.meta.stage ?? stage)))
        setWinProb(Math.min(100, Math.max(0, data.meta.winProb ?? winProb)))
        if (data.meta.nextMove) setNextMove(data.meta.nextMove)
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + e.message }])
    } finally { setLoading(false) }
  }

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }

  const accentColor = persona ? (AVATAR_COLORS[persona.id] || "#888") : "#2F81F7"
  const probColor = winProb >= 60 ? "var(--score-high)" : winProb >= 35 ? "var(--score-mid)" : "var(--score-low)"

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
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Selling Simulator</span>
        </div>
        {persona && (
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>STAGE</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{STAGES[stage]}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>WIN PROB</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: probColor }}>{winProb}%</div>
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {STAGES.map((s, i) => (
                <div key={s} title={s} style={{ width: 8, height: 8, borderRadius: "50%", background: i < stage ? "var(--score-high)" : i === stage ? accentColor : "var(--navy-4)", transition: "background 0.3s" }} />
              ))}
            </div>
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
                <div key={p.id} onClick={() => startSim(p)}
                  style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, border: `1px solid ${active ? color + "40" : "transparent"}`, background: active ? color + "10" : "transparent", transition: "all 0.12s" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--navy-2)"; e.currentTarget.style.borderColor = "var(--border)" } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent" } }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
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
          {persona && nextMove && (
            <div style={{ borderTop: "1px solid var(--border-light)", padding: "14px 16px" }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>Next best move</div>
              <div style={{ fontSize: 12, color: accentColor, lineHeight: 1.5 }}>{nextMove}</div>
            </div>
          )}
          {persona && (
            <div style={{ borderTop: "1px solid var(--border-light)", padding: "14px 16px" }}>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>Proof they trust</div>
              {persona.proof.slice(0, 3).map(t => (
                <div key={t} style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6, display: "flex", gap: 6, lineHeight: 1.4 }}>
                  <span style={{ color: accentColor, flexShrink: 0 }}>·</span>{t}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Chat */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!persona ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="var(--text-tertiary)" strokeWidth="1.5"/><path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Select a persona to start the simulation</span>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 10 }}>
                    {m.role === "assistant" && <Avatar persona={persona} size={28} />}
                    <div style={{ maxWidth: "65%", padding: "11px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? accentColor : "var(--navy-2)", color: m.role === "user" ? "#fff" : "var(--text-primary)", fontSize: 14, lineHeight: 1.6, border: m.role === "assistant" ? "1px solid var(--border-light)" : "none" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                    <Avatar persona={persona} size={28} />
                    <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "var(--navy-2)", border: "1px solid var(--border-light)", display: "flex", gap: 4 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-tertiary)", animation: "bounce 1.2s infinite", animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{ borderTop: "1px solid var(--border-light)", padding: "14px 20px", display: "flex", gap: 12, alignItems: "flex-end", background: "var(--navy)", flexShrink: 0 }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Your message... (Enter to send, Shift+Enter for new line)"
                  style={{ flex: 1, background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", resize: "none", outline: "none", lineHeight: 1.6, minHeight: 42, maxHeight: 100 }}
                  rows={1}
                  onFocus={e => e.target.style.borderColor = accentColor}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button onClick={send} disabled={loading || !input.trim()}
                  style={{ padding: "10px 20px", background: loading || !input.trim() ? "var(--navy-3)" : accentColor, color: loading || !input.trim() ? "var(--text-tertiary)" : "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                  Send
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}
