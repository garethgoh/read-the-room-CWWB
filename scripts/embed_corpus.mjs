import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ALL_TABS = ["Objections","Persona Signals","Proof Points","Positioning","CW Objections","CW Persona Signals","CW Proof Points","CW Positioning"];

function extractContent(row) {
  return Object.values(row).filter(Boolean).slice(0, 5).join(" | ");
}

function extractMeta(row) {
  const keys = Object.keys(row);
  return {
    persona: row[keys[0]] || "",
    trigger: row[keys[1]] || "",
    source: row[keys[keys.length - 2]] || "",
    date: String(row[keys[keys.length - 1]] || ""),
  };
}

async function embed(text) {
  const res = await openai.embeddings.create({ model: "text-embedding-3-small", input: text.slice(0, 8000) });
  return res.data[0].embedding;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const workbook = XLSX.read(readFileSync("./WB_Corpus.xlsx"));
  let total = 0, errors = 0;

  for (const sheetName of ALL_TABS) {
    const ws = workbook.Sheets[sheetName];
    if (!ws) { console.log("Skipping missing sheet: " + sheetName); continue; }
    const rows = XLSX.utils.sheet_to_json(ws);
    const brand = sheetName.startsWith("CW") ? "coreweave" : "wb";
    const tab = sheetName.replace("CW ", "").toLowerCase();
    console.log("\nProcessing " + sheetName + " (" + rows.length + " rows)...");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const content = extractContent(row);
      if (!content || content.length < 10) continue;
      try {
        const embedding = await embed(content);
        const meta = extractMeta(row);
        const { error } = await supabase.from("corpus").insert({
          brand, tab, persona: meta.persona, trigger: meta.trigger,
          content, source: meta.source, date: meta.date, embedding,
        });
        if (error) { console.error("Row " + i + " error:", error.message); errors++; }
        else { total++; if (total % 10 === 0) console.log("  " + total + " rows loaded..."); }
        await sleep(200);
      } catch (e) { console.error("Row " + i + " failed:", e.message); errors++; }
    }
  }
  console.log("\nDone. " + total + " rows loaded, " + errors + " errors.");
}

main();
