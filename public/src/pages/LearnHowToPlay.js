import React from 'react';

const LearnHowToPlay = () => (
    <div className="learn-how-to-play-page">
        <h1>How to Play Wordle 1v1</h1>
        <p>Welcome to Wordle 1v1! This guide will help you understand the rules and mechanics so you can start challenging your friends and enjoy the excitement of this competitive word game.</p>
        <h2>Game Rules:</h2>
        <h3>Objective:</h3>
        <p>The goal is to guess the hidden 5-letter word before your opponent within six attempts.</p>
        <h3>Gameplay:</h3>
        <ol>
            <li>Each player will guess a different word.</li>
            <li>After each guess, the letters are highlighted in different colors to provide clues:
            <ul>
                <li><strong>GREEN:</strong> The letter is in the word and in the correct position.</li>
                <li><strong>YELLOW:</strong> The letter is in the word but in the wrong position.</li>
                <li><strong>GRAY:</strong> The letter is not in the word.</li>
            </ul>
            </li>
        </ol>
        <h3>Winning:</h3>
        <ol>
            <li>The first player to guess the word correctly wins.</li>
            <li>If both players fail to guess the word within six attempts, the game ends in a draw.</li>
        </ol>
        <h3>ELO Rating:</h3>
        <p>Your performance affects your ELO rating, which measures your skill level.</p>
        <p><strong>Initial ELO Rating:</strong> Every player starts with an initial ELO rating of 1000.</p>
        <p><strong>ELO Adjustment:</strong> The player's ELO rating is directly adjusted based on the points earned in each game. A win will result in an increase of 10 and a loss will decrease your ELO by 10.</p>
        <h2>Tips and Strategies:</h2>
        <h3>Start with Common Words:</h3>
        <p>Use common 5-letter words for your initial guesses to cover more possibilities.</p>
        <h3>Pay Attention to Feedback:</h3>
        <p>Use the color-coded feedback to refine your guesses and eliminate incorrect letters.</p>
        <h3>Think Ahead:</h3>
        <p>Plan your guesses strategically to maximize the information you gain from each attempt.</p>
        <h3>Stay Calm:</h3>
        <p>Keep a cool head and focus on the clues provided to make the best possible guesses.</p>
    </div>
);

export default LearnHowToPlay;