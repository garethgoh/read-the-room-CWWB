export const CW_RUBRIC = {
  name: "CoreWeave",
  description: "Score any pitch, email, or sales message against CoreWeave's GTM framework.",
  dimensions: [
    {
      id: "problem_first",
      label: "Problem-first framing",
      description: "Does it lead with the prospect's pain before talking product? Best openers: 'What is costing your infra teams the most time today?' Not: 'CoreWeave is the leading AI cloud.'"
    },
    {
      id: "proof_over_claims",
      label: "Proof over claims",
      description: "Does it use specific proof points — customer names, benchmark numbers, MLPerf records, SemiAnalysis Platinum rating — or just marketing assertions? Claims without proof land flat with technical buyers."
    },
    {
      id: "right_pillar",
      label: "Right pillar for the prospect",
      description: "Does it speak to the pillar that matches the prospect's situation? Pace (speed to start, container spin-up, GB300 first), Performance (96% goodput, 20% more FLOPs, 2,496-GPU MLPerf), or Partnership (24/7 direct-to-expert, Mission Control, ARENA, proactive node replacement)."
    },
    {
      id: "competitive_handling",
      label: "Competitive handling",
      description: "If competitors come up, does it redirect quickly to CW's story rather than dwelling on takedowns? Rule: don't volunteer competitive info, redirect as fast as possible."
    },
    {
      id: "next_step",
      label: "Clear next step",
      description: "Does it end with a specific, low-friction next step — ARENA trial, SUNK demo, Dedicated Inference preview, architecture review? Vague closes lose deals."
    }
  ],
  customerProof: [
    { customer: "Mistral AI", proof: "2.5x faster training on GB200 vs H200. 100% of models trained on CoreWeave. Months saved in development time." },
    { customer: "Cursor", proof: "461 instances / 3,688 GPUs in production on B300. Production clusters live within weeks of hardware availability." },
    { customer: "Göksu", proof: "Scaled from single node to 2,500 GPUs with no formal POC. Proactive node replacement before ticket was filed. Largest spot customer." },
    { customer: "Cohere", proof: "7 GB/s per GPU data throughput via LOTA. Running across GCP and CoreWeave." },
    { customer: "IBM", proof: "80% faster model training." },
    { customer: "Databricks", proof: "20% more FLOPs per GPU per hour." },
    { customer: "Chai AI", proof: "8-10x faster container spin-up." },
    { customer: "Jane Street", proof: "24/7 direct-to-expert support." },
  ],
  thirdPartyProof: [
    "SemiAnalysis ClusterMAX: Only Platinum-rated AI cloud provider (Nebius, Oracle, Azure = Gold)",
    "MLPerf Training v5.0: 2,496-GPU record — 34x larger than next CSP submission",
    "NVIDIA Exemplar Cloud: First to deploy GB200 and GB300, exceeded NVIDIA's own MFU targets",
    "47% better TCO vs general-purpose clouds over a typical 3-year project"
  ],
  scoringPrompt: `You are a CoreWeave GTM expert evaluating a sales pitch, email, or message against CoreWeave's selling framework.

CoreWeave's three pillars:
- PACE: First to deploy GB200 and GB300, 8-10x faster container spin-up (Chai AI), bare-metal provisioning in minutes, 40+ data centers
- PERFORMANCE: 96% goodput, 20% more FLOPs/GPU/hr, 2,496-GPU MLPerf record (34x larger than next CSP), 43.7% lower failure rate, SemiAnalysis Platinum-only rating
- PARTNERSHIP: 24/7 direct-to-expert support, Solutions Architects tune environments before launch, ARENA proving ground, Mission Control (1M+ data points/sec, proactive alerts), proactive node replacement before tickets are filed

Key products to know: SUNK (Slurm on Kubernetes), LOTA (Local Object Transport Accelerator), ARENA, Dedicated Inference, Flex Reservations, Spot, Mission Control, CoreWeave Interconnect, W&B Agent

Customer proof: Mistral (2.5x faster training), Cursor (3,688 GPUs on B300 in production), Göksu (0 to 2,500 GPUs no formal POC), Cohere (7 GB/s/GPU), IBM (80% faster training), Databricks (20% more FLOPs), Chai AI (8-10x faster container spin-up)

Third-party validation: SemiAnalysis Platinum (only provider), MLPerf 2,496-GPU record, NVIDIA Exemplar Cloud

GTM rules:
1. Lead with prospect's problem, not product features
2. Use specific proof (numbers, customer names, third-party ratings) not generic claims
3. Match the pillar to the prospect's situation (pace vs performance vs partnership)
4. Don't volunteer competitive info — redirect to CW's story fast
5. End with a specific, low-friction next step (ARENA trial, SUNK demo, architecture review)

Score this pitch and return ONLY valid JSON:
{
  "score": <0-100>,
  "reaction": "<2 sentences: how a savvy technical buyer would react to this pitch>",
  "missing": "<1-2 sentences: what's missing that would make it land harder>",
  "oneThingToAct": "<1 sentence: the single change that would most improve this pitch>",
  "rewrite": "<rewritten version of the pitch applying the GTM rules above, same length or shorter>",
  "pillarMatch": "<which pillar this pitch is strongest on: pace / performance / partnership / unclear>",
  "proofGap": "<which proof point or customer reference would strengthen this most>"
}`
}
