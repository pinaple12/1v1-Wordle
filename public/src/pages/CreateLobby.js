import React, { useState, useEffect } from 'react';
import greenAvatar from '../img/green_avatar.png';
import yellowAvatar from '../img/yellow_avatar.png';
import { Link, useNavigate } from 'react-router-dom';


const CreateLobby = ({ user }) => {
  const [roomCode, setRoomCode] = useState('');
  const [word, setWord] = useState('');
  const [guest, setGuest] = useState(null);
  const [ws, setWs] = useState(undefined);
  const navigator = useNavigate();

  const handleCreateLobby = async () => {
    const lobbyResponse = await fetch('/api/games/createLobby', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ playerName: user.username })
    })

    if (lobbyResponse.status !== 200) {
      return ('fatal error');
    }

    const lobbyData = await lobbyResponse.json();

    setWord(lobbyData.word);
    setRoomCode(lobbyData.gameCode);
    handleWs(lobbyData.gameCode);
  };

  const handleWs = async (gameCode) => {
    console.log('got here');

    //const webSocket = new WebSocket("wss://final-project-wordle-1v1.azurewebsites.net/gameSockets");
    const webSocket = new WebSocket("ws://localhost:3000/gameSockets");
    console.log('webSocket', webSocket);

    webSocket.addEventListener('open', (_event) => {
      webSocket.send(JSON.stringify({ action: 'create', gameCode}));
    });

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'guestJoined') {
        setGuest(data.guest);
        console.log(data.guest);
      }
      if (data.action === 'quit') {
        setGuest(null);
      }
    }

    setWs(webSocket);
  }

  const handleQuit = () => {
    if (ws && roomCode) {
      ws.send(JSON.stringify({ action: 'quit', gameCode : roomCode, username: user.username}));
    }
  }

  const handleStart = () => {
    if (!guest) {
      alert('Still waiting for guest!');
      return;
    }
    if (ws && roomCode) {
      ws.send(JSON.stringify({ action: 'start', gameCode : roomCode}));
      navigator(`/game?gameCode=${roomCode}`);
    }
  }

  return (
    <div className="lobby-page">
      <div className="lobby-container">
        <h1>Create Lobby</h1>
        <button className="lobby-btn" onClick={handleCreateLobby}>Create</button>
        { roomCode && (
        <div className="lobby-info">
          <div className="room-code"><h2>Room Code: {roomCode}</h2></div>
          <p>Share This Code With Your Friend To Invite Them To The Game.</p>
          <div className="users-container">
            <div className="user">
              <img src={greenAvatar} alt="Host Avatar" />
              <span>{user.username}<span className="status-dot"></span></span>
            </div>
            <div className="user">
              <img src={guest ? greenAvatar : yellowAvatar} alt="Friend Avatar" />
              <span>
                {guest ? `${guest}` : 'Waiting for guest...'}
              </span>
            </div>
          </div>
          <button className="start-btn" onClick={handleStart}>
            Start
          </button>
          {/* <Link to={`/game?roomCode=${roomCode}`}>
           game(for testing)
        </Link> */}
          <Link to={`/`} onClick={handleQuit} className='quit'>Quit Lobby</Link>
        </div>
        )}
      </div>
    </div>
  );
};

export default CreateLobby;


