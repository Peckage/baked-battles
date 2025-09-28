"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Touch {
  id: number;
  x: number;
  y: number;
  playerId: number;
  isChosen: boolean;
  playerName: string;
  color: string;
}

export default function FingerOnScreen() {
  const [gameState, setGameState] = useState<"setup" | "waiting" | "choosing" | "result">("setup");
  const [touches, setTouches] = useState<Touch[]>([]);
  const [chosenPlayer, setChosenPlayer] = useState<Touch | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(true); // Toggle between live and manual mode
  const [autoCountdownStarted, setAutoCountdownStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const liveCountdownRef = useRef<NodeJS.Timeout | null>(null);

  const colors = [
    "#10b981", // emerald
    "#06d6a0", // teal  
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // cyan
    "#f97316", // orange
    "#22c55e", // green
    "#3b82f6", // blue
  ];

  // Auto-selection countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            // Call chooseRandomPlayer inline to avoid dependency issues
            if (touches.length >= 2) {
              setGameState("choosing");
              setCountdown(null);
              
              // Dramatic effect - flash all fingers multiple times
              let flashCount = 0;
              const flashInterval = setInterval(() => {
                setTouches(prevTouches => prevTouches.map(touch => ({
                  ...touch,
                  isChosen: flashCount % 2 === 0
                })));
                
                flashCount++;
                if (flashCount >= 8) { // Flash 4 times (on/off)
                  clearInterval(flashInterval);
                  
                  // Select the winner
                  setTimeout(() => {
                    setTouches(prevTouches => {
                      const randomIndex = Math.floor(Math.random() * prevTouches.length);
                      const chosen = prevTouches[randomIndex];
                      
                      setChosenPlayer(chosen);
                      setGameState("result");
                      
                      return prevTouches.map(touch => ({
                        ...touch,
                        isChosen: touch.id === chosen.id
                      }));
                    });
                  }, 500);
                }
              }, 200);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown, touches.length]);

  // Live mode auto-countdown trigger
  useEffect(() => {
    if (isLiveMode && gameState === "waiting" && touches.length >= 2 && !autoCountdownStarted && countdown === null) {
      // Clear any existing timeout
      if (liveCountdownRef.current) {
        clearTimeout(liveCountdownRef.current);
      }
      
      // Start auto-countdown after 1 second delay to prevent immediate triggers
      liveCountdownRef.current = setTimeout(() => {
        if (touches.length >= 2 && gameState === "waiting") {
          setAutoCountdownStarted(true);
          setCountdown(3);
        }
      }, 1000);
    }
    
    // Clear countdown if not enough players in live mode
    if (isLiveMode && touches.length < 2) {
      setAutoCountdownStarted(false);
      if (liveCountdownRef.current) {
        clearTimeout(liveCountdownRef.current);
        liveCountdownRef.current = null;
      }
      if (countdown !== null && gameState === "waiting") {
        setCountdown(null);
      }
    }

    return () => {
      if (liveCountdownRef.current) {
        clearTimeout(liveCountdownRef.current);
      }
    };
  }, [isLiveMode, touches.length, gameState, autoCountdownStarted, countdown]);

  const startWaiting = () => {
    setGameState("waiting");
    setTouches([]);
    setChosenPlayer(null);
    setCountdown(null);
    setAutoCountdownStarted(false);
    if (liveCountdownRef.current) {
      clearTimeout(liveCountdownRef.current);
      liveCountdownRef.current = null;
    }
  };

  const startCountdown = () => {
    if (touches.length < 2) {
      alert("Need at least 2 fingers on screen!");
      return;
    }
    setAutoCountdownStarted(true);
    setCountdown(3);
  };

  const nextRound = () => {
    setRoundNumber(prev => prev + 1);
    startWaiting();
  };

  const resetGame = () => {
    setGameState("setup");
    setTouches([]);
    setChosenPlayer(null);
    setRoundNumber(1);
  };

  // Get the next consecutive player number
  const getNextPlayerNumber = () => {
    const existingNumbers = touches.map(t => t.playerId).sort((a, b) => a - b);
    for (let i = 1; i <= existingNumbers.length + 1; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }
    return 1;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== "waiting") return;
    e.preventDefault();
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isLiveMode) {
      // Live mode: replace all touches with current active touches
      const newTouches: Touch[] = Array.from(e.touches).map((touch) => {
        const existingTouchIndex = touches.findIndex(t => t.id === touch.identifier);
        
        if (existingTouchIndex >= 0) {
          return {
            ...touches[existingTouchIndex],
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
          };
        } else {
          const nextPlayerNum = getNextPlayerNumber();
          return {
            id: touch.identifier,
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
            playerId: nextPlayerNum,
            isChosen: false,
            playerName: `Player ${nextPlayerNum}`,
            color: colors[(nextPlayerNum - 1) % colors.length]
          };
        }
      });
      setTouches(newTouches);
    } else {
      // Manual mode: add permanent spots for each new touch
      Array.from(e.touches).forEach(touch => {
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        const existingSpot = touches.find(t => 
          Math.abs(t.x - touchX) < 40 && Math.abs(t.y - touchY) < 40
        );
        
        if (!existingSpot) {
          const nextPlayerNum = getNextPlayerNumber();
          const newTouch: Touch = {
            id: touch.identifier,
            x: touchX,
            y: touchY,
            playerId: nextPlayerNum,
            isChosen: false,
            playerName: `Player ${nextPlayerNum}`,
            color: colors[(nextPlayerNum - 1) % colors.length]
          };
          setTouches(prev => [...prev, newTouch]);
        }
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== "waiting" || !isLiveMode) return;
    e.preventDefault();
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Direct movement tracking - no threshold delay
    setTouches(prev => {
      const updated = prev.map(touch => {
        const liveTouch = Array.from(e.touches).find(t => t.identifier === touch.id);
        if (liveTouch) {
          return {
            ...touch,
            x: liveTouch.clientX - rect.left,
            y: liveTouch.clientY - rect.top
          };
        }
        return touch;
      });
      
      return updated;
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== "waiting") return;
    e.preventDefault();
    
    if (isLiveMode) {
      // Live mode: remove touches that are no longer active
      const activeTouchIds = Array.from(e.touches).map(t => t.identifier);
      setTouches(prev => prev.filter(touch => activeTouchIds.includes(touch.id)));
    }
    // Manual mode: do nothing on touch end (spots remain permanent)
  };

  // Mouse events for desktop testing - different behavior for live vs manual mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (gameState !== "waiting") return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (isLiveMode) {
      // In live mode, mouse clicks simulate holding fingers (removed on mouse up)
      const nextPlayerNum = getNextPlayerNumber();
      const newTouch: Touch = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
        playerId: nextPlayerNum,
        isChosen: false,
        playerName: `Player ${nextPlayerNum}`,
        color: colors[(nextPlayerNum - 1) % colors.length]
      };

      setTouches(prev => [...prev, newTouch]);
    } else {
      // In manual mode, each click toggles a permanent spot
      const existingSpotIndex = touches.findIndex(touch => 
        Math.abs(touch.x - clickX) < 40 && Math.abs(touch.y - clickY) < 40
      );
      
      if (existingSpotIndex >= 0) {
        // Remove existing spot if clicked on it
        setTouches(prev => prev.filter((_, index) => index !== existingSpotIndex));
      } else {
        // Add new spot
        const nextPlayerNum = getNextPlayerNumber();
        const newTouch: Touch = {
          id: Date.now() + Math.random(),
          x: clickX,
          y: clickY,
          playerId: nextPlayerNum,
          isChosen: false,
          playerName: `Player ${nextPlayerNum}`,
          color: colors[(nextPlayerNum - 1) % colors.length]
        };
        
        setTouches(prev => [...prev, newTouch]);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Only remove touches in live mode when mouse is released
    if (gameState !== "waiting" || !isLiveMode) return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Remove the touch that matches this position (for live mode)
    setTouches(prev => prev.filter(touch => 
      !(Math.abs(touch.x - clickX) < 20 && Math.abs(touch.y - clickY) < 20)
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🖐️ Live Finger Roulette
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The ultimate live selection game! Everyone puts their finger on the screen at the same time, 
            then watch as one finger gets dramatically chosen for the consequence! 
            Perfect for group decisions and party games! 🎯
          </p>
        </div>

        {gameState === "setup" && (
          <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Mode</h2>
            
            {/* Mode Toggle */}
            <div className="mb-8 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className={`font-semibold ${!isLiveMode ? 'text-blue-400' : 'text-gray-400'}`}>
                  Manual Mode
                </span>
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                    isLiveMode ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      isLiveMode ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`font-semibold ${isLiveMode ? 'text-green-400' : 'text-gray-400'}`}>
                  Live Mode
                </span>
              </div>
              
              {isLiveMode ? (
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">� LIVE:</span>
                    <span>Everyone holds fingers on screen</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">⚡</span>
                    <span>Auto-countdown starts when 2+ fingers detected</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">🎯</span>
                    <span>Perfect for real group selection!</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">👆 MANUAL:</span>
                    <span>Click/tap multiple spots on screen</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">⏸️</span>
                    <span>Hit button when ready to select</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">🖱️</span>
                    <span>Great for desktop or single-person setup</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={startWaiting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 text-lg"
            >
              🚀 Start {isLiveMode ? 'Live' : 'Manual'} Round {roundNumber}
            </button>
          </div>
        )}

        {gameState === "waiting" && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-2xl font-bold mr-4">
                {isLiveMode ? '🔴 LIVE' : '👆 MANUAL'} Round {roundNumber}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isLiveMode ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {isLiveMode ? 'Live Mode' : 'Manual Mode'}
              </span>
            </div>
            
            <p className="text-lg text-gray-300 mb-6">
              {isLiveMode 
                ? "Everyone put your finger on screen and HOLD IT!" 
                : "Click or tap multiple spots on the screen!"
              }
            </p>
            
            <div className="mb-6">
              <p className="text-2xl mb-4">
                {isLiveMode ? 'Fingers held' : 'Spots placed'}: <span className="font-bold text-green-400 text-3xl">{touches.length}</span>
              </p>
              
              {isLiveMode && countdown !== null && (
                <div className="text-6xl font-bold text-red-500 animate-pulse mb-4">
                  {countdown}
                </div>
              )}
              
              {isLiveMode && touches.length >= 2 && countdown === null && !autoCountdownStarted && (
                <div className="text-xl text-yellow-400 font-bold animate-pulse">
                  Auto-countdown starting soon... Keep holding!
                </div>
              )}
              
              {!isLiveMode && countdown !== null && (
                <div className="text-6xl font-bold text-red-500 animate-pulse mb-4">
                  {countdown}
                </div>
              )}
            </div>
            
            {/* Manual mode button */}
            {!isLiveMode && touches.length >= 2 && countdown === null && (
              <div className="space-y-3">
                <button
                  onClick={startCountdown}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 text-xl animate-bounce"
                >
                  🎯 Start Selection!
                </button>
                <button
                  onClick={() => setTouches([])}
                  className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                >
                  Clear All Spots
                </button>
              </div>
            )}

            {!isLiveMode && touches.length > 0 && touches.length < 2 && (
              <button
                onClick={() => setTouches([])}
                className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Clear Spots
              </button>
            )}
            
            {/* Live mode status */}
            {isLiveMode && touches.length >= 2 && countdown !== null && (
              <div className="text-xl text-yellow-400 font-bold">
                Keep holding! Selection in {countdown}...
              </div>
            )}
            
            {touches.length < 2 && (
              <div className="space-y-2">
                <p className="text-yellow-400 text-lg">Need at least 2 players...</p>
                <p className="text-gray-400 text-sm">
                  {isLiveMode ? 'Touch and HOLD the screen below!' : 'Click multiple spots below!'}
                </p>
              </div>
            )}
          </div>
        )}

        {gameState === "choosing" && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 animate-pulse bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              🎲 CHOOSING...
            </h2>
            <p className="text-xl text-gray-300">The wheel of fate is spinning...</p>
          </div>
        )}

        {gameState === "result" && chosenPlayer && (
          <div className="text-center mb-8">
            <div className="mb-6">
              <h2 className="text-4xl font-bold mb-4 animate-bounce">
                🎯 {chosenPlayer.playerName} is chosen!
              </h2>
              <div className="text-6xl mb-4">🍻</div>
              <p className="text-xl text-gray-300 mb-6">
                Time for the consequence!
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={nextRound}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Next Round ({roundNumber + 1})
              </button>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        <div
          ref={gameAreaRef}
          className="relative w-full h-96 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden shadow-2xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ touchAction: 'none' }}
        >
          {gameState === "waiting" && touches.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">{isLiveMode ? "👇" : "🖱️"}</div>
                <p className="text-xl font-bold text-gray-300">
                  {isLiveMode 
                    ? "Touch and hold with your fingers!" 
                    : "Click to place permanent spots!"
                  }
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {isLiveMode 
                    ? "Keep them on screen until selection" 
                    : "Click spots to add/remove players"
                  }
                </p>
              </div>
            </div>
          )}

          {touches.map((touch) => (
            <div
              key={touch.id}
              className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                gameState === "choosing" 
                  ? touch.isChosen 
                    ? "animate-pulse scale-110 ring-4 ring-white/50" 
                    : "animate-pulse scale-90"
                  : touch.isChosen 
                    ? "animate-bounce scale-150 ring-8 ring-yellow-400 shadow-2xl shadow-yellow-400/50" 
                    : "hover:scale-110"
              }`}
              style={{
                left: `${touch.x - 40}px`,
                top: `${touch.y - 40}px`,
                backgroundColor: touch.isChosen && gameState === "result" 
                  ? '#f59e0b' 
                  : touch.color,
                transform: touch.isChosen && gameState === "result" 
                  ? 'scale(1.5)' 
                  : 'scale(1)',
                zIndex: touch.isChosen ? 10 : 1,
                boxShadow: touch.isChosen && gameState === "result" 
                  ? '0 0 30px rgba(245, 158, 11, 0.8)' 
                  : gameState === "choosing"
                    ? `0 0 20px ${touch.color}40`
                    : `0 0 10px ${touch.color}20`
              }}
            >
              {touch.isChosen && gameState === "result" ? "🎯" : touch.playerId}
            </div>
          ))}

          {/* Pulse effect during countdown */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-red-500/10 animate-pulse rounded-2xl" />
          )}
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-400">
            {isLiveMode ? (
              <>
                <span className="font-semibold text-green-400">🔴 Live Mode:</span> Hold real fingers on screen! 
                <span className="mx-2">•</span>
                <span className="font-semibold">Desktop:</span> Click and hold to simulate
              </>
            ) : (
              <>
                <span className="font-semibold text-blue-400">👆 Manual Mode:</span> Click/tap multiple spots
                <span className="mx-2">•</span>
                <span className="font-semibold">Mobile:</span> Tap spots, then trigger selection
              </>
            )}
          </p>
          {touches.length > 0 && (
            <div className="flex justify-center space-x-2 flex-wrap">
              {touches.map((touch) => (
                <span 
                  key={touch.id}
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: touch.color }}
                >
                  {touch.playerName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}