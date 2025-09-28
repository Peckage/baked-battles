"use client";

import Link from "next/link";
import { useState } from "react";

const TRUTHS = [
  // Light & Fun
  "What's the weirdest food combination you actually enjoy?",
  "What's your most embarrassing autocorrect fail?",
  "What's the strangest thing you've ever googled?",
  "What's your worst habit that you're aware of?",
  "What's the most childish thing you still do?",
  "What's your guilty pleasure TV show or movie?",
  "What's the dumbest way you've hurt yourself?",
  "What's your most irrational fear?",
  "What's the weirdest dream you remember?",
  "What's something you're way too old to be doing but still do?",
  
  // Social & Relationships
  "Who was your first celebrity crush?",
  "What's the most embarrassing thing you've done in front of a crush?",
  "What's your biggest dating red flag?",
  "What's the worst pickup line you've ever used or heard?",
  "What's your most awkward social interaction?",
  "What's something you've lied about to seem cooler?",
  "What's your most embarrassing text you've sent to the wrong person?",
  "Who in this room would you want to be stranded on an island with?",
  "What's your biggest pet peeve about people?",
  "What's the most ridiculous argument you've had?",
  
  // Personal & Funny
  "What's your most useless talent?",
  "What's the longest you've gone without showering?",
  "What's your weirdest habit when you're alone?",
  "What's something you believed for way too long that wasn't true?",
  "What's your most embarrassing moment from childhood?",
  "What's your secret obsession?",
  "What's the weirdest thing in your search history?",
  "What's your biggest fear about the future?",
  "What's something you pretend to understand but totally don't?",
  "What's your most unpopular opinion?",
  
  // Stoner-Friendly
  "What's the weirdest late-night snack creation you've made?",
  "What's the deepest thought you've ever had about something totally random?",
  "What cartoon character do you relate to most and why?",
  "What's the longest you've spent watching something totally pointless?",
  "What's your weirdest conspiracy theory?",
  "What movie blew your mind the most?",
  "What's the strangest thing that's made you laugh uncontrollably?",
  "What's your favorite weird fact that you know?",
  "What's the most random thing you've spent hours researching?",
  "What's your theory about what happens after we die?"
];

const DARES = [
  // Silly Performance
  "Do your best impression of a celebrity for 30 seconds",
  "Sing 'Happy Birthday' in the style of your favorite music genre",
  "Act out your favorite movie scene without talking",
  "Do your best dance move for 30 seconds",
  "Speak in an accent of your choice for the next 3 rounds",
  "Tell a joke in the most serious way possible",
  "Do 10 jumping jacks while reciting the alphabet backwards",
  "Pretend to be a news anchor reporting on something ridiculous happening in the room",
  "Do your best animal impression and let everyone guess what it is",
  "Demonstrate how you would teach someone to do something simple, like tying shoes",
  
  // Social & Interactive  
  "Give everyone in the room a compliment",
  "Let someone else post a photo on your social media",
  "Call a pizza place and ask if they deliver to your current emotional state",
  "Text your mom/dad something weird but innocent",
  "Do an interpretive dance of your morning routine",
  "Let the group go through your photos and pick one to post",
  "Record a 30-second commercial for something random in the room",
  "Create a secret handshake with the person to your left",
  "Sing everything you say for the next 5 minutes",
  "Switch clothes with someone for the next 2 rounds",
  
  // Creative & Weird
  "Draw a portrait of someone in the room with your non-dominant hand",
  "Make up a song about the person to your right",
  "Create a fashion show using only items from this room",
  "Tell the story of how you woke up this morning but make it sound epic",
  "Do your best cooking show demonstration using imaginary ingredients",
  "Pretend you're a sports commentator narrating someone doing a simple task",
  "Make up a commercial jingle for a weird product",
  "Act out a scene from a romantic movie with an inanimate object",
  "Give a motivational speech about something completely random",
  "Pretend to be a tour guide giving a tour of the room you're in",
  
  // Stoner-Friendly
  "Explain your favorite conspiracy theory like you're teaching a kindergarten class",
  "Demonstrate what you think different animals would look like doing yoga",
  "Create a dramatic interpretation of making a sandwich",
  "Pretend to be a nature documentary narrator describing everyone in the room",
  "Make up a bedtime story about inanimate objects in the room coming to life",
  "Do your impression of how different age groups would react to seeing a magic trick",
  "Act out what you think your pet (or ideal pet) does when you're not home",
  "Recreate a scene from a kids' movie but make all the characters really dramatic",
  "Pretend to give a TED talk about the philosophical importance of snacks",
  "Do your best impression of how you think aliens would react to human behavior"
];

interface Player {
  id: number;
  name: string;
  truths: number;
  dares: number;
}

