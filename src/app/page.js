"use client"
import Link from "next/link"

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column" }}>
      <nav style={{ borderBottom: "1px solid var(--border-light)", padding: "0 40px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/cw-logo.svg" style={{ height: 18 }} alt="CoreWeave" />
          <div style={{ width: 1, height: 16, background: "var(--border-light)" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Read the Room</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "monospace", letterSpacing: "0.04em" }}>GTM · INTERNAL</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B98166" }} />
        </div>
      </nav>
      <section style={{ padding: "80px 40px 56px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ height: 1, width: 28, background: "#00C2FF" }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: "#00C2FF", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>Sales & Marketing Intelligence</span>
        </div>
        <h1 style={{ fontSize: 54, fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 20px" }}>
          Know how your pitch<br />
          <span style={{ color: "#00C2FF", fontWeight: 400 }}>lands</span>
          <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--text-secondary)" }}> before it does.</em>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 520, margin: "0 0 32px" }}>
          Score any marketing message or sales pitch against real buyer personas. Roleplay the conversation before you are actually in the room.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Powered by</span>
          <img src="/cw-logo.svg" style={{ height: 16, opacity: 0.7 }} alt="CoreWeave" />
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>+</span>
          <img src="/wb-logo-white.png" style={{ height: 16, opacity: 0.7 }} alt="W&B" />
        </div>
      </section>
      <section style={{ padding: "0 40px 56px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Link href="/scorer" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#00C2FF"; e.currentTarget.style.boxShadow = "0 0 20px #00C2FF22"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#00C2FF18", border: "1px solid #00C2FF35", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#00C2FF" strokeWidth="1.5"/><path d="M9 6v3l2 2" stroke="#00C2FF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "monospace" }}>01</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>Pitch Scorer</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 28, flex: 1 }}>Paste any message, email, or pitch. Get a resonance score, gut reaction, what is missing, and a suggested rewrite from your buyer point of view.</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Score 0-100", "Gut reaction", "What's missing", "Rewrite"].map(l => (
                  <span key={l} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#00C2FF15", color: "#00C2FF", border: "1px solid #00C2FF30" }}>{l}</span>
                ))}
              </div>
            </div>
          </Link>
          <Link href="/simulator" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 0 20px #3B82F622"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#3B82F618", border: "1px solid #3B82F635", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5h14M2 9h9M2 13.5h11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "monospace" }}>02</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>Selling Simulator</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 28, flex: 1 }}>Roleplay a live sales conversation. Claude plays the buyer in character, with their real triggers and red flags. Deal stage and win probability update as you go.</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Live roleplay", "Deal stage", "Win probability", "Next best move"].map(l => (
                  <span key={l} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#3B82F615", color: "#3B82F6", border: "1px solid #3B82F630" }}>{l}</span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section style={{ padding: "0 40px 80px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 32 }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { n: "01", title: "Pick your mode", body: "W&B mode: choose from Carter, Malik, Diana, Paul, or Sonia. CoreWeave mode: choose from Cedric, Carter, Alice, or Paul. Each has real triggers, red flags, and proof points." },
              { n: "02", title: "Paste your pitch", body: "Drop in any message, email copy, or sales talk track. The rawer the better — that is when the feedback is most useful." },
              { n: "03", title: "Read the room", body: "Get a resonance score, honest reaction, what is missing, and a rewrite. Or go live in the simulator and practice the full conversation before you are in it." },
            ].map(s => (
              <div key={s.n}>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "#00C2FF", marginBottom: 12, opacity: 0.7 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{ borderTop: "1px solid var(--border-light)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "monospace" }}>Weights & Biases · GTM Internal</span>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "monospace" }}>Powered by CoreWeave + Claude</span>
      </div>
    </main>
  )
}
