"use client";

import Link from "next/link";

export default function Home() {
  const year = new Date().getFullYear();

  const games = [
    { name: "Rock–Paper–Scissors (Hits)", tag: "2 players • super fast", soon: true },
    { name: "Finger On Screen", tag: "2–5 players • mobile", soon: true },
    { name: "Green Light", tag: "no player limit • reaction", soon: true },
    { name: "High / Low Dice", tag: "2 players • luck", soon: true },
  ];

  return (
    <div className="relative isolate min-h-screen bg-[#0b0f11] text-white antialiased">
      {/* Vibes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/10 blur-3xl" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light [background:radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
        <div className="mx-auto h-64 w-[120%] max-w-none animate-smoke bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-2xl" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center">
              {/* Leaf icon */}
              <img src="/baked-battles.png" alt="BB" className="rounded-xl" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Baked Battles</span>
          </Link>
          <div className="hidden sm:block">
            <a
              href="#discord"
              className="rounded-md bg-gradient-to-br from-emerald-400 to-lime-400 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
            >
              Get notified
            </a>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-16">
        {/* Under construction */}
        <section className="rounded-xl border border-amber-300/30 bg-amber-200/10 p-4 text-amber-200">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" />
            </svg>
            <p className="text-sm font-medium">
              Under Construction: rolling, coding, and playtesting. Public alpha soon™.
            </p>
          </div>
        </section>

        {/* Hero */}
        <section className="mt-10 grid gap-6 sm:grid-cols-5 sm:items-center">
          <div className="sm:col-span-3">
            <h1 className="bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              Games for stoners who just want to vibe.
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Starting super small: local party games you can play on one device with friends.
              Pass-the-phone, multi-touch, quick rounds. No accounts, no servers — just laughs.
              When it feels great locally, we’ll think about online.
            </p>

          </div>

          {/* Hero art (logo) */}
          <div className="sm:col-span-2">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              {/* Ambient gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-lime-400/20 to-teal-400/20 blur-2xl" />

              {/* Logo image */}
              <img
                src="/baked-battles.png"
                alt="Baked Battles logo"
                className="relative max-h-[80%] max-w-[80%] object-contain rounded-full"
              />
            </div>
          </div>

        </section>

        {/* Story / Vision — Local-first */}
        <section id="vision" className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-semibold">What I’m building</h3>
            <p className="mt-2 text-sm text-white/70">
              Tiny, goofy mini-games that work great on a single phone or tablet:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>• pass-the-phone & multi-touch play</li>
              <li>• quick rounds, simple rules, big laughs</li>
              <li>• “Munchies Mode” (bigger UI, slower pacing)</li>
              <li>• privacy by default (no tracking, no logins)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-semibold">Why local first</h3>
            <p className="mt-2 text-sm text-white/70">
              Local is instant and zero-stress. No lobbies, no netcode, no waiting —
              just hand the device around and play. It lets me iterate fast on what matters:
              tight controls, funny penalties, and solid game feel.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-semibold">Roadmap</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li><span className="font-semibold">Now:</span> 4 local games (RPS Hits, Finger On Screen, Green Light, High/Low Dice).</li>
              <li><span className="font-semibold">Next:</span> shareable scoreboards, optional “same-Wi-Fi” join via QR.</li>
              <li><span className="font-semibold">Later:</span> opt-in online lobbies if the local vibe is perfect.</li>
            </ul>
            <p className="mt-3 text-xs text-white/50">
              Promise: no ads, no crypto, no dark patterns — ever.
            </p>
          </div>
        </section>

        {/* Games grid (placeholders) */}
        <section id="games" className="mt-4">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Featured & Upcoming</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g, i) => (
              <article key={i} className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 via-lime-400/20 to-teal-400/20 blur-lg transition group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/80">
                    Preview coming soon
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{g.name}</h3>
                    <p className="text-sm text-white/60">{g.tag}</p>
                  </div>
                  {g.soon && (
                    <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/70">Soon</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Discord CTA */}
        <section
          id="discord"
          className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 text-center"
        >
          <h3 className="text-lg font-semibold">Join the Baked Battles Discord</h3>
          <p className="mt-1 text-sm text-white/70">
            Be first to hear updates, test games early, and hang out with the crew.
          </p>
          <a
            href="https://discord.gg/kbRSmTsY2F"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-emerald-400 to-lime-400 px-5 py-3 font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
          >
            Join Discord
          </a>
          <div className="mt-3 text-xs text-white/50">Solo dev build • No spam, just vibes</div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-white/60">
          <p>Copyright © {year} Baked Battles</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
