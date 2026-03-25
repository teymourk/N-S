# Nima & Saba — The Game

A premium wedding game website built for Nima & Saba's wedding. Guests scan a QR code, join on their phones, and compete through 7 interactive game rounds throughout the night — all connected by a persistent leaderboard.

## The Games

| # | Game | Description | Mechanic |
|---|------|-------------|----------|
| 1 | **Who Said It?** | Swipe right for Nima, left for Saba — guess who said each quote | Tinder-style swipe cards |
| 2 | **How Well Do You Know Them?** | Timed multiple-choice trivia about the couple | Kahoot-style with speed bonus |
| 3 | **Love Story Timeline** | Drag relationship milestones into chronological order | Drag-and-drop reordering |
| 4 | **Predict the Night** | Over/under bets on what happens during the reception | Prop bets with live scoring |
| 5 | **Finish Their Sentence** | Guess how the couple finished a sentence, then see the reveal | Text input + dramatic reveal |
| 6 | **Shoe Game LIVE** | Predict each shoe game answer on your phone before the couple reveals | Real-time audience predictions |
| 7 | **Love Letter** | Write a message sealed in a digital time capsule for their anniversary | Wax seal animation |

## Design

- **Dark luxe theme** — deep dark backgrounds with warm gold accents
- **Glassmorphism** — frosted glass cards with backdrop blur throughout
- **Animated backgrounds** — floating gold particles, drifting gradient blobs, grain texture
- **Cinematic intro** — "N & S" monogram reveal with gold shimmer on every visit
- **Mobile-first** — designed for phones, every interaction is touch-optimized
- **Framer Motion** — spring animations, gesture feedback, page transitions everywhere

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + inline styles |
| Animation | Framer Motion |
| Database | Supabase (Postgres + Realtime) |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Hosting | Vercel (free tier) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser (best viewed on mobile or mobile dev tools).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, providers
│   ├── page.tsx                # Landing page + game hub + intro animation
│   ├── globals.css             # Design system (dark luxe theme)
│   └── game/
│       ├── who-said-it/        # Game 1: Swipe cards
│       ├── trivia/             # Game 2: Timed quiz
│       ├── timeline/           # Game 3: Drag & drop
│       ├── predictions/        # Game 4: Prop bets
│       ├── finish-sentence/    # Game 5: Video reveal
│       ├── shoe-game/          # Game 6: Live predictions
│       └── love-letter/        # Game 7: Time capsule
├── components/
│   ├── background.tsx          # Animated mesh gradient + floating particles
│   ├── celebration.tsx         # Confetti, score popups, flash effects
│   ├── game-card.tsx           # Game selection cards (glassmorphism)
│   ├── game-layout.tsx         # Shared game page layout
│   ├── guest-registration.tsx  # Registration form (frosted glass)
│   ├── intro-sequence.tsx      # Cinematic "N & S" intro
│   └── leaderboard.tsx         # Animated leaderboard (gold/silver/bronze)
├── lib/
│   ├── games.ts                # Game configs + couple data
│   ├── guest-context.tsx       # Guest auth (localStorage)
│   └── supabase.ts             # Supabase client
└── types/
    └── index.ts                # TypeScript definitions for all 7 games
```

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a1a` | Page backgrounds |
| Gold | `#d4a574` | Primary accent, buttons, highlights |
| Champagne | `#f0e6d3` | Text, headings |
| Muted | `#8a8695` | Secondary text, labels |
| Emerald | `#6ee7b7` | Correct answers, success |
| Coral | `#fca5a5` | Wrong answers, errors |
| Glass | `rgba(255,255,255,0.05)` | Card backgrounds |

## Deployment

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — done

Print a QR code pointing to the Vercel URL and place it on every table.

## What's Next

- [ ] Connect Supabase for real score persistence
- [ ] Admin panel to unlock/lock games throughout the night
- [ ] Real-time leaderboard sync across all guests
- [ ] Real-time shoe game sync (admin triggers reveals)
- [ ] Replace placeholder content with real couple data
- [ ] Add video clips for Finish Their Sentence game

---

Built with love for Nima & Saba's wedding.
