"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function PatternMemory() {
  const [gameState, setGameState] = useState<"setup" | "showing" | "input" | "correct" | "wrong" | "finished">("setup");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [funnyAnimation, setFunnyAnimation] = useState<"shake" | "spin" | "pulse" | "rainbow" | "">("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('pattern-memory-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const funnyMessages = [
    "Bruh... 🤦‍♂️",
    "Not even close! 😅",
    "Were you even watching? 👀",
    "That was... creative 🎨",
    "Maybe try decaf? ☕",
    "Your brain said 'nah' 🧠",
    "Plot twist: That wasn't it! 📚",
    "Houston, we have a problem 🚀",
    "Error 404: Pattern not found 💻",
    "Did you blink? 😴",
    "That's not how this works! 🤷‍♂️",
    "Close! (Not really) 🎯",
    "The squares are laughing at you 😂",
    "Try using your other brain cell 🧠",
    "That was... ambitious 🎪"
  ];

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setSequence([]);
    setPlayerInput([]);
    setGameState("setup");
    startLevel();
  };

  const startLevel = () => {
    // Create sequence for this level (level determines length)
    const newSequence: number[] = [];
    for (let i = 0; i < level + 2; i++) { // Start with 3, then 4, 5, etc.
      newSequence.push(Math.floor(Math.random() * 9));
    }
    
    setSequence(newSequence);
    setPlayerInput([]);
    setShowingIndex(-1);
    
    setTimeout(() => {
      showSequence(newSequence);
    }, 1000);
  };

  const showSequence = (sequenceToShow: number[]) => {
    setGameState("showing");
    setShowingIndex(-1);
    
    const showNextSquare = (index: number) => {
      if (index >= sequenceToShow.length) {
        // Done showing, now player's turn
        setShowingIndex(-1);
        setGameState("input");
        return;
      }
      
      setShowingIndex(sequenceToShow[index]);
      
      timeoutRef.current = setTimeout(() => {
        setShowingIndex(-1);
        setTimeout(() => showNextSquare(index + 1), 200);
      }, 800);
    };
    
    setTimeout(() => showNextSquare(0), 500);
  };

  const handleSquareClick = (squareIndex: number) => {
    if (gameState !== "input" || isAnimating) return;
    
    const newInput = [...playerInput, squareIndex];
    setPlayerInput(newInput);
    
    // Check if this click is correct
    const currentIndex = newInput.length - 1;
    if (sequence[currentIndex] !== squareIndex) {
      // Wrong! Show funny animation
      handleWrongAnswer();
      return;
    }
    
    // Check if sequence is complete
    if (newInput.length === sequence.length) {
      // Correct! Level completed
      handleCorrectSequence();
    }
  };

  const handleWrongAnswer = () => {
    setGameState("wrong");
    setIsAnimating(true);
    
    // Random funny animation
    const animations = ["shake", "spin", "pulse", "rainbow"];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)] as typeof funnyAnimation;
    setFunnyAnimation(randomAnimation);
    
    // Show animation for 2 seconds
    setTimeout(() => {
      setFunnyAnimation("");
      setIsAnimating(false);
      
      // Show correct sequence
      setTimeout(() => {
        showCorrectSequence();
      }, 1000);
    }, 2000);
  };

  const showCorrectSequence = () => {
    setGameState("showing");
    setPlayerInput([]);
    
    // Show each square in the correct sequence with a different color
    let index = 0;
    const showCorrectNext = () => {
      if (index >= sequence.length) {
        setTimeout(() => {
          setGameState("finished");
        }, 1000);
        return;
      }
      
      setShowingIndex(sequence[index]);
      setTimeout(() => {
        setShowingIndex(-1);
        index++;
        setTimeout(showCorrectNext, 300);
      }, 600);
    };
    
    showCorrectNext();
  };

  const handleCorrectSequence = () => {
    const newScore = score + (level * 10);
    setScore(newScore);
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('pattern-memory-highscore', newScore.toString());
    }
    
    setGameState("correct");
    
    setTimeout(() => {
      setLevel(prev => prev + 1);
      startLevel();
    }, 2000);
  };

  const resetGame = () => {
    setGameState("setup");
    setSequence([]);
    setPlayerInput([]);
    setLevel(1);
    setScore(0);
    setShowingIndex(-1);
    setIsAnimating(false);
    setFunnyAnimation("");
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getSquareClass = (index: number) => {
    let baseClass = "w-20 h-20 rounded-xl transition-all duration-300 transform flex items-center justify-center text-2xl font-bold ";
    
    if (funnyAnimation === "shake") {
      baseClass += "animate-bounce ";
    } else if (funnyAnimation === "spin") {
      baseClass += "animate-spin ";
    } else if (funnyAnimation === "pulse") {
      baseClass += "animate-pulse scale-110 ";
    } else if (funnyAnimation === "rainbow") {
      baseClass += "animate-pulse ";
    }
    
    if (showingIndex === index && gameState === "showing") {
      baseClass += "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-lg shadow-yellow-500/50 scale-110 ";
    } else if (playerInput.includes(index)) {
      baseClass += "bg-green-500 border-green-300 ";
    } else {
      baseClass += "bg-white/10 hover:bg-white/20 border-white/20 hover:scale-105 ";
    }
    
    baseClass += "border-2 cursor-pointer ";
    
    if (funnyAnimation === "rainbow") {
      baseClass += "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 ";
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🧩 Pattern Memory
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Watch the squares light up, then repeat the pattern! 
            Each level gets longer. How far can your brain go? 🧠✨
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{score}</div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{level}</div>
            <div className="text-sm text-gray-400">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
            <div className="text-sm text-gray-400">High Score</div>
          </div>
        </div>

        {gameState === "setup" && (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-6">Ready to Test Your Memory?</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                • Watch the squares light up in order
                <br />
                • Click them back in the same sequence
                <br />
                • Each level adds more squares
                <br />
                • Don't blink! 👁️
              </p>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Status Messages */}
        {gameState === "showing" && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Level {level}</h2>
            <p className="text-lg text-gray-300">Watch carefully! 👀</p>
            <p className="text-sm text-gray-400">Sequence length: {sequence.length}</p>
          </div>
        )}

        {gameState === "input" && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Turn!</h2>
            <p className="text-lg text-gray-300">Repeat the pattern</p>
            <p className="text-sm text-gray-400">
              Progress: {playerInput.length} / {sequence.length}
            </p>
          </div>
        )}

        {gameState === "correct" && (
          <div className="text-center mb-6">
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 Correct!</h2>
              <p className="text-gray-300">Level {level} completed!</p>
              <p className="text-sm text-gray-400">+{level * 10} points</p>
            </div>
          </div>
        )}

        {gameState === "wrong" && (
          <div className="text-center mb-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-red-400 mb-2">
                {funnyMessages[Math.floor(Math.random() * funnyMessages.length)]}
              </h2>
              <p className="text-gray-300">Watch the correct sequence...</p>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <p className="text-lg text-purple-400 font-bold">Final Score: {score}</p>
              <p className="text-sm text-gray-300">Made it to level {level}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 text-sm mt-2">🎊 New High Score! 🎊</p>
              )}
            </div>
          </div>
        )}

        {/* 3x3 Grid */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-3 gap-3 p-6 bg-white/5 rounded-2xl border border-white/10">
            {Array.from({ length: 9 }, (_, index) => (
              <div
                key={index}
                className={getSquareClass(index)}
                onClick={() => handleSquareClick(index)}
              >
                {showingIndex === index && gameState === "showing" ? "✨" : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="text-center space-x-4">
          {gameState === "finished" && (
            <>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Play Again
              </button>
              <Link
                href="/"
                className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Back to Games
              </Link>
            </>
          )}
          
          {gameState !== "setup" && gameState !== "finished" && (
            <button
              onClick={resetGame}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-bold py-2 px-4 rounded-lg transition-all"
            >
              Reset Game
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>💡 Pro tip: Focus on the center and use your peripheral vision!</p>
        </div>
      </div>
    </div>
  );
}