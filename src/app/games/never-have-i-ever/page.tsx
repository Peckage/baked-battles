"use client";

import Link from "next/link";
import { useState } from "react";

const NEVER_HAVE_I_EVER_STATEMENTS = [
  // Funny & Light
  "Never have I ever sung in the shower",
  "Never have I ever eaten pizza for breakfast",
  "Never have I ever talked to my pet like it's a person",
  "Never have I ever worn socks with sandals",
  "Never have I ever binged an entire TV series in one day",
  "Never have I ever pretended to know a song I've never heard",
  "Never have I ever googled myself",
  "Never have I ever eaten something off the floor (5-second rule)",
  "Never have I ever forgotten someone's name immediately after meeting them",
  "Never have I ever had a crush on a cartoon character",
  
  // Food & Drinks
  "Never have I ever eaten an entire bag/box of something in one sitting",
  "Never have I ever put pineapple on pizza",
  "Never have I ever drunk milk straight from the carton",
  "Never have I ever eaten cereal for dinner",
  "Never have I ever ordered delivery when I already had food at home",
  "Never have I ever eaten dessert before dinner",
  "Never have I ever made a weird food combination that actually tasted good",
  "Never have I ever forgotten I was cooking something until I smelled it burning",
  
  // Technology & Social Media
  "Never have I ever stalked someone's social media for hours",
  "Never have I ever posted something and immediately regretted it",
  "Never have I ever pretended my phone was dead to avoid someone",
  "Never have I ever taken more than 20 photos to get the perfect selfie",
  "Never have I ever googled something really obvious",
  "Never have I ever fallen asleep watching Netflix and woken up 3 seasons later",
  "Never have I ever accidentally liked someone's old photo while stalking",
  "Never have I ever sent a text to the wrong person",
  
  // Embarrassing Moments
  "Never have I ever waved back at someone who wasn't waving at me",
  "Never have I ever walked into a glass door or window",
  "Never have I ever called a teacher 'mom' or 'dad' by accident",
  "Never have I ever pretended to understand something I had no clue about",
  "Never have I ever laughed at something I didn't find funny just to fit in",
  "Never have I ever gotten lost in a store and couldn't find the exit",
  "Never have I ever tripped over nothing and looked around to see if anyone saw",
  "Never have I ever answered the phone in a weird voice by accident",
  
  // Weird Habits
  "Never have I ever smelled something bad and then smelled it again",
  "Never have I ever practiced fake conversations in my head",
  "Never have I ever made weird faces at myself in the mirror",
  "Never have I ever created a fake scenario in my head and got emotional about it",
  "Never have I ever pretended to work when my boss walked by",
  "Never have I ever had a full conversation with myself out loud",
  "Never have I ever made up a song about what I'm doing",
  "Never have I ever danced when I thought no one was watching",
  
  // Stoner-Friendly (Light)
  "Never have I ever watched the same movie multiple times and noticed something new each time",
  "Never have I ever gotten way too excited about snack food",
  "Never have I ever spent an hour watching random YouTube videos",
  "Never have I ever had a deep conversation about something totally random",
  "Never have I ever laughed at my own joke for way too long",
  "Never have I ever gotten lost in my own neighborhood",
  "Never have I ever stared at something moving for way too long",
  "Never have I ever had a philosophical debate about cartoon characters",
  "Never have I ever forgotten what I was saying mid-sentence",
  "Never have I ever been convinced that everyone could read my mind",
  
  // Random & Silly
  "Never have I ever tried to push a door that said 'pull' (or vice versa)",
  "Never have I ever had a conversation with someone thinking they were someone else",
  "Never have I ever pretended to be asleep to avoid doing something",
  "Never have I ever created a fake identity in my head for a stranger I saw",
  "Never have I ever gotten irrationally angry at an inanimate object",
  "Never have I ever had a staring contest with an animal",
  "Never have I ever made up lyrics when I didn't know the words to a song",
  "Never have I ever gotten genuinely excited about office/school supplies"
];

interface Player {
  id: number;
  name: string;
  hits: number;
}

