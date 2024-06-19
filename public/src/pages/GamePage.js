import React, { useState, useEffect } from 'react';
import Keyboard from '../components/Keyboard';
import GameEndPopup from '../components/GameEndPopup';
import words from '../data/words';

const Game = ({ user }) => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [result, setResult] = useState('');
  const [word, setWord] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess(currentGuess + key);
      } else if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, gameOver]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('gameCode')) {
      setGameCode(urlParams.get('gameCode'))
    };

    setWord(getRandomWord());
  }, [])

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].toUpperCase();
  }

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        const newFeedback = checkGuess(currentGuess);
        setFeedback((prevFeedback) => [...prevFeedback, newFeedback]);

        setGuesses( (prevGuesses) => {
          const updatedGuesses = [...prevGuesses, currentGuess];

          if (newFeedback.every((letter) => letter === 'green')) {

            const gainedPoints = calculatePoints(updatedGuesses.length);
            //Handles sending results to server
            fetch('/api/games/finishedGame', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                playerName: user.username,
                gameCode,
                score : gainedPoints
              })
            }).then(resp => resp.json()).then(gameResult => {
              console.log(gameResult);
              setResult(gameResult.result);
              setGameOver(true);


              fetch('/api/user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  game: {
                    winner: gameResult.result === 'win' ? user.username : '',
                    gameID: gameCode
                  }
                })
              })
            });
          } else if (updatedGuesses.length === 6) { 
            
            //Handles sending results to server
            fetch('/api/games/finishedGame', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                playerName: user.username,
                gameCode,
                score : 0
              })
            }).then(resp => resp.json()).then(gameResult => {
              console.log(gameResult);
              setResult(gameResult.result);
              setGameOver(true);

              fetch('/api/user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  game: {
                    winner: gameResult.result === 'win' ? user.username : '',
                    gameID: gameCode
                  }
                })
              })
            });
          } 
          return updatedGuesses;
        });
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  const checkGuess = (guess) => {
    const feedback = Array(5).fill('gray');

    for (let i = 0; i < 5; i++) {
      if (guess[i] === word[i]) {
        feedback[i] = 'green';
      } else if (word.includes(guess[i])) {
        feedback[i] = 'yellow';
      }
    }

    return feedback;
  };

  const calculatePoints = (attempts) => {
    switch (attempts) {
      case 1: return 500;
      case 2: return 400;
      case 3: return 300;
      case 4: return 200;
      case 5: return 100;
      case 6: return 50;
      default: return 0;
    }
  };

  return (
    <div className="game-page">
      <h1>Wordle 1v1</h1>
      <div className="game-grid">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="guess-row">
            {Array.from({ length: 5 }).map((_, letterIndex) => {
              const letter = guesses[rowIndex] ? guesses[rowIndex][letterIndex] : (rowIndex === guesses.length ? currentGuess[letterIndex] : '');
              const feedbackClass = feedback[rowIndex] ? feedback[rowIndex][letterIndex] : (rowIndex === guesses.length ? '' : '');
              return (
                <div key={letterIndex} className={`letter ${feedbackClass}`}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Keyboard onKeyPress={handleKeyPress} />
      {gameOver && (
        <GameEndPopup
          result={result}
          word={word}
          onRestart={() => window.location.href = '/'}
        />
      )}
    </div>
  );
};

export default Game;