"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const PROMPTS = [
  // Animals & Nature
  "A cat wearing a tiny hat",
  "A tree that grows pizza instead of leaves", 
  "A fish flying through clouds",
  "A butterfly made of cheese",
  "A turtle racing a snail",
  "An elephant playing basketball",
  "A penguin at a beach party",
  "A rainbow-colored zebra",
  "A cactus giving hugs",
  "A sleepy dragon",
  
  // Food & Drinks
  "A taco riding a skateboard", 
  "A slice of pizza delivering mail",
  "A donut wearing sunglasses",
  "A banana playing guitar",
  "A hamburger at the gym",
  "An ice cream cone melting in space",
  "A hot dog in a business suit",
  "A pretzel doing yoga",
  "A cupcake having an existential crisis",
  "A bowl of cereal watching TV",
  
  // Objects & Situations
  "A lamp giving a speech",
  "A toilet paper roll superhero",
  "A clock running late for work", 
  "A book reading another book",
  "A car with wings",
  "A house on legs walking around",
  "A phone taking a selfie",
  "A shoe shopping for socks",
  "An umbrella sunbathing",
  "A pencil drawing itself",
  
  // Weird & Funny
  "Your friend as a superhero",
  "A monster brushing its teeth",
  "An alien trying to parallel park",
  "A robot having lunch",
  "A pirate cooking dinner",
  "A ninja at a coffee shop",
  "A dinosaur using a smartphone",
  "A wizard getting a haircut",
  "A ghost doing laundry",
  "A vampire at the beach",
  
  // Abstract & Creative
  "What happiness looks like",
  "The sound of purple",
  "Your biggest fear as a cartoon",
  "What your laugh would look like",
  "The feeling of being late",
  "What music tastes like",
  "Your weirdest dream",
  "The color of Wednesday",
  "What tired smells like",
  "The shape of confusion",
  
  // Stoner Favorites
  "A snack that achieved enlightenment", 
  "The universe inside a cereal bowl",
  "Time traveling backwards",
  "What your thoughts look like",
  "A cloud having deep thoughts",
  "The last cookie in the jar's perspective",
  "What Wi-Fi looks like",
  "A couch that's too comfortable",
  "The journey of a lost sock",
  "What 3 AM feels like"
];

interface Player {
  id: number;
  name: string;
  points: number;
}

