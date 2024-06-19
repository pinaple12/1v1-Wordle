import React from 'react';
import { Link } from 'react-router-dom';
import learnIcon from '../img/book-2.png'; 
import historyIcon from '../img/restore.png'; 
import statsIcon from '../img/line-chart.png'; 
import createLobbyIcon from '../img/joystick.png'; 
import joinLobbyIcon from '../img/add-friend.png'; 
import logo from '../img/logo-v.png';

const HomePage = ({ user }) => (
  <div>
    {user ? (
      <div className="main-content">
        <h1>Welcome to Wordle 1v1</h1>
        <p>Welcome to Wordle 1v1, the competitive word game where you can challenge your friends and test your word-guessing skills. Ready to start a game? Choose an option below!</p>
        <div className="buttons-row">
          <Link to="/create-lobby" className="button-container">
            <img src={createLobbyIcon} alt="Create Lobby"/>
            <p>CREATE LOBBY</p>
          </Link>
          <Link to="/join-lobby" className="button-container">
            <img src={joinLobbyIcon} alt="Join Lobby"/>
            <p>JOIN LOBBY</p>
          </Link>
        </div>
        <div className="top-row">
          <Link to="/learn" className="icon-container">
            <img src={learnIcon} alt="Learn How to Play" className="icon" />
            <p>Learn How To Play</p>
          </Link>
          <Link to={`/profile/${encodeURIComponent(user.username)}`} className="icon-container">
            <img src={historyIcon} alt="Previous Game History" className="icon" />
            <p>Previous Game History</p>
          </Link>
          <Link to={`/profile/${encodeURIComponent(user.username)}`} className="icon-container">
            <img src={statsIcon} alt="My Game Stats" className="icon" />
            <p>My Game Stats</p>
          </Link>
        </div>
        {/* <Link to="/game?gamse=adf">
           game(for testing)
        </Link> */}
      </div>
    ) : (
          <div className="login-page">
            <div className="login-container">
              <img src={logo} alt="Wordle 1v1 Logo" className="logo" />
              <div >
                <button className='login-button'><a href="/signin" >Log in</a></button>
              </div>
            </div>
          </div>
    )}
    
  </div>

  
);

export default HomePage;




