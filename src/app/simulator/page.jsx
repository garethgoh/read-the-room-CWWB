"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { PERSONAS, STAGES } from "@/lib/personas"
import { CW_PERSONAS } from "@/lib/coreweave"
const WB_COLORS = { malik: "#10B981", diana: "#F59E0B", carter: "#3B82F6", paul: "#8B5CF6", sonia: "#EC4899" }
const CW_COLORS = { paul_cw: "#0EA5E9", alice: "#8B5CF6", cedric: "#F59E0B", carter_cw: "#3B82F6" }
function getColor(persona) { return WB_COLORS[persona.id] || CW_COLORS[persona.id] || "#888" }
function Avatar({ persona, size = 30 }) {
  const color = getColor(persona)
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color + "18", border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: size * 0.36, fontWeight: 600, color }}>{persona.name[0]}</span></div>
}
export default function SimulatorPage() {
  const [mode, setMode] = useState("wb")
  const [persona, setPersona] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [winProb, setWinProb] = useState(25)
  const [nextMove, setNextMove] = useState("")
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])
  function switchMode(m) { setMode(m); setPersona(null); setMessages([]); setStage(0); setWinProb(25); setNextMove("") }
  function startSim(p) { setPersona(p); setStage(0); setWinProb(25); setNextMove(""); setMessages([]) }
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
    } catch (e) { setMessages(prev => [...prev, { role: "assistant", content: "Error: " + e.message }]) }
    finally { setLoading(false) }
  }
  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }
  const accent = persona ? getColor(persona) : "#111827"
  const probColor = winProb >= 60 ? "#10B981" : winProb >= 35 ? "#F59E0B" : "#EF4444"
  const personas = mode === "wb" ? PERSONAS : CW_PERSONAS
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#F8F9FA", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ height: 52, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Home</Link>
          <div style={{ width: 1, height: 16, background: "#E5E7EB" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Selling Simulator</span>
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 3, gap: 2, marginLeft: 8 }}>
            <button onClick={() => switchMode("wb")} style={{ padding: "4px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "none", cursor: "pointer", background: mode === "wb" ? "#fff" : "transparent", color: mode === "wb" ? "#111827" : "#6B7280", boxShadow: mode === "wb" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}><img src="/wb-logo.png" style={{ height: 13, display: "block" }} alt="W&B" /></button>
            <button onClick={() => switchMode("coreweave")} style={{ padding: "4px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "none", cursor: "pointer", background: mode === "coreweave" ? "#0D1117" : "transparent", color: mode === "coreweave" ? "#00C2FF" : "#6B7280", boxShadow: mode === "coreweave" ? "0 1px 3px rgba(0,0,0,0.2)" : "none" }}><img src="/coreweave-logo.png" style={{ height: 13, display: "block" }} alt="CoreWeave" /></button>
          </div>
        </div>
        {persona && (
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage</div><div style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{STAGES[stage]}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Win prob.</div><div style={{ fontSize: 12, fontWeight: 500, color: probColor }}>{winProb}%</div></div>
            <div style={{ display: "flex", gap: 5 }}>{STAGES.map((st, i) => <div key={st} title={st} style={{ width: 8, height: 8, borderRadius: "50%", background: i < stage ? "#10B981" : i === stage ? accent : "#E5E7EB" }} />)}</div>
          </div>
        )}
      </header>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <aside style={{ width: 240, borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0, background: "#fff" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #F3F4F6", fontSize: 10, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Personas</div>
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {personas.map(p => {
              const color = getColor(p)
              const active = persona?.id === p.id
              return <div key={p.id} onClick={() => startSim(p)} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, border: `1px solid ${active ? color + "40" : "transparent"}`, background: active ? color + "08" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><Avatar persona={p} size={30} /><div><div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{p.name}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{p.role}</div></div></div>
                <div style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic", paddingLeft: 40, lineHeight: 1.4 }}>"{p.opener}"</div>
              </div>
            })}
          </div>
          {persona && nextMove && <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 16px" }}><div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Next best move</div><div style={{ fontSize: 12, color: accent, lineHeight: 1.5 }}>{nextMove}</div></div>}
          {persona && <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 16px" }}><div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Proof they trust</div>{persona.proof.slice(0, 3).map(t => <div key={t} style={{ fontSize: 11, color: "#6B7280", marginBottom: 6, display: "flex", gap: 6, lineHeight: 1.4 }}><span style={{ color: accent, flexShrink: 0 }}>·</span>{t}</div>)}</div>}
        </aside>
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!persona ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 13, color: "#9CA3AF" }}>Select a persona to start the simulation</span></div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
                {messages.length === 0 && (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", maxWidth: 300 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: accent + "18", border: `1.5px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><span style={{ fontSize: 18, fontWeight: 600, color: accent }}>{persona.name[0]}</span></div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 6 }}>You're talking to {persona.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 4 }}>{persona.role}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>Send the first message to start.</div>
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                    {m.role === "assistant" && <Avatar persona={persona} size={28} />}
                    <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? accent : "#fff", color: m.role === "user" ? "#fff" : "#111827", fontSize: 13, lineHeight: 1.6, border: m.role === "assistant" ? "1px solid #E5E7EB" : "none" }}>{m.content}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <Avatar persona={persona} size={28} />
                    <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#fff", border: "1px solid #E5E7EB", display: "flex", gap: 4, alignItems: "center" }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1D5DB", animation: "bounce 1.2s infinite", animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{ borderTop: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end", background: "#fff", flexShrink: 0 }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Your message... (Enter to send)" style={{ flex: 1, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "9px 13px", fontSize: 13, color: "#111827", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.6, minHeight: 40, maxHeight: 100 }} rows={1} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                <button onClick={send} disabled={loading || !input.trim()} style={{ padding: "9px 18px", background: loading || !input.trim() ? "#E5E7EB" : accent, color: loading || !input.trim() ? "#9CA3AF" : "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>Send</button>
              </div>
            </>
          )}
        </main>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}