export default function DrawAndGuess() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"setup" | "drawing" | "guessing" | "reveal" | "results">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [guesses, setGuesses] = useState<{playerIndex: number, guess: string}[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [roundNumber, setRoundNumber] = useState(1);
  const maxRounds = 8;
  const [usedPrompts, setUsedPrompts] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [currentGuesser, setCurrentGuesser] = useState(0);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [isCanvasFocused, setIsCanvasFocused] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string, delay: string, duration: string}>>([]);

  // Generate particles client-side to avoid hydration mismatch
  useEffect(() => {
    const generateParticles = () => {
      return Array.from({length: 20}, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${3 + Math.random() * 4}s`
      }));
    };
    setParticles(generateParticles());
  }, []);

  const initializePlayers = (count: number) => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        points: 0
      });
    }
    setPlayers(newPlayers);
  };

  const startGame = (playerCount: number) => {
    initializePlayers(playerCount);
    startNewRound();
  };

  const startNewRound = () => {
    // Get random prompt
    const availablePrompts = PROMPTS.filter(p => !usedPrompts.includes(p));
    const prompt = availablePrompts.length > 0 
      ? availablePrompts[Math.floor(Math.random() * availablePrompts.length)]
      : PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    
    if (availablePrompts.length === 0) {
      setUsedPrompts([]);
    } else {
      setUsedPrompts(prev => [...prev, prompt]);
    }

    setCurrentPrompt(prompt);
    setGameState("drawing");
    setGuesses([]);
    setTimeLeft(60);
    setTimerActive(true);
    clearCanvas();
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (gameState === "drawing") {
              setGameState("guessing");
              setCurrentGuesser(currentPlayerIndex === 0 ? 1 : 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, gameState, currentPlayerIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "drawing") return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || gameState !== "drawing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState !== "drawing" || !isCanvasFocused) return;
    
    const touch = e.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    
    // Draw initial point
    const ctx = canvasRef.current!.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = brushColor;
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || gameState !== "drawing" || !isCanvasFocused) return;
    
    const touch = e.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    const ctx = canvasRef.current!.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = brushColor;
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const submitGuess = () => {
    if (!currentGuess.trim()) return;

    const isCorrect = currentGuess.toLowerCase().includes(currentPrompt.toLowerCase().split(" ").slice(0, 2).join(" ").toLowerCase()) ||
                     currentPrompt.toLowerCase().includes(currentGuess.toLowerCase()) ||
                     currentGuess.toLowerCase() === currentPrompt.toLowerCase();

    setGuesses(prev => [...prev, {
      playerIndex: currentGuesser,
      guess: currentGuess.trim()
    }]);

    if (isCorrect) {
      // Award points
      setPlayers(prev => prev.map((p, i) => {
        if (i === currentGuesser) return { ...p, points: p.points + 3 }; // Guesser gets 3
        if (i === currentPlayerIndex) return { ...p, points: p.points + 2 }; // Drawer gets 2
        return p;
      }));
      
      setGameState("reveal");
      setTimerActive(false);
    } else {
      const nextGuesser = (currentGuesser + 1) % players.length;
      if (nextGuesser === currentPlayerIndex) {
        // Skip drawer
        setCurrentGuesser((nextGuesser + 1) % players.length);
      } else {
        setCurrentGuesser(nextGuesser);
      }
      
      // Check if everyone has guessed
      if (guesses.length + 1 >= players.length - 1) {
        setGameState("reveal");
        setTimerActive(false);
      }
    }
    
    setCurrentGuess("");
  };

  const nextRound = () => {
    if (roundNumber >= maxRounds || roundNumber >= players.length) {
      endGame();
      return;
    }

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setRoundNumber(prev => prev + 1);
    startNewRound();
  };

  const endGame = () => {
    setGameState("results");
  };

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setRoundNumber(1);
    setUsedPrompts([]);
    setGuesses([]);
    clearCanvas();
  };

  const getWinner = () => {
    return players.reduce((prev, current) => 
      current.points > prev.points ? current : prev
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            🎨 Draw & Guess Stoner
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-glow-pulse">
            The creative drawing game that'll have you in stitches! 
            Draw weird prompts and let your friends guess what masterpiece you've created! 🤣
          </p>
        </div>

        {gameState === "setup" && (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to Get Creative?</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Number of Players</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 5, 6, 7, 8].map(count => (
                    <button
                      key={count}
                      onClick={() => startGame(count)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                Each player will get to draw {Math.min(maxRounds, 8)} rounds
              </p>
            </div>
          </div>
        )}

        {gameState === "drawing" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400 mb-2">
                Round {roundNumber} • {players[currentPlayerIndex]?.name} is drawing
              </div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                "{currentPrompt}"
              </div>
              <div className="text-lg font-semibold">
                Time: {timeLeft}s ⏰
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Drawing Canvas</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Size:</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm w-6">{brushSize}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Color:</label>
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-8 h-8 rounded border-0"
                    />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Mobile focus mode toggle */}
              <div className="mb-4 text-center">
                <button
                  onClick={() => setIsCanvasFocused(!isCanvasFocused)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isCanvasFocused 
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/25" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  📱 {isCanvasFocused ? "Drawing Mode ON" : "Tap to Enable Drawing Mode"}
                </button>
                {isCanvasFocused && (
                  <p className="text-sm text-yellow-300 mt-2">
                    ✨ Drawing mode active - screen won't scroll while you draw!
                  </p>
                )}
              </div>
              
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className={`w-full border-2 rounded-lg cursor-crosshair bg-gray-900 transition-all ${
                  isCanvasFocused 
                    ? "border-green-400 shadow-lg shadow-green-400/25" 
                    : "border-white/20 hover:border-white/40"
                }`}
                style={{ touchAction: isCanvasFocused ? 'none' : 'auto' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Draw your interpretation of the prompt! Others will guess what it is.
              </p>
              {timeLeft === 0 && (
                <button
                  onClick={() => setGameState("guessing")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
                >
                  Time's Up! Start Guessing
                </button>
              )}
            </div>
          </div>
        )}

        {gameState === "guessing" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-2">
                Round {roundNumber} • Guessing Time!
              </div>
              <div className="text-lg font-semibold mb-4">
                {players[currentGuesser]?.name}'s turn to guess
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-center">What did {players[currentPlayerIndex]?.name} draw?</h3>
              
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full border border-white/20 rounded-lg bg-gray-900"
              />
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                  placeholder="What is it?"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                />
                <button
                  onClick={submitGuess}
                  disabled={!currentGuess.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Guess!
                </button>
              </div>

              {guesses.length > 0 && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Previous Guesses:</h4>
                  {guesses.map((guess, index) => (
                    <div key={index} className="text-sm text-gray-300 mb-1">
                      {players[guess.playerIndex]?.name}: "{guess.guess}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === "reveal" && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">🎉 Round Complete!</h2>
              
              <div className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                The prompt was: "{currentPrompt}"
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full border border-white/20 rounded-lg bg-gray-900 mb-6"
              />

              <div className="space-y-4">
                <h3 className="text-xl font-bold">All Guesses:</h3>
                {guesses.map((guess, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      guess.guess.toLowerCase().includes(currentPrompt.toLowerCase().split(" ").slice(0, 2).join(" ").toLowerCase()) ||
                      currentPrompt.toLowerCase().includes(guess.guess.toLowerCase())
                        ? "bg-green-500/20 border border-green-500/30" 
                        : "bg-white/10"
                    }`}
                  >
                    <span className="font-semibold">{players[guess.playerIndex]?.name}:</span> "{guess.guess}"
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={nextRound}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
            >
              {roundNumber >= maxRounds ? "Finish Game" : "Next Round"}
            </button>
          </div>
        )}

        {gameState === "results" && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">🏆 Game Complete!</h2>
              
              <div className="mb-6">
                <div className="text-2xl font-bold text-yellow-400 mb-2">Winner!</div>
                <div className="text-3xl font-bold">{getWinner().name}</div>
                <div className="text-xl text-gray-300">{getWinner().points} points</div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Final Scores:</h3>
                {players
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => (
                    <div 
                      key={player.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-white/5'
                      }`}
                    >
                      <span className="font-semibold">
                        {index + 1}. {player.name}
                      </span>
                      <span className="text-lg font-bold">
                        {player.points} points
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
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

        {(gameState === "drawing" || gameState === "guessing") && (
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400">
              <p className="mb-2">Scoreboard:</p>
              <div className="flex justify-center space-x-4 flex-wrap">
                {players.map((player) => (
                  <span
                    key={player.id}
                    className="px-3 py-1 rounded-full text-sm bg-white/10 text-white"
                  >
                    {player.name}: {player.points}pts
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}