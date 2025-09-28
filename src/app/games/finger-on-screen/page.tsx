"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface Touch {
  id: number;
  x: number;
  y: number;
  playerId: number;
  active: boolean;
}

export default function FingerOnScreen() {
  const [gameState, setGameState] = useState<"setup" | "countdown" | "playing" | "finished">("setup");
  const [playerCount, setPlayerCount] = useState(2);
  const [touches, setTouches] = useState<Touch[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = [
    "#10b981", // emerald
    "#06d6a0", // teal  
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
  ];

  const startCountdown = () => {
    setGameState("countdown");
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    setGameState("playing");
    setGameTime(0);
    setTouches([]);
    setWinner(null);
    
    intervalRef.current = setInterval(() => {
      setGameTime(prev => prev + 0.1);
    }, 100);
  };

  const resetGame = () => {
    setGameState("setup");
    setTouches([]);
    setGameTime(0);
    setWinner(null);
    setCountdown(3);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    e.preventDefault();
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newTouches = Array.from(e.touches).map((touch, index) => {
      const existingTouch = touches.find(t => t.id === touch.identifier);
      return {
        id: touch.identifier,
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        playerId: existingTouch?.playerId || (touches.length + index),
        active: true
      };
    });

    setTouches(newTouches);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    e.preventDefault();
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    setTouches(prev => {
      const updated = [...prev];
      Array.from(e.touches).forEach(touch => {
        const index = updated.findIndex(t => t.id === touch.identifier);
        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          };
        }
      });
      return updated;
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    e.preventDefault();
    
    const activeTouchIds = Array.from(e.touches).map(t => t.identifier);
    
    setTouches(prev => {
      const remaining = prev.filter(touch => activeTouchIds.includes(touch.id));
      
      // Check if only one player remains
      if (remaining.length === 1 && gameState === "playing") {
        // Stop the timer immediately
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setWinner(remaining[0].playerId + 1);
        setGameState("finished");
      } else if (remaining.length === 0 && gameState === "playing") {
        // All fingers lifted at the same time - it's a tie
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setWinner(-1);
        setGameState("finished");
      }
      
      return remaining;
    });
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (gameState !== "playing") return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newTouch: Touch = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      playerId: touches.length,
      active: true
    };

    setTouches(prev => [...prev, newTouch]);
  };

  const handleMouseUp = () => {
    if (gameState !== "playing") return;
    
    setTouches(prev => {
      if (prev.length === 1 && gameState === "playing") {
        // Stop the timer immediately
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setWinner(prev[0].playerId + 1);
        setGameState("finished");
      } else if (prev.length === 0 && gameState === "playing") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setWinner(-1);
        setGameState("finished");
      }
      return [];
    });
  };

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

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-10">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Finger On Screen
          </h1>
          <p className="mt-2 text-white/70">Last finger standing wins!</p>
        </div>

        {/* Setup Screen */}
        {gameState === "setup" && (
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Game Rules</h2>
              <ul className="text-white/80 text-left space-y-2 text-sm mb-6">
                <li>• Each player places one finger on the screen</li>
                <li>• Keep your finger pressed down</li>
                <li>• If you lift your finger, you're out!</li>
                <li>• Last finger on screen wins</li>
                <li>• Works best on mobile/tablet</li>
              </ul>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Number of Players</label>
                <div className="flex justify-center gap-2">
                  {[2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => setPlayerCount(num)}
                      className={`w-12 h-12 rounded-lg border font-semibold transition-all ${
                        playerCount === num 
                          ? "bg-emerald-500 border-emerald-500 text-black" 
                          : "bg-white/10 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={startCountdown}
              className="bg-gradient-to-br from-emerald-400 to-lime-400 px-8 py-3 rounded-lg font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Countdown */}
        {gameState === "countdown" && (
          <div className="text-center">
            <div className="text-8xl font-bold text-emerald-400 mb-4">
              {countdown}
            </div>
            <p className="text-xl text-white/80">Get ready to place your fingers!</p>
          </div>
        )}

        {/* Game Screen */}
        {gameState === "playing" && (
          <div className="text-center">
            <div className="mb-4">
              <div className="text-2xl font-bold text-emerald-400">
                {gameTime.toFixed(1)}s
              </div>
              <div className="text-sm text-white/60">
                Active fingers: {touches.length}
              </div>
            </div>
            
            <div
              ref={gameAreaRef}
              className="relative w-full h-96 bg-white/5 border-2 border-dashed border-white/20 rounded-xl mx-auto touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/40 text-lg font-semibold">
                {touches.length === 0 ? "Place your fingers here!" : `${touches.length} finger${touches.length !== 1 ? 's' : ''} active`}
              </div>
              
              {touches.map((touch) => (
                <div
                  key={touch.id}
                  className="absolute w-12 h-12 rounded-full opacity-80 flex items-center justify-center text-white font-bold text-sm transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: touch.x,
                    top: touch.y,
                    backgroundColor: colors[touch.playerId % colors.length]
                  }}
                >
                  P{touch.playerId + 1}
                </div>
              ))}
            </div>
            
            <p className="mt-4 text-white/60 text-sm">
              Don't lift your finger! Last one wins.
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "finished" && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-500/20 to-lime-400/20 border border-emerald-500/30 rounded-xl p-8 max-w-md mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-2">🎉 Game Over!</h2>
              {winner === -1 ? (
                <p className="text-xl text-yellow-400 font-semibold">It's a Tie!</p>
              ) : (
                <p className="text-xl text-emerald-400 font-semibold">Player {winner} Wins!</p>
              )}
              <p className="text-white/60 mt-2">Game lasted {gameTime.toFixed(1)} seconds</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-br from-emerald-400 to-lime-400 px-6 py-3 rounded-lg font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
              >
                Play Again
              </button>
              <Link
                href="/games"
                className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Back to Games
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}