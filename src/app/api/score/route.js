import { PERSONAS } from "@/lib/personas"
import { CW_PERSONAS } from "@/lib/coreweave"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function getRelevantContext(pitch, brand, personaId) {
  try {
    const res = await openai.embeddings.create({ model: "text-embedding-3-small", input: pitch.slice(0, 8000) })
    const embedding = res.data[0].embedding
    const { data } = await supabase.rpc("match_corpus", { query_embedding: embedding, match_brand: brand, match_count: 5 })
    if (!data?.length) return ""
    return "\n\nRelevant examples from real deals:\n" + data.map(d => `- ${d.content}`).join("\n")
  } catch (e) {
    console.error("RAG error:", e.message)
    return ""
  }
}

export async function POST(req) {
  try {
    const { mode, personaId, pitch } = await req.json()
    const brand = mode === "coreweave" ? "coreweave" : "wb"
    const persona = mode === "coreweave"
      ? CW_PERSONAS.find(p => p.id === personaId)
      : PERSONAS.find(p => p.id === personaId)
    if (!persona) return Response.json({ error: "Persona not found" }, { status: 400 })

    const ragContext = await getRelevantContext(pitch, brand, personaId)

    const cwContext = mode === "coreweave" ? `
CoreWeave context: Three pillars — Pace (first to GB200/GB300, bare-metal in minutes, 40+ data centers), Performance (96% goodput, 20% more FLOPs/GPU, MLPerf 2496-GPU record, SemiAnalysis Platinum), Partnership (24/7 direct-to-expert, Mission Control, ARENA, proactive node replacement).
Key customers: Mistral (2.5x faster training), Cursor (3688 GPUs on B300), Goksu (0 to 2500 GPUs no formal POC), Cohere (7 GB/s/GPU via LOTA).
Products: SUNK, LOTA, ARENA, Dedicated Inference, Flex Reservations, Spot, Mission Control.` : ""

    const prompt = `You are ${persona.name}, ${persona.role} at ${persona.company}.

Your triggers (what makes you act): ${persona.triggers.join("; ")}
Your red flags (what turns you off): ${persona.redFlags.join("; ")}
What earns your trust: ${persona.proof.join("; ")}
${cwContext}${ragContext}

Score this pitch from your perspective. Return ONLY valid JSON:
{
  "score": <0-100>,
  "reaction": "<2 sentences, your gut reaction as ${persona.name.split(" ")[0]}>",
  "missing": "<1-2 sentences on what is missing that would move you>",
  "oneThingToAct": "<1 sentence: the single thing that would make you immediately act>",
  "rewrite": "<rewritten version of the pitch tailored to you, same length or shorter>"
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
    return Response.json(JSON.parse(raw))
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
