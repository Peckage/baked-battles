"use client";

import Link from "next/link";
import { useState } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
  currentGuess: "higher" | "lower" | null;
  streak: number;
}

export default function HighLowDice() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "guessing" | "revealing" | "finished">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentDie, setCurrentDie] = useState(1);
  const [nextDie, setNextDie] = useState(1);
  const [maxRounds, setMaxRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const diceEmojis = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  const initializePlayers = () => {
    const newPlayers: Player[] = [
      { id: 0, name: "Player 1", score: 0, currentGuess: null, streak: 0 },
      { id: 1, name: "Player 2", score: 0, currentGuess: null, streak: 0 }
    ];
    setPlayers(newPlayers);
  };

  const startGame = () => {
    initializePlayers();
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setCurrentDie(Math.floor(Math.random() * 6) + 1);
    setGameState("playing");
  };

  const makeGuess = (guess: "higher" | "lower") => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[currentPlayerIndex].currentGuess = guess;
      return updated;
    });
    setGameState("revealing");
    rollDice();
  };

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate the dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setNextDie(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setNextDie(finalRoll);
        setTimeout(() => {
          setIsRolling(false);
          checkResult(finalRoll);
        }, 100); // Small delay to ensure state is updated
      }
    }, 100);
  };

  const checkResult = (nextRoll: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let wasCorrect = false;
    
    if (currentPlayer.currentGuess === "higher") {
      wasCorrect = nextRoll > currentDie;
    } else if (currentPlayer.currentGuess === "lower") {
      wasCorrect = nextRoll < currentDie;
    }
    
    // Ties (same number) are always considered correct regardless of guess
    if (nextRoll === currentDie) {
      wasCorrect = true;
    }

    setPlayers(prev => {
      const updated = [...prev];
      const player = updated[currentPlayerIndex];
      
      if (wasCorrect) {
        player.score += 1;
        player.streak += 1;
        // Bonus points for streaks
        if (player.streak >= 3) {
          player.score += Math.floor(player.streak / 3);
        }
      } else {
        player.streak = 0;
      }
      
      player.currentGuess = null;
      return updated;
    });

    setTimeout(() => {
      setCurrentDie(nextRoll);
      
      if (currentRound >= maxRounds) {
        setGameState("finished");
      } else {
        // Switch to next player
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        setCurrentPlayerIndex(nextPlayerIndex);
        
        // If we've cycled through all players, start next round
        if (nextPlayerIndex === 0) {
          setCurrentRound(prev => prev + 1);
        }
        
        setGameState("playing");
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setCurrentDie(1);
    setNextDie(1);
    setIsRolling(false);
  };

  const currentPlayer = players[currentPlayerIndex];
  const winner = [...players].sort((a, b) => b.score - a.score)[0];

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
            High / Low Dice
          </h1>
          <p className="mt-2 text-white/70">Predict if the next roll will be higher or lower!</p>
        </div>

        {/* Setup Screen */}
        {gameState === "setup" && (
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Game Rules</h2>
              <ul className="text-white/80 text-left space-y-2 text-sm mb-6">
                <li>• Players take turns guessing if the next dice roll will be higher or lower</li>
                <li>• Correct guesses earn 1 point</li>
                <li>• Streaks of 3+ correct guesses earn bonus points</li>
                <li>• Equal rolls count as correct for either guess</li>
                <li>• Highest score after {maxRounds} rounds wins!</li>
              </ul>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Number of Rounds</label>
                <div className="flex justify-center gap-2">
                  {[5, 10, 15, 20].map(num => (
                    <button
                      key={num}
                      onClick={() => setMaxRounds(num)}
                      className={`px-4 py-2 rounded-lg border font-semibold transition-all ${
                        maxRounds === num 
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
              onClick={startGame}
              className="bg-gradient-to-br from-emerald-400 to-lime-400 px-8 py-3 rounded-lg font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-105"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Game Screen */}
        {(gameState === "playing" || gameState === "guessing" || gameState === "revealing") && (
          <div className="text-center">
            {/* Round and Player Info */}
            <div className="mb-8">
              <div className="text-lg font-semibold text-emerald-400 mb-2">
                Round {currentRound} of {maxRounds}
              </div>
              <div className="text-xl font-bold">
                {currentPlayer?.name}'s Turn
              </div>
              {currentPlayer?.streak > 0 && (
                <div className="text-sm text-yellow-400">
                  🔥 {currentPlayer.streak} streak!
                </div>
              )}
            </div>

            {/* Current Dice */}
            <div className="mb-8">
              <div className="text-sm text-white/60 mb-2">Current roll:</div>
              <div className="text-8xl mb-4">{diceEmojis[currentDie]}</div>
              <div className="text-2xl font-bold">{currentDie}</div>
            </div>

            {/* Guess Buttons */}
            {gameState === "playing" && (
              <div className="mb-8">
                <div className="text-lg mb-4">Will the next roll be higher or lower?</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => makeGuess("lower")}
                    className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition-all hover:scale-105"
                  >
                    📉 LOWER
                  </button>
                  <button
                    onClick={() => makeGuess("higher")}
                    className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition-all hover:scale-105"
                  >
                    📈 HIGHER
                  </button>
                </div>
              </div>
            )}

            {/* Next Dice (during reveal) */}
            {gameState === "revealing" && (
              <div className="mb-8">
                <div className="text-sm text-white/60 mb-2">
                  {currentPlayer?.name} guessed: {currentPlayer?.currentGuess?.toUpperCase()}
                </div>
                <div className="text-sm text-white/60 mb-2">Next roll:</div>
                <div className={`text-8xl mb-4 ${isRolling ? 'animate-bounce' : ''}`}>
                  {diceEmojis[nextDie]}
                </div>
                <div className="text-2xl font-bold">{nextDie}</div>
                {!isRolling && (
                  <div className="mt-4">
                    {((currentPlayer?.currentGuess === "higher" && nextDie > currentDie) ||
                      (currentPlayer?.currentGuess === "lower" && nextDie < currentDie) ||
                      (nextDie === currentDie)) ? (
                      <div className="text-green-400 font-bold text-xl">✅ Correct!</div>
                    ) : (
                      <div className="text-red-400 font-bold text-xl">❌ Wrong!</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Score Board */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-4">Scores</h3>
              {players.map(player => (
                <div key={player.id} className={`flex justify-between items-center py-2 ${player.id === currentPlayerIndex ? 'text-emerald-400 font-bold' : ''}`}>
                  <span>{player.name}</span>
                  <div className="text-right">
                    <div>{player.score} points</div>
                    {player.streak > 0 && (
                      <div className="text-xs text-yellow-400">
                        {player.streak} streak
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "finished" && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-500/20 to-lime-400/20 border border-emerald-500/30 rounded-xl p-8 max-w-md mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-4">🎉 Game Over!</h2>
              <div className="space-y-2 mb-4">
                <div className="text-xl text-emerald-400 font-bold">
                  👑 {winner.name} Wins!
                </div>
                <div className="text-lg">
                  Final Score: {winner.score} points
                </div>
              </div>
              
              <div className="text-sm text-white/80 border-t border-white/10 pt-4">
                <h4 className="font-semibold mb-2">Final Standings:</h4>
                {[...players].sort((a, b) => b.score - a.score).map((player, index) => (
                  <div key={player.id} className="flex justify-between py-1">
                    <span>{index + 1}. {player.name}</span>
                    <span>{player.score} points</span>
                  </div>
                ))}
              </div>
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