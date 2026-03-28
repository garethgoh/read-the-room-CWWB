# Read the Room

Pitch scorer and selling simulator for the CoreWeave GTM team.

## Local setup

```bash
npm install
cp .env.local.example .env.local
# paste your Anthropic API key into .env.local
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Deploy

## Structure

- `/` — home, links to scorer and simulator
- `/scorer` — paste a pitch, get resonance score + feedback from a persona
- `/simulator` — live roleplay chat with deal stage tracking

## Adding personas

Edit `src/lib/personas.js` — each persona has triggers, red flags, proof points, and a simulation prompt.
