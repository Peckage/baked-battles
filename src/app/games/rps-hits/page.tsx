"use client";

import Link from "next/link";
import { useState, useCallback, useRef } from "react";

type Move = "rock" | "paper" | "scissors";
type GameMode = "vs-friend" | "vs-computer";

interface Player {
  name: string;
  health: number;
  move: Move | null;
  isComputer?: boolean;
}

export default function RPSHits() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "waiting" | "countdown" | "round" | "finished">("setup");
  const [gameMode, setGameMode] = useState<GameMode>("vs-friend");
  const [players, setPlayers] = useState<Player[]>([
    { name: "Player 1", health: 3, move: null },
    { name: "Player 2", health: 3, move: null }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundResult, setRoundResult] = useState<string>("");
  const [winner, setWinner] = useState<string>("");
  const [revealCountdown, setRevealCountdown] = useState(5);
  const resolvingRef = useRef(false);

  const moves: { move: Move; emoji: string; name: string }[] = [
    { move: "rock", emoji: "🪨", name: "Rock" },
    { move: "paper", emoji: "📄", name: "Paper" },
    { move: "scissors", emoji: "✂️", name: "Scissors" }
  ];

  const getWinner = (move1: Move, move2: Move): "player1" | "player2" | "tie" => {
    if (move1 === move2) return "tie";
    if (
      (move1 === "rock" && move2 === "scissors") ||
      (move1 === "paper" && move2 === "rock") ||
      (move1 === "scissors" && move2 === "paper")
    ) {
      return "player1";
    }
    return "player2";
  };

  const getComputerMove = (): Move => {
    const moves: Move[] = ["rock", "paper", "scissors"];
    return moves[Math.floor(Math.random() * moves.length)];
  };

  const handleMove = (move: Move) => {
    if (gameState !== "playing" && gameState !== "waiting") return;

    const newPlayers = [...players];
    newPlayers[currentPlayer].move = move;

    if (gameMode === "vs-computer") {
      // Playing against computer
      if (currentPlayer === 0) {
        // Player made move, now computer makes move
        newPlayers[1].move = getComputerMove();
        setPlayers(newPlayers);
        resolveRound();
      }
    } else {
      // Playing vs friend
      if (gameState === "playing" && currentPlayer === 0) {
        // Player 1 made their move, now wait for player 2
        setPlayers(newPlayers);
        setCurrentPlayer(1);
        setGameState("waiting");
      } else if (gameState === "waiting" && currentPlayer === 1) {
        // Player 2 made their move, start countdown
        setPlayers(newPlayers);
        setGameState("countdown");
        setRevealCountdown(5);
        
        const countdownInterval = setInterval(() => {
          setRevealCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              // Resolve round after countdown
              resolveRound();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  const resolveRound = useCallback(() => {
    if (resolvingRef.current) return; // Prevent double execution
    resolvingRef.current = true;
    
    const result = getWinner(players[0].move!, players[1].move!);
    
    const updatedPlayers = [...players];
    
    if (result === "tie") {
      setRoundResult("It's a tie! No damage dealt.");
    } else if (result === "player1") {
      updatedPlayers[1].health -= 1;
      setRoundResult(`${updatedPlayers[0].name} wins the round! ${updatedPlayers[1].name} takes damage.`);
    } else {
      updatedPlayers[0].health -= 1;
      setRoundResult(`${updatedPlayers[1].name} wins the round! ${updatedPlayers[0].name} takes damage.`);
    }

    // Update players with new health
    setPlayers(updatedPlayers);

    // Check for winner
    if (updatedPlayers[0].health <= 0) {
      setWinner(updatedPlayers[1].name);
      setGameState("finished");
      resolvingRef.current = false;
    } else if (updatedPlayers[1].health <= 0) {
      setWinner(updatedPlayers[0].name);
      setGameState("finished");
      resolvingRef.current = false;
    } else {
      setGameState("round");
      setTimeout(() => {
        setGameState("playing");
        setCurrentPlayer(0);
        setPlayers(prev => prev.map(p => ({ ...p, move: null })));
        resolvingRef.current = false; // Reset the flag after the round is complete
      }, 3000);
    }
  }, [players]);

  const startGame = () => {
    const newPlayers = gameMode === "vs-computer" 
      ? [
          { name: "You", health: 3, move: null },
          { name: "Computer", health: 3, move: null, isComputer: true }
        ]
      : [
          { name: "Player 1", health: 3, move: null },
          { name: "Player 2", health: 3, move: null }
        ];
    
    setPlayers(newPlayers);
    setGameState("playing");
    setCurrentPlayer(0);
    setRoundResult("");
    setWinner("");
  };

  const resetGame = () => {
    setGameState("setup");
    setGameMode("vs-friend");
    setPlayers([
      { name: "Player 1", health: 3, move: null },
      { name: "Player 2", health: 3, move: null }
    ]);
    setCurrentPlayer(0);
    setRoundResult("");
    setWinner("");
    setRevealCountdown(5);
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
            Rock–Paper–Scissors (Hits)
          </h1>
          <p className="mt-2 text-white/70">First to reduce opponent's health to 0 wins!</p>
        </div>

        {/* Setup Screen */}
        {gameState === "setup" && (
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8 max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-4">Choose Game Mode</h2>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <button
                  onClick={() => setGameMode("vs-friend")}
                  className={`p-4 rounded-lg border transition-all ${
                    gameMode === "vs-friend" 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">👥 VS Friend</div>
                  <div className="text-sm text-white/70 mt-1">
                    Pass the phone • Hidden moves • 5 second reveal
                  </div>
                </button>
                
                <button
                  onClick={() => setGameMode("vs-computer")}
                  className={`p-4 rounded-lg border transition-all ${
                    gameMode === "vs-computer" 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">🤖 VS Computer</div>
                  <div className="text-sm text-white/70 mt-1">
                    Solo play • Perfect for giga stoners • Instant results
                  </div>
                </button>
              </div>
              
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2">Game Rules</h3>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• Each player starts with 3 health points</li>
                  <li>• Winner of each round deals 1 damage</li>
                  <li>• Ties deal no damage</li>
                  <li>• First player to reach 0 health loses!</li>
                </ul>
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
        {(gameState === "playing" || gameState === "waiting" || gameState === "countdown" || gameState === "round") && (
          <div className="space-y-8">
            {/* Player Health */}
            <div className="flex justify-between items-center">
              {players.map((player, index) => (
                <div key={index} className="text-center">
                  <h3 className={`text-lg font-semibold ${(currentPlayer === index && gameState === "playing") ? "text-emerald-400" : "text-white/80"}`}>
                    {player.name}
                  </h3>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full ${
                          i < player.health ? "bg-emerald-500" : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  {(gameState === "round") && player.move && (
                    <div className="mt-2 text-2xl">
                      {moves.find(m => m.move === player.move)?.emoji}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Waiting for Player 2 */}
            {gameState === "waiting" && gameMode === "vs-friend" && (
              <div className="text-center">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 max-w-md mx-auto mb-6">
                  <h2 className="text-xl font-semibold mb-2">🔄 Pass the Phone!</h2>
                  <p className="text-white/80">
                    {players[0].name} has made their move.
                  </p>
                  <p className="text-white/80 mt-2">
                    Pass the device to {players[1].name} to make their move.
                  </p>
                  <p className="text-sm text-white/60 mt-4">
                    Moves are hidden until both players choose!
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {moves.map((moveData) => (
                    <button
                      key={moveData.move}
                      onClick={() => handleMove(moveData.move)}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all hover:scale-105"
                    >
                      <div className="text-4xl mb-2">{moveData.emoji}</div>
                      <div className="font-medium">{moveData.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Player's Turn (Computer mode or first move in friend mode) */}
            {gameState === "playing" && (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-6">
                  {gameMode === "vs-computer" ? "Your Turn" : `${players[currentPlayer].name}'s Turn`}
                </h2>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {moves.map((moveData) => (
                    <button
                      key={moveData.move}
                      onClick={() => handleMove(moveData.move)}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all hover:scale-105"
                    >
                      <div className="text-4xl mb-2">{moveData.emoji}</div>
                      <div className="font-medium">{moveData.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Countdown Phase */}
            {gameState === "countdown" && (
              <div className="text-center">
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 max-w-md mx-auto">
                  <h2 className="text-xl font-semibold mb-2">🎉 Both players ready!</h2>
                  <div className="text-6xl font-bold text-yellow-400 my-4">
                    {revealCountdown}
                  </div>
                  <p className="text-white/80">Revealing moves...</p>
                </div>
              </div>
            )}

            {/* Round Result */}
            {gameState === "round" && (
              <div className="text-center">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md mx-auto">
                  <h2 className="text-lg font-semibold mb-2">Round Result</h2>
                  <p className="text-white/80">{roundResult}</p>
                  <p className="text-sm text-white/60 mt-4">Next round starting...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "finished" && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-500/20 to-lime-400/20 border border-emerald-500/30 rounded-xl p-8 max-w-md mx-auto mb-8">
              <h2 className="text-2xl font-bold mb-2">🎉 Game Over!</h2>
              <p className="text-xl text-emerald-400 font-semibold">{winner} Wins!</p>
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