"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface Player {
  id: number;
  name: string;
  isEliminated: boolean;
}

const SEQUENCE_ITEMS = [
  { emoji: "🍕", word: "Pizza" },
  { emoji: "🌮", word: "Taco" },
  { emoji: "🍔", word: "Burger" },
  { emoji: "🍟", word: "Fries" },
  { emoji: "🍦", word: "Ice Cream" },
  { emoji: "🍪", word: "Cookie" },
  { emoji: "🎮", word: "Gaming" },
  { emoji: "🎵", word: "Music" },
  { emoji: "🌈", word: "Rainbow" },
  { emoji: "🦄", word: "Unicorn" },
  { emoji: "🍄", word: "Mushroom" },
  { emoji: "🌊", word: "Wave" },
  { emoji: "⭐", word: "Star" },
  { emoji: "🔥", word: "Fire" },
  { emoji: "💎", word: "Diamond" },
  { emoji: "🚀", word: "Rocket" },
  { emoji: "👾", word: "Alien" },
  { emoji: "🦋", word: "Butterfly" },
  { emoji: "🌺", word: "Flower" },
  { emoji: "🎪", word: "Circus" }
];

export default function MemoryChain() {
  const [gameState, setGameState] = useState<"setup" | "showing" | "input" | "correct" | "wrong" | "finished">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [sequence, setSequence] = useState<typeof SEQUENCE_ITEMS[0][]>([]);
  const [showingIndex, setShowingIndex] = useState(0);
  const [playerInput, setPlayerInput] = useState<typeof SEQUENCE_ITEMS[0][]>([]);
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializePlayers = (count: number) => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        isEliminated: false
      });
    }
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
  };

  const startGame = (playerCount: number) => {
    initializePlayers(playerCount);
    setRound(1);
    setSequence([]);
    startRound();
  };

  const startRound = () => {
    // Add new random item to sequence
    const randomItem = SEQUENCE_ITEMS[Math.floor(Math.random() * SEQUENCE_ITEMS.length)];
    const newSequence = [...sequence, randomItem];
    setSequence(newSequence);
    setPlayerInput([]);
    
    // Find next active player
    const activePlayers = players.filter(p => !p.isEliminated);
    if (activePlayers.length <= 1) {
      endGame();
      return;
    }
    
    let nextPlayerIndex = currentPlayerIndex;
    do {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    } while (players[nextPlayerIndex].isEliminated);
    
    setCurrentPlayerIndex(nextPlayerIndex);
    
    // Show sequence
    showSequence(newSequence);
  };

  const showSequence = (sequenceToShow: typeof SEQUENCE_ITEMS[0][]) => {
    setGameState("showing");
    setShowingIndex(0);
    
    const showNextItem = (index: number) => {
      if (index >= sequenceToShow.length) {
        // Done showing, now player's turn
        setGameState("input");
        return;
      }
      
      setShowingIndex(index);
      timeoutRef.current = setTimeout(() => {
        showNextItem(index + 1);
      }, 1500); // Show each item for 1.5 seconds
    };
    
    showNextItem(0);
  };

  const handleItemSelect = (item: typeof SEQUENCE_ITEMS[0]) => {
    if (gameState !== "input") return;
    
    const newInput = [...playerInput, item];
    setPlayerInput(newInput);
    
    // Check if this input is correct so far
    const currentIndex = newInput.length - 1;
    if (sequence[currentIndex].emoji !== item.emoji) {
      // Wrong! Player is eliminated
      eliminateCurrentPlayer();
      return;
    }
    
    // Check if sequence is complete
    if (newInput.length === sequence.length) {
      // Correct! Move to next round
      setGameState("correct");
      setTimeout(() => {
        setRound(prev => prev + 1);
        startRound();
      }, 2000);
    }
  };

  const eliminateCurrentPlayer = () => {
    setPlayers(prev => prev.map((p, index) => 
      index === currentPlayerIndex ? { ...p, isEliminated: true } : p
    ));
    
    setGameState("wrong");
    
    setTimeout(() => {
      const remainingPlayers = players.filter(p => !p.isEliminated);
      // Don't count the player we just eliminated
      const actualRemaining = remainingPlayers.length - 1;
      
      if (actualRemaining <= 1) {
        endGame();
      } else {
        startRound();
      }
    }, 2000);
  };

  const endGame = () => {
    const remainingPlayers = players.filter(p => !p.isEliminated);
    setWinner(remainingPlayers[0] || null);
    setGameState("finished");
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setSequence([]);
    setPlayerInput([]);
    setCurrentPlayerIndex(0);
    setRound(1);
    setWinner(null);
    setShowingIndex(0);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🧠 Memory Chain
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Watch the sequence, then repeat it back! Each round adds one more item. 
            Perfect for testing your... enhanced memory! 😏
          </p>
        </div>

        {gameState === "setup" && (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to Test Your Memory?</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                • Watch the sequence carefully
                <br />
                • Repeat it in the same order
                <br />
                • Each round gets one item longer
                <br />
                • Last player standing wins!
              </p>
              <div className="space-y-2">
                {[2, 3, 4, 5, 6].map(count => (
                  <button
                    key={count}
                    onClick={() => startGame(count)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                  >
                    {count} Players
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "showing" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Round {round}</h2>
            <p className="text-lg text-gray-300 mb-2">
              {getCurrentPlayer()?.name}'s turn - Watch the sequence!
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Sequence length: {sequence.length}
            </p>
            
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-12">
              {showingIndex < sequence.length && (
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-pulse">
                    {sequence[showingIndex].emoji}
                  </div>
                  <div className="text-2xl font-bold">
                    {sequence[showingIndex].word}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-center space-x-2">
              {sequence.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= showingIndex ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {gameState === "input" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Round {round}</h2>
            <p className="text-lg text-gray-300 mb-2">
              {getCurrentPlayer()?.name}'s turn - Repeat the sequence!
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Progress: {playerInput.length} / {sequence.length}
            </p>
            
            {playerInput.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Your sequence so far:</p>
                <div className="flex justify-center space-x-2 flex-wrap">
                  {playerInput.map((item, index) => (
                    <div key={index} className="text-2xl">{item.emoji}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
              {SEQUENCE_ITEMS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemSelect(item)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-xs">{item.word}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === "correct" && (
          <div className="text-center">
            <div className="max-w-md mx-auto bg-green-500/20 border border-green-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-green-400">🎉 Correct!</h2>
              <p className="text-lg">
                {getCurrentPlayer()?.name} got it right!
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Moving to round {round + 1}...
              </p>
            </div>
          </div>
        )}

        {gameState === "wrong" && (
          <div className="text-center">
            <div className="max-w-md mx-auto bg-red-500/20 border border-red-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-red-400">❌ Wrong!</h2>
              <p className="text-lg">
                {getCurrentPlayer()?.name} is eliminated!
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Better luck next time...
              </p>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center">
            <div className="max-w-md mx-auto bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-4">🏆 Game Over!</h2>
              {winner ? (
                <>
                  <p className="text-2xl font-bold text-yellow-400 mb-2">
                    {winner.name} Wins!
                  </p>
                  <p className="text-gray-300">
                    Survived {round - 1} rounds!
                  </p>
                </>
              ) : (
                <p className="text-xl text-gray-300">No winner!</p>
              )}
            </div>
            
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
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

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-400">
            <p className="mb-2">Players still in the game:</p>
            <div className="flex justify-center space-x-4 flex-wrap">
              {players.map(player => (
                <span
                  key={player.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    player.isEliminated 
                      ? 'bg-red-500/20 text-red-300 line-through' 
                      : player.id === currentPlayerIndex 
                        ? 'bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400' 
                        : 'bg-white/10 text-white'
                  }`}
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}