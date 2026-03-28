import { PERSONAS } from "@/lib/personas"

export async function POST(req) {
  try {
    const { personaId, pitch } = await req.json()
    const persona = PERSONAS.find((p) => p.id === personaId)
    if (!persona) return Response.json({ error: "Persona not found" }, { status: 400 })

    const prompt = `You are ${persona.name}, ${persona.role} at ${persona.company}.

Your triggers (what makes you act): ${persona.triggers.join("; ")}
Your red flags (what turns you off): ${persona.redFlags.join("; ")}
What earns your trust: ${persona.proof.join("; ")}

Score this pitch from your perspective. Return ONLY valid JSON with these exact fields:
{
  "score": <0-100>,
  "reaction": "<2 sentences, your gut reaction as ${persona.name.split(" ")[0]}>",
  "missing": "<1-2 sentences on what's missing that would move you>",
  "oneThingToAct": "<1 sentence: the single thing that would make you immediately act>",
  "rewrite": "<a rewritten version of the pitch tailored to you, same length or shorter>"
}

Pitch to evaluate:
${pitch}`

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await res.json()
    if (data.error) return Response.json({ error: data.error.message }, { status: 500 })

    const raw = data.content[0].text.replace(/```json|```/g, "").trim()
    const result = JSON.parse(raw)
    return Response.json(result)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
