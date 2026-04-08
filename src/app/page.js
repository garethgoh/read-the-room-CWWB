import Link from "next/link"

const PERSONA_PREVIEWS = [
  { id: "malik",  name: "Malik",  role: "ML Engineer",       color: "#10B981", opener: "Can I just try this myself?" },
  { id: "diana",  name: "Diana",  role: "Director of ML",    color: "#F59E0B", opener: "What does success look like 6 months in?" },
  { id: "carter", name: "Carter", role: "CTO",               color: "#3B82F6", opener: "Give me the 60-second version." },
  { id: "paul",   name: "Paul",   role: "ML Platform Eng.",  color: "#8B5CF6", opener: "Can it run in our VPC?" },
]

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border-light)", padding: "0 40px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* CoreWeave wordmark */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="#00C2FF" strokeWidth="1.2" fill="none"/>
            <path d="M9 5L13 7.5V12.5L9 15L5 12.5V7.5L9 5Z" fill="#00C2FF" opacity="0.3"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Read the Room</span>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: 4 }}>by W&amp;B</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>GTM · INTERNAL</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B98166" }} />
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 40px 56px", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ height: 1, width: 28, background: "var(--cw-accent)" }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: "var(--cw-accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Sales &amp; Marketing Intelligence</span>
        </div>
        <h1 style={{ fontSize: 54, fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 20px" }}>
          Know how your pitch<br />
          <span style={{ color: "var(--cw-accent)", fontWeight: 400 }}>lands</span>
          <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--text-secondary)" }}> before it does.</em>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 500, margin: 0 }}>
          Score any message or pitch against real W&amp;B buyer personas. Roleplay the deal before you're in the room.
        </p>
      </section>

      {/* Persona strip */}
      <section style={{ padding: "0 40px 56px", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {PERSONA_PREVIEWS.map(p => (
            <div key={p.id} style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: p.color }} />
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: p.color + "20", border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.name[0]}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginBottom: 1 }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 10 }}>{p.role}</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontStyle: "italic", lineHeight: 1.4, fontFamily: "'DM Mono', monospace", borderTop: "1px solid var(--border-light)", paddingTop: 10 }}>"{p.opener}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mode cards */}
      <section style={{ padding: "0 40px 56px", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          <Link href="/scorer" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cw-accent)"; e.currentTarget.style.boxShadow = "var(--cw-accent-glow)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--cw-accent-dim)", border: "1px solid var(--cw-accent-ring)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#00C2FF" strokeWidth="1.5"/><path d="M8 5v3l2 2" stroke="#00C2FF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace" }}>01</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>Pitch Scorer</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 24, flex: 1 }}>
                Paste any message, email, or pitch deck copy. Get a resonance score, gut reaction, what's missing, and a rewrite — from your buyer's point of view.
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Score 0–100", "Gut reaction", "What's missing", "Rewrite"].map(l => (
                  <span key={l} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "var(--cw-accent-dim)", color: "var(--cw-accent)", border: "1px solid var(--cw-accent-ring)" }}>{l}</span>
                ))}
              </div>
            </div>
          </Link>

          <Link href="/simulator" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 0 20px #3B82F622"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#3B82F618", border: "1px solid #3B82F635", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h7M2 12h9" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace" }}>02</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>Selling Simulator</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 24, flex: 1 }}>
                Roleplay a live sales conversation. Claude plays the buyer — in character, with their real triggers and red flags. Deal stage and win probability update as you go.
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Live roleplay", "Deal stage", "Win probability", "Next best move"].map(l => (
                  <span key={l} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#3B82F615", color: "#3B82F6", border: "1px solid #3B82F630" }}>{l}</span>
                ))}
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "0 40px 80px", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 32 }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { n: "01", title: "Pick a persona", body: "Choose who you're selling to — Malik the ML Engineer, Diana the Director, Carter the CTO, or Paul the Platform Engineer. Each has real triggers, red flags, and proof points." },
              { n: "02", title: "Paste your pitch", body: "Drop in any message, email copy, or sales talk track. The rawer the better — that's when the feedback is most useful and least polished-away." },
              { n: "03", title: "Read the room", body: "Get a resonance score, honest reaction, what's missing, and a rewrite. Or go live in the simulator and practice the full conversation before you're in it." },
            ].map(s => (
              <div key={s.n}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--cw-accent)", marginBottom: 12, opacity: 0.7 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border-light)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace" }}>Weights &amp; Biases · GTM Internal</span>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'DM Mono', monospace" }}>Powered by CoreWeave + Claude</span>
      </div>

    </main>
  )
}
