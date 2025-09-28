"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
  reactionTime: number | null;
  eliminated: boolean;
}

export default function GreenLight() {
  const [gameState, setGameState] = useState<"setup" | "waiting" | "ready" | "go" | "results" | "finished">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerCount, setPlayerCount] = useState(2);
  const [currentRound, setCurrentRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);
  const [lightColor, setLightColor] = useState<"red" | "yellow" | "green">("red");
  const [startTime, setStartTime] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<Player[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializePlayers = () => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        score: 0,
        reactionTime: null,
        eliminated: false
      });
    }
    setPlayers(newPlayers);
  };

  const startGame = () => {
    initializePlayers();
    setCurrentRound(1);
    startRound();
  };

  const startRound = () => {
    setGameState("waiting");
    setLightColor("red");
    setRoundResults([]);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset reaction times for active players
    setPlayers(prev => prev.map(p => ({
      ...p,
      reactionTime: null
    })));

    // Random delay between 2-6 seconds before showing green light
    const delay = Math.random() * 4000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      // Sometimes show yellow first (red herring)
      if (Math.random() < 0.3) {
        setLightColor("yellow");
        setTimeout(() => {
          setLightColor("green");
          setStartTime(Date.now());
          setGameState("go");
          
          // Auto-end round after 3 seconds if no one responds
          setTimeout(() => {
            if (gameState === "go") {
              setPlayers(prev => {
                const activePlayers = prev.filter(p => !p.eliminated);
                const respondedPlayers = activePlayers.filter(p => p.reactionTime !== null);
                if (respondedPlayers.length === 0) {
                  // No one responded - mark as all too slow
                  const updated = prev.map(p => ({ ...p, reactionTime: p.reactionTime || 999999 }));
                  endRound(updated);
                  return updated;
                }
                return prev;
              });
            }
          }, 3000);
        }, 500 + Math.random() * 1000);
      } else {
        setLightColor("green");
        setStartTime(Date.now());
        setGameState("go");
        
        // Auto-end round after 3 seconds if no one responds
        setTimeout(() => {
          setPlayers(prev => {
            const activePlayers = prev.filter(p => !p.eliminated);
            const respondedPlayers = activePlayers.filter(p => p.reactionTime !== null);
            if (respondedPlayers.length < activePlayers.length && gameState === "go") {
              // Mark non-responders as too slow
              const updated = prev.map(p => ({ 
                ...p, 
                reactionTime: p.reactionTime || 999999 
              }));
              endRound(updated);
              return updated;
            }
            return prev;
          });
        }, 3000);
      }
    }, delay);
  };

  const handleTap = () => {
    if (gameState === "go" && lightColor === "green") {
      const reactionTime = Date.now() - startTime;
      
      setPlayers(prev => {
        const updated = [...prev];
        const nextPlayer = updated.find(p => !p.eliminated && p.reactionTime === null);
        if (nextPlayer) {
          nextPlayer.reactionTime = reactionTime;
          
          // Check if all active players have responded
          const activePlayers = updated.filter(p => !p.eliminated);
          const respondedPlayers = activePlayers.filter(p => p.reactionTime !== null);
          
          if (respondedPlayers.length === activePlayers.length) {
            endRound(updated);
          }
        }
        return updated;
      });
    } else if (gameState === "waiting" || (gameState === "go" && lightColor !== "green")) {
      // Player tapped too early (false start)
      setPlayers(prev => {
        const updated = [...prev];
        const nextPlayer = updated.find(p => !p.eliminated && p.reactionTime === null);
        if (nextPlayer) {
          nextPlayer.reactionTime = -1; // Mark as false start
        }
        return updated;
      });
    }
  };

  const endRound = (updatedPlayers: Player[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const activePlayers = updatedPlayers.filter(p => !p.eliminated);
    
    // Sort by reaction time (false starts go to end)
    const sortedPlayers = [...activePlayers].sort((a, b) => {
      if (a.reactionTime === -1) return 1;
      if (b.reactionTime === -1) return -1;
      if (a.reactionTime === null) return 1;
      if (b.reactionTime === null) return -1;
      return a.reactionTime - b.reactionTime;
    });

    // Award points (3 for 1st, 2 for 2nd, 1 for 3rd, etc.)
    sortedPlayers.forEach((player, index) => {
      const pointsAwarded = Math.max(0, 3 - index);
      if (player.reactionTime !== -1 && player.reactionTime !== null) {
        player.score += pointsAwarded;
      }
    });

    setRoundResults(sortedPlayers);
    setGameState("results");
    
    setTimeout(() => {
      if (currentRound < maxRounds) {
        setCurrentRound(prev => prev + 1);
        startRound();
      } else {
        endGame();
      }
    }, 3000);
  };

  const endGame = () => {
    setGameState("finished");
  };

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setCurrentRound(1);
    setLightColor("red");
    setRoundResults([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getLightStyle = () => {
    const baseStyle = "w-32 h-32 rounded-full border-4 transition-all duration-300 mx-auto";
    switch (lightColor) {
      case "green":
        return `${baseStyle} bg-green-500 border-green-400 shadow-lg shadow-green-500/50`;
      case "yellow":
        return `${baseStyle} bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50`;
      default:
        return `${baseStyle} bg-red-500 border-red-400 shadow-lg shadow-red-500/50`;
    }
  };

  const finalResults = [...players].sort((a, b) => b.score - a.score);

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
            Green Light
          </h1>
          <p className="mt-2 text-white/70">Tap when you see green - but watch out for false signals!</p>
        </div>

        {/* Setup Screen */}
        {gameState === "setup" && (
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Game Rules</h2>
              <ul className="text-white/80 text-left space-y-2 text-sm mb-6">
                <li>• Wait for the green light to tap the screen</li>
                <li>• Don't tap on red or yellow - that's a false start!</li>
                <li>• Fastest reaction time gets the most points</li>
                <li>• Play {maxRounds} rounds, highest score wins</li>
                <li>• Pass the device around for turn-based play</li>
              </ul>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Players</label>
                  <select 
                    value={playerCount} 
                    onChange={(e) => setPlayerCount(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    {[2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num} className="bg-gray-800">{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rounds</label>
                  <select 
                    value={maxRounds} 
                    onChange={(e) => setMaxRounds(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    {[3,5,7,10].map(num => (
                      <option key={num} value={num} className="bg-gray-800">{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="bg-gradient-to-br from-emerald-400 to-lime-400 px-8 py-3 rounded-lg font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Game Screen */}
        {(gameState === "waiting" || gameState === "ready" || gameState === "go") && (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Round {currentRound} of {maxRounds}</h2>
              <div className="text-white/60">
                {gameState === "waiting" && "Wait for green..."}
                {gameState === "go" && lightColor === "green" && "TAP NOW!"}
                {gameState === "go" && lightColor !== "green" && "Don't tap yet!"}
              </div>
            </div>
            
            <div 
              className="mb-8 cursor-pointer select-none"
              onClick={handleTap}
            >
              <div className={getLightStyle()} />
            </div>
            
            {/* Active players status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-md mx-auto">
              <div className="text-sm text-white/80 mb-2">Waiting for players:</div>
              {players.filter(p => !p.eliminated).map(player => (
                <div key={player.id} className="text-sm flex justify-between items-center py-1">
                  <span>{player.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    player.reactionTime === null ? "bg-yellow-500/20 text-yellow-300" :
                    player.reactionTime === -1 ? "bg-red-500/20 text-red-300" :
                    "bg-green-500/20 text-green-300"
                  }`}>
                    {player.reactionTime === null ? "Waiting" :
                     player.reactionTime === -1 ? "False start!" :
                     `${player.reactionTime}ms`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Round Results */}
        {gameState === "results" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-6">Round {currentRound} Results</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md mx-auto mb-6">
              {roundResults.map((player, index) => (
                <div key={player.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
                    </span>
                    <span>{player.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${
                      player.reactionTime === -1 ? "text-red-400" : "text-green-400"
                    }`}>
                      {player.reactionTime === -1 ? "False start" : `${player.reactionTime}ms`}
                    </div>
                    <div className="text-xs text-white/60">
                      Score: {player.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-white/60">Next round starting...</p>
          </div>
        )}

        {/* Final Results */}
        {gameState === "finished" && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-500/20 to-lime-400/20 border border-emerald-500/30 rounded-xl p-8 max-w-md mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-4">🎉 Final Results!</h2>
              {finalResults.map((player, index) => (
                <div key={player.id} className={`flex justify-between items-center py-2 ${index === 0 ? "text-emerald-400 font-bold" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span>{index === 0 ? "👑" : `${index + 1}.`}</span>
                    <span>{player.name}</span>
                  </div>
                  <span>{player.score} points</span>
                </div>
              ))}
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