export default function NeverHaveIEver() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "results">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStatement, setCurrentStatement] = useState("");
  const [usedStatements, setUsedStatements] = useState<string[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [maxRounds, setMaxRounds] = useState(10);
  const [whoHave, setWhoHave] = useState<number[]>([]);
  const [showingResults, setShowingResults] = useState(false);

  const initializePlayers = (count: number) => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        hits: 0
      });
    }
    setPlayers(newPlayers);
  };

  const startGame = (playerCount: number, rounds: number) => {
    initializePlayers(playerCount);
    setMaxRounds(rounds);
    setRoundNumber(1);
    setUsedStatements([]);
    setGameState("playing");
    nextStatement();
  };

  const nextStatement = () => {
    // Get unused statements
    const availableStatements = NEVER_HAVE_I_EVER_STATEMENTS.filter(
      statement => !usedStatements.includes(statement)
    );
    
    if (availableStatements.length === 0 || roundNumber > maxRounds) {
      endGame();
      return;
    }

    // Pick random statement
    const randomIndex = Math.floor(Math.random() * availableStatements.length);
    const statement = availableStatements[randomIndex];
    
    setCurrentStatement(statement);
    setUsedStatements(prev => [...prev, statement]);
    setWhoHave([]);
    setShowingResults(false);
  };

  const togglePlayerHave = (playerId: number) => {
    setWhoHave(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const confirmSelections = () => {
    // Add hits to players who "have"
    setPlayers(prev => prev.map(player => ({
      ...player,
      hits: player.hits + (whoHave.includes(player.id) ? 1 : 0)
    })));
    
    setShowingResults(true);
    
    setTimeout(() => {
      if (roundNumber >= maxRounds) {
        endGame();
      } else {
        setRoundNumber(prev => prev + 1);
        nextStatement();
      }
    }, 3000);
  };

  const endGame = () => {
    setGameState("results");
  };

  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setCurrentStatement("");
    setUsedStatements([]);
    setRoundNumber(1);
    setWhoHave([]);
    setShowingResults(false);
  };

  const getMostHitsPlayer = () => {
    return players.reduce((prev, current) => 
      current.hits > prev.hits ? current : prev
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          ← Back to Games
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🍃 Never Have I Ever
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The classic party game! If you HAVE done it, you take a hit. 
            Who's gonna be the most experienced? 😏
          </p>
        </div>

        {gameState === "setup" && (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Setup Game</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Number of Players</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4, 5, 6, 7, 8].map(count => (
                    <button
                      key={count}
                      onClick={() => startGame(count, 10)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Game Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { rounds: 5, label: "Quick (5)" },
                    { rounds: 10, label: "Normal (10)" },
                    { rounds: 15, label: "Long (15)" }
                  ].map(({rounds, label}) => (
                    <button
                      key={rounds}
                      onClick={() => startGame(4, rounds)}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-2 px-3 rounded-lg transition-all transform hover:scale-105 text-sm"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === "playing" && !showingResults && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-sm text-gray-400 mb-2">
                Round {roundNumber} of {maxRounds}
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-green-400">
                  {currentStatement}
                </h2>
              </div>
              
              <p className="text-lg text-gray-300 mb-6">
                Who HAS done this? (They take a hit! 🍃)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {players.map(player => (
                <button
                  key={player.id}
                  onClick={() => togglePlayerHave(player.id)}
                  className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    whoHave.includes(player.id)
                      ? 'bg-red-500 border-red-300 text-white shadow-lg shadow-red-500/50'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <div className="text-lg">{player.name}</div>
                  <div className="text-sm opacity-75">
                    Hits so far: {player.hits}
                  </div>
                  {whoHave.includes(player.id) && (
                    <div className="text-xs mt-1">Takes a hit! 🍃</div>
                  )}
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={confirmSelections}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
                disabled={whoHave.length === 0}
              >
                {whoHave.length === 0 ? "Nobody? Really? 🤔" : `Confirm - ${whoHave.length} take${whoHave.length === 1 ? 's' : ''} a hit`}
              </button>
            </div>
          </div>
        )}

        {gameState === "playing" && showingResults && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-red-400">
                {whoHave.length === 0 ? "Nobody confessed! 🤐" : "Time for hits! 🍃"}
              </h2>
              {whoHave.length > 0 && (
                <div className="space-y-2">
                  {whoHave.map(playerId => {
                    const player = players.find(p => p.id === playerId);
                    return (
                      <div key={playerId} className="text-lg">
                        {player?.name} takes a hit! 💨
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="text-sm text-gray-400 mt-4">
                Next round in 3 seconds...
              </div>
            </div>
          </div>
        )}

        {gameState === "results" && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">🏁 Game Over!</h2>
              
              <div className="mb-6">
                <div className="text-xl text-green-400 mb-4">
                  🏆 Most Experienced: {getMostHitsPlayer().name}
                </div>
                <div className="text-lg text-gray-300">
                  With {getMostHitsPlayer().hits} hits! 🍃
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-3">Final Scores:</h3>
                {players
                  .sort((a, b) => b.hits - a.hits)
                  .map((player, index) => (
                  <div 
                    key={player.id}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      index === 0 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-white/5'
                    }`}
                  >
                    <span className="font-semibold">
                      {index === 0 ? '👑' : `${index + 1}.`} {player.name}
                    </span>
                    <div className="text-right">
                      <div className="font-bold">{player.hits} hits</div>
                      <div className="text-xs text-gray-400">
                        {player.hits === 0 ? 'So innocent! 😇' : 
                         player.hits >= 8 ? 'Living life! 🔥' :
                         player.hits >= 5 ? 'Experienced 😏' : 'Not bad! 😊'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
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
              <p className="mb-2">Current Hit Count:</p>
              <div className="flex justify-center space-x-4 flex-wrap">
                {players.map(player => (
                  <span
                    key={player.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      whoHave.includes(player.id) 
                        ? 'bg-red-500/20 text-red-300 animate-pulse' 
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {player.name}: {player.hits + (whoHave.includes(player.id) ? 1 : 0)} 🍃
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