export default function TruthOrDare() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "results">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState("");
  const [challengeType, setChallengeType] = useState<"truth" | "dare">("truth");
  const [usedTruths, setUsedTruths] = useState<string[]>([]);
  const [usedDares, setUsedDares] = useState<string[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const maxRounds = 20;
  const [isChoosingType, setIsChoosingType] = useState(true);

  const initializePlayers = (count: number) => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        truths: 0,
        dares: 0
      });
    }
    setPlayers(newPlayers);
  };

  const startGame = (playerCount: number) => {
    initializePlayers(playerCount);
    setCurrentPlayerIndex(0);
    setRoundNumber(1);
    setUsedTruths([]);
    setUsedDares([]);
    setGameState("playing");
    setIsChoosingType(true);
  };

  const chooseType = (type: "truth" | "dare") => {
    setChallengeType(type);
    setIsChoosingType(false);
    generateChallenge(type);
  };

  const generateChallenge = (type: "truth" | "dare") => {
    const isTrue = type === "truth";
    const pool = isTrue ? TRUTHS : DARES;
    const used = isTrue ? usedTruths : usedDares;
    
    // Get available challenges
    const available = pool.filter(item => !used.includes(item));
    
    if (available.length === 0) {
      // Reset used pool if we've used everything
      if (isTrue) {
        setUsedTruths([]);
      } else {
        setUsedDares([]);
      }
      setCurrentChallenge(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      const randomChallenge = available[Math.floor(Math.random() * available.length)];
      setCurrentChallenge(randomChallenge);
      
      // Add to used
      if (isTrue) {
        setUsedTruths(prev => [...prev, randomChallenge]);
      } else {
        setUsedDares(prev => [...prev, randomChallenge]);
      }
    }

    // Update player stats
    setPlayers(prev => prev.map((p, i) => 
      i === currentPlayerIndex 
        ? { ...p, [isTrue ? 'truths' : 'dares']: p[isTrue ? 'truths' : 'dares'] + 1 }
        : p
    ));
  };

  const nextPlayer = () => {
    if (roundNumber >= maxRounds) {
      endGame();
      return;
    }

    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    
    if (nextIndex === 0) {
      setRoundNumber(prev => prev + 1);
    }
    
    setIsChoosingType(true);
    setCurrentChallenge("");
  };

  const endGame = () => {
    setGameState("results");
  };

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentChallenge("");
    setUsedTruths([]);
    setUsedDares([]);
    setRoundNumber(1);
    setIsChoosingType(true);
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const getBravestPlayer = () => {
    return players.reduce((prev, current) => 
      current.dares > prev.dares ? current : prev
    );
  };

  const getMostHonestPlayer = () => {
    return players.reduce((prev, current) => 
      current.truths > prev.truths ? current : prev
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎭 Truth or Dare
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The classic party game with stoner-friendly questions and dares! 
            Get to know your friends... maybe too well! 😏
          </p>
        </div>

        {gameState === "setup" && (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Start the Fun!</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Number of Players</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4, 5, 6, 7, 8].map(count => (
                    <button
                      key={count}
                      onClick={() => startGame(count)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                Game will run for about {maxRounds} rounds
              </p>
            </div>
          </div>
        )}

        {gameState === "playing" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-2">
                Round {roundNumber} • {getCurrentPlayer()?.name}'s Turn
              </div>
              <div className="text-lg font-semibold">
                Player {currentPlayerIndex + 1}: {getCurrentPlayer()?.name}
              </div>
            </div>

            {isChoosingType && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-8">
                  {getCurrentPlayer()?.name}, what will it be?
                </h2>
                
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  <button
                    onClick={() => chooseType("truth")}
                    className="bg-gradient-to-br from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-8 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
                  >
                    <div className="text-4xl mb-2">🤔</div>
                    <div className="text-xl font-bold">TRUTH</div>
                    <div className="text-sm opacity-75">Answer honestly</div>
                  </button>
                  
                  <button
                    onClick={() => chooseType("dare")}
                    className="bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-8 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-red-500/25"
                  >
                    <div className="text-4xl mb-2">😈</div>
                    <div className="text-xl font-bold">DARE</div>
                    <div className="text-sm opacity-75">Take the challenge</div>
                  </button>
                </div>
              </div>
            )}

            {!isChoosingType && (
              <div className="text-center">
                <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 ${
                  challengeType === "truth" 
                    ? "border-2 border-blue-400/50" 
                    : "border-2 border-red-400/50"
                }`}>
                  <div className="text-sm uppercase tracking-wide font-semibold mb-4">
                    <span className={challengeType === "truth" ? "text-blue-400" : "text-red-400"}>
                      {challengeType === "truth" ? "🤔 TRUTH" : "😈 DARE"}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 leading-relaxed">
                    {currentChallenge}
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-300">
                    {challengeType === "truth" 
                      ? "Time to spill the tea! ☕" 
                      : "Show us what you're made of! 💪"
                    }
                  </p>
                  
                  <button
                    onClick={nextPlayer}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
                  >
                    {roundNumber >= maxRounds ? "Finish Game" : "Next Player"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === "results" && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">🏁 Game Complete!</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-blue-400 font-bold text-lg">Most Honest 🤔</div>
                    <div className="font-semibold">{getMostHonestPlayer().name}</div>
                    <div className="text-sm text-gray-400">
                      {getMostHonestPlayer().truths} truths
                    </div>
                  </div>
                  
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-400 font-bold text-lg">Bravest 😈</div>
                    <div className="font-semibold">{getBravestPlayer().name}</div>
                    <div className="text-sm text-gray-400">
                      {getBravestPlayer().dares} dares
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Final Stats:</h3>
                  {players.map((player, index) => (
                    <div 
                      key={player.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                    >
                      <span className="font-semibold">
                        {index + 1}. {player.name}
                      </span>
                      <div className="text-right text-sm">
                        <div>🤔 {player.truths} truths</div>
                        <div>😈 {player.dares} dares</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
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

        {gameState === "playing" && (
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400">
              <p className="mb-2">Game Progress:</p>
              <div className="flex justify-center space-x-4 flex-wrap">
                {players.map((player, index) => (
                  <span
                    key={player.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      index === currentPlayerIndex
                        ? 'bg-purple-500/20 text-purple-300 ring-2 ring-purple-400' 
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {player.name}: 🤔{player.truths} 😈{player.dares}
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