// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [birdPosition, setBirdPosition] = useState(100);
  const [gravity, setGravity] = useState(2);
  const [pipes, setPipes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(gameInterval);
      } else {
        // Update bird position based on gravity
        setBirdPosition((prev) => prev + gravity);

        // Update pipe positions
        setPipes((prev) =>
          prev.map((pipe) => ({ ...pipe, left: pipe.left - 5 }))
        );

        // Generate new pipes
        if (Math.random() > 0.95) {
          setPipes((prev) => [
            ...prev,
            { top: Math.random() * 300, left: 800 },
          ]);
        }

        // Check for collisions
        pipes.forEach((pipe) => {
          if (
            birdPosition + 50 > pipe.top &&
            birdPosition < pipe.top + 300 &&
            pipe.left < 100 &&
            pipe.left + 100 > 0
          ) {
            setGameOver(true);
          }
        });

        // Remove off-screen pipes
        setPipes((prev) => prev.filter((pipe) => pipe.left > -100));

        // Update score
        setScore((prev) => prev + 1);
      }
    }, 30);

    // Cleanup interval on component unmount
    return () => clearInterval(gameInterval);
  }, [birdPosition, gravity, pipes, gameOver]);

  const jump = () => {
    if (!gameOver) {
      setGravity(-5);
      setTimeout(() => setGravity(2), 150);
    }
  };

  return (
    <div className="App" onClick={jump}>
      <div className="bird" style={{ bottom: birdPosition }}></div>
      {pipes.map((pipe, index) => (
        <div
          key={index}
          className="pipe"
          style={{ left: pipe.left, height: pipe.top }}
        ></div>
      ))}
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default App;
