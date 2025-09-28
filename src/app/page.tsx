"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const year = new Date().getFullYear();
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string, delay: string, duration: string}>>([]);
  const [hoverParticles, setHoverParticles] = useState<Array<{id: number, left: string, top: string, delay: string}>>([]);

  // Generate particles client-side to avoid hydration mismatch
  useEffect(() => {
    const generateParticles = () => {
      return Array.from({length: 50}, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`
      }));
    };
    setParticles(generateParticles());

    // Generate hover particles
    const generateHoverParticles = () => {
      return Array.from({length: 5}, (_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
        delay: `${Math.random() * 2}s`
      }));
    };
    setHoverParticles(generateHoverParticles());
  }, []);

  const games = [
    { 
      name: "Rock Paper Scissors", 
      tag: "1-2 players • strategy", 
      emoji: "✂️", 
      color: "from-red-500 to-orange-500",
      bgGlow: "bg-red-500/20",
      description: "Classic RPS with a stoner twist - no double hits allowed!",
      vibe: "Competitive",
      slug: "rps-hits" 
    },
    { 
      name: "Pattern Memory", 
      tag: "single player • memory", 
      emoji: "🧠", 
      color: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/20",
      description: "Test your memory with colorful sequences - like Simon says but cooler",
      vibe: "Mind-bending",
      slug: "pattern-memory" 
    },
    { 
      name: "Live Finger Roulette", 
      tag: "2+ players • live selection", 
      emoji: "🖐️", 
      color: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/20",
      description: "Everyone holds their finger down - who gets chosen for the consequence?",
      vibe: "Suspenseful",
      slug: "finger-on-screen" 
    },
    { 
      name: "High-Low Dice", 
      tag: "any players • prediction", 
      emoji: "🎲", 
      color: "from-green-500 to-emerald-500",
      bgGlow: "bg-green-500/20",
      description: "Predict if the next roll will be higher or lower - simple but addictive",
      vibe: "Lucky",
      slug: "high-low-dice" 
    },
    { 
      name: "Speed Tap", 
      tag: "1-6 players • reflexes", 
      emoji: "⚡", 
      color: "from-yellow-500 to-orange-500",
      bgGlow: "bg-yellow-500/20",
      description: "Tap as fast as you can in 10 seconds - who has the fastest fingers?",
      vibe: "Intense",
      slug: "speed-tap" 
    },
    { 
      name: "Never Have I Ever", 
      tag: "3+ players • party", 
      emoji: "🍻", 
      color: "from-pink-500 to-rose-500",
      bgGlow: "bg-pink-500/20",
      description: "Digital version of the classic party game - confess or take a hit!",
      vibe: "Revealing",
      slug: "never-have-i-ever" 
    },
    { 
      name: "Truth or Dare", 
      tag: "2+ players • party", 
      emoji: "🎭", 
      color: "from-indigo-500 to-purple-500",
      bgGlow: "bg-indigo-500/20",
      description: "Stoner-friendly truths and hilarious dares - get ready to laugh!",
      vibe: "Wild",
      slug: "truth-or-dare" 
    },
    { 
      name: "Draw & Guess Stoner", 
      tag: "3+ players • creative", 
      emoji: "🎨", 
      color: "from-teal-500 to-green-500",
      bgGlow: "bg-teal-500/20",
      description: "Draw weird prompts and guess what your friends created - pure chaos!",
      vibe: "Artistic",
      slug: "draw-and-guess" 
    },
  ];

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white antialiased overflow-x-hidden">
      {/* Enhanced Background Effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-green-400/30 blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-32 h-80 w-80 rounded-full bg-purple-400/30 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse delay-3000" />
      </div>
      
      {/* Floating Particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>
      
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light [background:radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Header */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative">
              <img src="/baked-battles.png" alt="BB" className="w-12 h-12 rounded-2xl shadow-lg" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-purple-400 rounded-2xl blur opacity-30"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              Baked Battles
            </span>
          </Link>
          <div className="hidden sm:block">
            <a
              href="#discord"
              className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:scale-105 hover:shadow-green-500/40"
            >
              🌿 Join the Crew
            </a>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-6">
              🔥 8 Games Available
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Epic Games
              </span>
              <br />
              <span className="text-white">
                for Stoners
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Pass-the-phone party games designed for when you're vibing with friends. 
              No accounts, no BS — just pure fun that hits different when you're elevated. 🌿✨
            </p>
            <div className="flex gap-4">
              <a
                href="#games"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-xl shadow-green-500/25 transition-all hover:scale-105 hover:shadow-green-500/40"
              >
                🎮 Play Now
              </a>
              <a
                href="#vision"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-lg backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/5"
              >
                🧠 Learn More
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-purple-400/30 to-pink-400/30 blur-2xl"></div>
              <img
                src="/baked-battles.png"
                alt="Baked Battles"
                className="relative w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white font-bold text-2xl mb-2">Ready to Vibe?</div>
                <div className="text-green-300 font-semibold">8 games • Infinite laughs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="mb-20">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 backdrop-blur-sm">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div>
              <div className="relative">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-bold mb-4 text-green-400">Built for Stoners</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Bigger UI elements for when you're feeling it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Slower pacing that matches your vibe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Perfect for group sessions and chill nights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>No complicated rules - just pure fun</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
              <div className="relative">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-4 text-purple-400">Local & Live</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Pass-the-phone gameplay that brings people together</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Multi-touch games for simultaneous play</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>No internet required - works anywhere</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Instant fun, no setup or downloads</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 backdrop-blur-sm">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="relative">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">What's Next</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>More party games and creative challenges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Shareable high scores and achievements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Optional online features if the vibe is right</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Forever free with no ads or dark patterns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section id="games" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              🎮 Choose Your Vibe
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each game is crafted for maximum fun when you're chilling with friends. 
              Pick your mood and dive into the chaos!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game, i) => (
              <Link
                key={i}
                href={`/games/${game.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-white/30 hover:shadow-2xl"
                onMouseEnter={() => setHoveredGame(game.slug)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${game.bgGlow} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${game.color} shadow-lg`}>
                      {game.emoji}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${game.color} text-white shadow-lg`}>
                      {game.vibe}
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                      {game.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{game.tag}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Play Button */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${game.color} text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      🎮 Play Now
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      →
                    </div>
                  </div>

                  {/* Hover Effect Particles */}
                  {hoveredGame === game.slug && (
                    <div className="absolute inset-0 pointer-events-none">
                      {hoverParticles.map((particle) => (
                        <div
                          key={particle.id}
                          className={`absolute w-1 h-1 ${game.bgGlow} rounded-full animate-ping`}
                          style={{
                            left: particle.left,
                            top: particle.top,
                            animationDelay: particle.delay
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Discord CTA */}
        <section
          id="discord"
          className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-purple-500/10 to-pink-500/10 p-10 text-center backdrop-blur-sm"
        >
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="text-6xl mb-6">🌿💬</div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              Join the Baked Battles Crew
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with fellow stoners, share epic game moments, and be the first to know about new games. 
              Plus, we drop exclusive game ideas and host online sessions! 🎮
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://discord.gg/kbRSmTsY2F"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-xl shadow-green-500/25 transition-all hover:scale-105 hover:shadow-green-500/40"
              >
                <span>🌿</span>
                Join Discord
                <span>💬</span>
              </a>
              <div className="text-sm text-gray-400">
                <div className="font-semibold text-green-400">0 members</div>
                <div>No spam, just good vibes</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-8 text-sm">
          <div className="flex items-center gap-4">
            <img src="/baked-battles.png" alt="BB" className="w-8 h-8 rounded-lg" />
            <p className="text-gray-400">© {year} Baked Battles • Made with 🌿 for stoners</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</Link>
            <a 
              href="https://discord.gg/kbRSmTsY2F" 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
