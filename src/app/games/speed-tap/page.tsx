"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface GameResult {
  score: number;
  timeLeft: number;
  tapsPerSecond: number;
}

export default function SpeedTap() {
  const [gameState, setGameState] = useState<"setup" | "countdown" | "playing" | "finished">("setup");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameMode, setGameMode] = useState<"solo" | "multiplayer">("solo");
  const [players, setPlayers] = useState<{name: string, result?: GameResult}[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('speed-tap-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startSoloGame = () => {
    setGameMode("solo");
    setPlayers([]);
    startCountdown();
  };

  const startMultiplayerGame = (playerCount: number) => {
    setGameMode("multiplayer");
    const newPlayers = Array.from({length: playerCount}, (_, i) => ({
      name: `Player ${i + 1}`
    }));
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    startCountdown();
  };

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
    setScore(0);
    setTimeLeft(10);
    
    // Start 10 second timer
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (gameState === "playing") {
      setScore(prev => prev + 1);
    }
  };

  const endGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const tapsPerSecond = score / 10;
    const result: GameResult = {
      score,
      timeLeft: 0,
      tapsPerSecond: parseFloat(tapsPerSecond.toFixed(2))
    };

    if (gameMode === "solo") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('speed-tap-highscore', score.toString());
      }
      setGameState("finished");
    } else {
      // Multiplayer - save this player's result
      setPlayers(prev => prev.map((p, i) => 
        i === currentPlayerIndex ? {...p, result} : p
      ));
      
      if (currentPlayerIndex < players.length - 1) {
        // Next player
        setCurrentPlayerIndex(prev => prev + 1);
        setTimeout(() => startCountdown(), 2000);
      } else {
        // All players done
        setGameState("finished");
      }
    }
  };

  const resetGame = () => {
    setGameState("setup");
    setScore(0);
    setTimeLeft(10);
    setCountdown(3);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const getCurrentPlayer = () => {
    return players[currentPlayerIndex];
  };

  const getMultiplayerWinner = () => {
    return players.reduce((winner, current) => 
      (current.result?.score || 0) > (winner.result?.score || 0) ? current : winner
    );
  };

  const getTapMessage = (tapsPerSecond: number) => {
    if (tapsPerSecond >= 8) return "🔥 INSANE! Are you even human?!";
    if (tapsPerSecond >= 6) return "🚀 Lightning fast reflexes!";
    if (tapsPerSecond >= 5) return "⚡ Pretty speedy there!";
    if (tapsPerSecond >= 4) return "👍 Not bad, not bad!";
    if (tapsPerSecond >= 3) return "😅 Getting warmed up?";
    if (tapsPerSecond >= 2) return "🐌 Maybe try some coffee?";
    return "🦥 Were you even trying? 😂";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            ⚡ Speed Tap
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tap as fast as humanly possible for 10 seconds! Test your reflexes and see who has the fastest fingers!
          </p>
        </div>

        {/* High Score Display */}
        {highScore > 0 && (
          <div className="text-center mb-6">
            <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-6 py-2">
              <div className="text-yellow-400 font-bold">High Score: {highScore} taps</div>
              <div className="text-sm text-gray-400">{(highScore / 10).toFixed(2)} taps/sec</div>
            </div>
          </div>
        )}

        {gameState === "setup" && (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Game Mode</h2>
            <div className="space-y-4">
              <button
                onClick={startSoloGame}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Solo Challenge
              </button>
              
              <div className="text-gray-400 text-sm">or compete with friends</div>
              
              {[2, 3, 4, 5, 6].map(count => (
                <button
                  key={count}
                  onClick={() => startMultiplayerGame(count)}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                >
                  {count} Players
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === "countdown" && (
          <div className="text-center">
            {gameMode === "multiplayer" && (
              <h2 className="text-2xl font-bold mb-4">{getCurrentPlayer()?.name}'s Turn</h2>
            )}
            <div className="text-8xl font-bold text-red-400 mb-4 animate-pulse">
              {countdown}
            </div>
            <p className="text-xl text-gray-300">Get ready to tap!</p>
          </div>
        )}

        {gameState === "playing" && (
          <div className="text-center">
            {gameMode === "multiplayer" && (
              <h2 className="text-2xl font-bold mb-4">{getCurrentPlayer()?.name} - GO!</h2>
            )}
            
            <div className="mb-6">
              <div className="text-6xl font-bold text-red-400 mb-2">{score}</div>
              <div className="text-2xl text-gray-300 mb-2">taps</div>
              <div className="text-xl text-yellow-400">Time: {timeLeft}s</div>
              <div className="text-sm text-gray-400">
                {timeLeft < 10 ? `${(score / (10 - timeLeft)).toFixed(1)} taps/sec` : ""}
              </div>
            </div>

            {/* Giant Tap Area */}
            <div 
              className="w-80 h-80 mx-auto bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-full flex items-center justify-center cursor-pointer select-none transition-all active:scale-95 shadow-2xl shadow-red-500/30"
              onClick={handleTap}
              onTouchStart={handleTap}
            >
              <div className="text-6xl font-bold text-white animate-pulse">
                TAP!
              </div>
            </div>
            
            <div className="mt-6 text-gray-400 text-sm">
              Tap anywhere on the circle as fast as you can!
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center">
            <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">🏁 Game Over!</h2>
              
              {gameMode === "solo" ? (
                <div>
                  <div className="text-6xl font-bold text-red-400 mb-2">{score}</div>
                  <div className="text-xl text-gray-300 mb-4">total taps</div>
                  <div className="text-lg text-yellow-400 mb-4">
                    {(score / 10).toFixed(2)} taps per second
                  </div>
                  <div className="text-lg text-orange-400 mb-6">
                    {getTapMessage(score / 10)}
                  </div>
                  {score === highScore && score > 0 && (
                    <div className="text-yellow-400 text-lg mb-4">
                      🎊 New High Score! 🎊
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-yellow-400 mb-6">
                    🏆 {getMultiplayerWinner().name} Wins!
                  </div>
                  <div className="space-y-3">
                    {players
                      .sort((a, b) => (b.result?.score || 0) - (a.result?.score || 0))
                      .map((player, index) => (
                      <div 
                        key={index}
                        className={`flex justify-between items-center p-3 rounded-lg ${
                          index === 0 
                            ? 'bg-yellow-500/20 border border-yellow-500/30' 
                            : 'bg-white/5'
                        }`}
                      >
                        <span className="font-semibold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {player.name}
                        </span>
                        <div className="text-right">
                          <div className="font-bold">{player.result?.score || 0} taps</div>
                          <div className="text-sm text-gray-400">
                            {player.result?.tapsPerSecond || 0} tps
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Play Again
              </button>
              <Link
                href="/"
                className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Back to Games
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}