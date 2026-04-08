"use client"
import { useState } from "react"
import Link from "next/link"
import { PERSONAS } from "@/lib/personas"
import { CW_PERSONAS, CW_RUBRIC } from "@/lib/coreweave"
const WB_COLORS = { malik: "#10B981", diana: "#F59E0B", carter: "#3B82F6", paul: "#8B5CF6", sonia: "#EC4899" }
const CW_COLORS = { paul_cw: "#0EA5E9", alice: "#8B5CF6", cedric: "#F59E0B", carter_cw: "#3B82F6" }
const CW_BLUE = "#00C2FF"
function Avatar({ persona, isCW = false, size = 32 }) {
  const color = (isCW ? CW_COLORS : WB_COLORS)[persona.id] || "#888"
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color + "18", border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: size * 0.36, fontWeight: 600, color }}>{persona.name[0]}</span></div>
}
function ScoreRing({ score }) {
  const color = score >= 70 ? "#10B981" : score >= 45 ? "#F59E0B" : "#EF4444"
  const r = 28, c = 2 * Math.PI * r, dash = (score / 100) * c
  return <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}><svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}><circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="4" /><circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" /></svg><div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 20, fontWeight: 600, color, lineHeight: 1 }}>{score}</span><span style={{ fontSize: 9, color: "#9CA3AF" }}>/ 100</span></div></div>
}
export default function ScorerPage() {
  const [mode, setMode] = useState("wb")
  const [persona, setPersona] = useState(null)
  const [pitch, setPitch] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [versions, setVersions] = useState([])
  function switchMode(m) { setMode(m); setPersona(null); setResult(null); setError(""); setVersions([]) }
  async function score() {
    if (!pitch.trim() || !persona) return
    setLoading(true); setError(""); setResult(null)
    try {
      const res = await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, personaId: persona.id, pitch }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data); setVersions(v => [...v, data.score])
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  const isCW = mode === "coreweave"
  const colors = isCW ? CW_COLORS : WB_COLORS
  const accent = persona ? (colors[persona.id] || "#111827") : (isCW ? CW_BLUE : "#111827")
  const personas = isCW ? CW_PERSONAS : PERSONAS
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#F8F9FA", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ height: 52, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Home</Link>
          <div style={{ width: 1, height: 16, background: "#E5E7EB" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Pitch Scorer</span>
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 3, gap: 2, marginLeft: 8 }}>
            <button onClick={() => switchMode("wb")} style={{ padding: "4px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "none", cursor: "pointer", background: !isCW ? "#F59E0B" : "transparent", color: !isCW ? "#fff" : "#6B7280", boxShadow: !isCW ? "0 1px 3px rgba(245,158,11,0.4)" : "none", border: !isCW ? "1px solid #F59E0B" : "none" }}>W&B</button>
            <button onClick={() => switchMode("coreweave")} style={{ padding: "4px 14px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "none", cursor: "pointer", background: isCW ? "#0D1117" : "transparent", color: isCW ? CW_BLUE : "#6B7280", boxShadow: isCW ? "0 1px 3px rgba(0,0,0,0.2)" : "none" }}>CoreWeave</button>
          </div>
        </div>
        {result && <ScoreRing score={result.score} />}
      </header>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <aside style={{ width: 240, borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0, background: "#fff" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #F3F4F6", fontSize: 10, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Personas</div>
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {personas.map(p => {
              const color = colors[p.id] || "#888"
              const active = persona?.id === p.id
              return <div key={p.id} onClick={() => { setPersona(p); setResult(null) }} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, border: `1px solid ${active ? color + "40" : "transparent"}`, background: active ? color + "08" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><Avatar persona={p} isCW={isCW} size={32} /><div><div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{p.name}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{p.role}</div></div></div>
                <div style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic", paddingLeft: 42, lineHeight: 1.4 }}>"{p.opener}"</div>
              </div>
            })}
          </div>
          {isCW && <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Customer proof</div>
            {CW_RUBRIC.customerProof.slice(0, 4).map(c => <div key={c.customer} style={{ marginBottom: 6 }}><div style={{ fontSize: 11, fontWeight: 500, color: CW_BLUE }}>{c.customer}</div><div style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.4 }}>{c.proof}</div></div>)}
          </div>}
          {versions.length > 0 && <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Version history</div>
            {versions.map((v, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, color: "#9CA3AF" }}>v{i+1}</span><span style={{ fontSize: 12, fontWeight: 500, color: v >= 70 ? "#10B981" : v >= 45 ? "#F59E0B" : "#EF4444" }}>{v}</span></div>)}
          </div>}
        </aside>
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {persona && <div style={{ padding: "14px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 14, background: "#fff", flexShrink: 0 }}>
            <Avatar persona={persona} isCW={isCW} size={38} />
            <div><div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{persona.name} · {persona.role}</div><div style={{ fontSize: 12, color: "#6B7280" }}>{persona.company}</div></div>
          </div>}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {!persona && <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 13, color: "#9CA3AF" }}>Select a persona to begin</span></div>}
            {persona && !result && <div style={{ maxWidth: 640, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Triggers</div>
                {persona.triggers.map(t => <div key={t} style={{ display: "flex", gap: 8, fontSize: 12, color: "#4B5563", marginBottom: 8, lineHeight: 1.5 }}><span style={{ color: accent, flexShrink: 0 }}>+</span>{t}</div>)}
              </div>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: "#EF4444", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Red flags</div>
                {persona.redFlags.map(t => <div key={t} style={{ display: "flex", gap: 8, fontSize: 12, color: "#4B5563", marginBottom: 8, lineHeight: 1.5 }}><span style={{ color: "#EF4444", flexShrink: 0 }}>−</span>{t}</div>)}
              </div>
            </div>}
            {result && <div style={{ maxWidth: 640 }}>
              {[{ label: "Reaction", content: result.reaction, color: "#111827" }, { label: "What's missing", content: result.missing, color: "#4B5563" }, { label: "One thing that would make it land harder", content: result.oneThingToAct, color: accent }].map((item, i) => (
                <div key={item.label} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none", paddingTop: i > 0 ? 20 : 0, marginTop: i > 0 ? 20 : 0, marginBottom: i === 0 ? 20 : 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{item.label}</div>
                  <p style={{ fontSize: 14, color: item.color, lineHeight: 1.7, margin: 0 }}>{item.content}</p>
                </div>
              ))}
              {result.rewrite && <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20, marginTop: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Suggested rewrite</div>
                <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: 16 }}>
                  <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7, margin: "0 0 10px", fontStyle: "italic" }}>{result.rewrite}</p>
                  <button onClick={() => setPitch(result.rewrite)} style={{ fontSize: 12, color: accent, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>Use this version →</button>
                </div>
              </div>}
            </div>}
          </div>
          {persona && <div style={{ borderTop: "1px solid #E5E7EB", padding: "16px 24px", background: "#fff", flexShrink: 0 }}>
            {error && <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 8 }}>{error}</div>}
            <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder={`Paste your pitch, email, or message for ${persona.name}...`} style={{ width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#111827", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.6 }} rows={4} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>{pitch.length} chars</span>
              <button onClick={score} disabled={loading || !pitch.trim()} style={{ padding: "8px 20px", background: loading || !pitch.trim() ? "#E5E7EB" : isCW ? "#0D1117" : accent, color: loading || !pitch.trim() ? "#9CA3AF" : isCW ? CW_BLUE : "#fff", border: loading || !pitch.trim() ? "none" : isCW ? `1px solid ${CW_BLUE}40` : "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: loading || !pitch.trim() ? "not-allowed" : "pointer" }}>{loading ? "Scoring..." : "Score it"}</button>
            </div>
          </div>}
        </main>
      </div>
    </div>
  )
}
