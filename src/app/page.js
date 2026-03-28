import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Read the Room</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Test how your pitch lands. Roleplay the deal. CoreWeave GTM tool.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link href="/scorer">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-base">Pitch Scorer</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Paste any message or pitch and get a resonance score, reaction, and rewrite from
                    a specific persona's point of view.
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-gray-400 text-lg ml-4 mt-0.5 transition-colors">→</span>
              </div>
              <div className="flex gap-2 mt-4">
                {["Score 0–100", "What's missing", "Suggested rewrite"].map((l) => (
                  <span key={l} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          <Link href="/simulator">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-base">Selling Simulator</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Roleplay a live sales conversation. Claude plays the buyer. Win probability and
                    deal stage update in real time.
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-gray-400 text-lg ml-4 mt-0.5 transition-colors">→</span>
              </div>
              <div className="flex gap-2 mt-4">
                {["Live roleplay", "Deal stage tracker", "Next best move"].map((l) => (
                  <span key={l} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">CoreWeave · Internal GTM tool</p>
      </div>
    </main>
  )
}
