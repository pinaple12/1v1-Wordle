import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import greenAvatar from '../img/green_avatar.png';
import yellowAvatar from '../img/yellow_avatar.png';
import { Link } from 'react-router-dom';

const JoinLobby = ({ user }) => {
  const [roomCode, setRoomCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [host, setHost] = useState(null);
  //const socket = useSocket('wss://final-project-wordle-1v1.azurewebsites.net/gameSockets');
  const socket = useSocket('ws://localhost:3000/gameSockets');  

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action === 'guestJoined') {
          setJoined(true);
          setHost(data.host);
          console.log(data.host);
        } else if (data.action === 'gameStarted') {
          window.location.href = `/game?roomCode=${roomCode}`;
        } else if (data.action === 'quit') {
          setHost(null);
          setJoined(false);
          alert('Lobby owner disconnected!');
        } else if (data.action === 'failed') {
          alert('Lobby does not exist!');
        } else if (data.action === 'start') {
          window.location.href = `/game?gameCode=${roomCode}`;
        }
      };
    }
  }, [socket]);

  const handleJoinLobby = () => {
    if (socket && roomCode) {
      socket.send(JSON.stringify({ action: 'join', gameCode : roomCode, username: user.username }));
    }
  };

  const handleQuit = () => {
    if (socket && roomCode) {
      socket.send(JSON.stringify({ action: 'quit', gameCode : roomCode, username: user.username}));
    }
  }

  const prelobby = (
      <div className="lobby-page">
      <div className="lobby-container">
        <h1>Join Lobby</h1>
        <div className="join-lobby-inputs">
          <input 
            type="text" 
            className="room-code-input" 
            placeholder="Enter Room Code"
            value={roomCode} 
            onChange={(e) => setRoomCode(e.target.value)} 
          />
          <button className="lobby-btn-join" onClick={handleJoinLobby}>Start</button>
        </div> 
        </div>
    </div>
    )
  

  const lobby = (
      <div className="lobby-page">
        <div className="lobby-container">
          { roomCode && (
          <div className="lobby-info">
            <div className="room-code"><h2>Room Code: {roomCode}</h2></div>
            <p>Share This Code With Your Friend To Invite Them To The Game.</p>
            <div className="users-container">
              <div className="user">
                <img src={greenAvatar} alt="Host Avatar" />
                <span>{host}</span>
              </div>
              <div className="user">
                <img src={greenAvatar} alt="Friend Avatar" />
                <span>{user.username}<span className="status-dot"></span></span>
              </div>
            </div>
            <Link to={`/`} onClick={handleQuit} className='quit'>Quit Lobby</Link>
          </div>
          )}
        </div>
      </div>
    );
  

  return (
    joined ? lobby : prelobby
   );
  }

export default JoinLobby;
