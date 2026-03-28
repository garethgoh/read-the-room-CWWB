"use client"

const AVATAR_COLORS = {
  malik:  { bg: "#1D9E75", text: "#fff" },
  diana:  { bg: "#BA7517", text: "#fff" },
  carter: { bg: "#185FA5", text: "#fff" },
  paul:   { bg: "#534AB7", text: "#fff" },
}

function Avatar({ persona }) {
  const colors = AVATAR_COLORS[persona.id] || { bg: "#888", text: "#fff" }
  const initials = persona.name.split(" ").map(w => w[0]).join("").slice(0, 2)
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: colors.bg, color: colors.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: 15, flexShrink: 0, letterSpacing: "0.01em"
    }}>
      {initials}
    </div>
  )
}

export default function PersonaCard({ persona, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer border transition-all ${
        active
          ? "bg-white border-gray-300 shadow-sm"
          : "border-transparent hover:bg-white hover:border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Avatar persona={persona} />
        <div>
          <div className="font-medium text-sm text-gray-900">{persona.name}</div>
          <div className="text-xs text-gray-500">{persona.role}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {persona.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
