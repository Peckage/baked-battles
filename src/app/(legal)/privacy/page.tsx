import Link from "next/link";
import React from "react";

const Privacy = () => {
    return (
        <div className="relative isolate min-h-screen bg-[#0b0f11] text-white antialiased">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
                <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/10 blur-3xl" />
            </div>
            
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

            <main className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
                <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>
                <p className="text-lg text-white/80">
                    We don't want your data. We don't need your data. We're here to make games, not profiles. Play, laugh, and relax — no tracking, no selling, no shady stuff.
                </p>
                <p className="mt-4 text-white/60">
                    The only thing we store is good vibes.
                </p>
                
                <div className="mt-8">
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
};

export default Privacy;
