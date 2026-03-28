import { PERSONAS } from "@/lib/personas"

export async function POST(req) {
  try {
    const { personaId, messages } = await req.json()
    const persona = PERSONAS.find((p) => p.id === personaId)
    if (!persona) return Response.json({ error: "Persona not found" }, { status: 400 })

    const system = `${persona.simContext}

Triggers that make you act: ${persona.triggers.join("; ")}
Red flags: ${persona.redFlags.join("; ")}
What earns your trust: ${persona.proof.join("; ")}

After your response, on a new line output JSON only:
{"stage":0,"winProb":25,"nextMove":"one sentence coaching tip for the seller"}
Where stage: 0=Discovery, 1=POV, 2=Security, 3=Procurement, 4=Rollout, 5=Closed won.
Adjust stage and winProb honestly based on how the conversation is going.`

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        system,
        messages,
      }),
    })

    const data = await res.json()
    if (data.error) return Response.json({ error: data.error.message }, { status: 500 })

    const raw = data.content[0].text
    const jsonMatch = raw.match(/\{[^}]+\}/)
    let meta = null
    let reply = raw

    if (jsonMatch) {
      try {
        meta = JSON.parse(jsonMatch[0])
        reply = raw.replace(jsonMatch[0], "").trim()
      } catch (_) {}
    }

    return Response.json({ reply, meta })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
