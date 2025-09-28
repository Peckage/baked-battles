import Link from "next/link";

export default function Games() {
  const games = [
    { 
      name: "Rock–Paper–Scissors (Hits)", 
      tag: "2 players • super fast", 
      slug: "rps-hits",
      description: "Classic RPS but with hit points and special moves!",
      available: true 
    },
    { 
      name: "Finger On Screen", 
      tag: "2–5 players • mobile", 
      slug: "finger-on-screen",
      description: "Keep your finger on the screen the longest to win!",
      available: true 
    },
    { 
      name: "Green Light", 
      tag: "no player limit • reaction", 
      slug: "green-light",
      description: "Tap when you see green, but watch out for red!",
      available: true 
    },
    { 
      name: "High / Low Dice", 
      tag: "2 players • luck", 
      slug: "high-low-dice",
      description: "Predict if the next roll will be higher or lower!",
      available: true 
    },
  ];

  return (
    <div className="relative isolate min-h-screen bg-[#0b0f11] text-white antialiased">
      {/* Background vibes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center">
              <img src="/baked-battles.png" alt="BB" className="rounded-xl" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Baked Battles</span>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-16">
        <div className="text-center mb-12">
          <h1 className="bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Available Games
          </h1>
          <p className="mt-4 text-white/70">
            Choose a game to play with your friends!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={game.available ? `/games/${game.slug}` : "#"}
              className={`group overflow-hidden rounded-xl border ${game.available ? 'border-white/10 hover:border-emerald-500/30 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-white/5 bg-white/[0.01] cursor-not-allowed opacity-50'} transition-all duration-200`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className={`h-full w-full bg-gradient-to-br ${game.available ? 'from-emerald-500/20 via-lime-400/20 to-teal-400/20' : 'from-gray-600/20 via-gray-500/20 to-gray-400/20'} blur-lg transition group-hover:scale-105`} />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/80">
                  {game.available ? '🎮 Ready to Play' : '🚧 Coming Soon'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{game.name}</h3>
                  {!game.available && (
                    <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/70">Soon</span>
                  )}
                </div>
                <p className="text-sm text-white/60 mb-3">{game.tag}</p>
                <p className="text-sm text-white/80">{game.description}</p>
                {game.available && (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                    Play Now →
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-emerald-400 to-lime-400 px-4 py-2 font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}