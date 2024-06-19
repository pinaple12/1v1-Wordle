import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';



const Profile = ({ user }) => {

  const { username } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [gameInfo, setGameInfo] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfo(null); // Reset user info while fetching
        setGameInfo([]);
        const response = await fetch(`/api/user/${encodeURIComponent(username)}`);
        if (!response.ok) {
          console.log('User not added to database.');
        } else {
          const data = await response.json();
          setUserInfo(data);
        }

        const gameResponse = await fetch(`/api/games/${encodeURIComponent(username)}`);
        if (!gameResponse.ok) {
          throw new Error('Failed to fetch');
        } else {
          const data = await gameResponse.json();
          setGameInfo(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserInfo();
  }, [username]);

  if (!userInfo) {
    return <div>
      <p>Loading...</p>
      <br></br>
      <p>If you are stuck on this screen, the user you are looking for is likely not yet in our database. Complete a game to activate.</p>
    </div>;
  }

  const handleAddFriend = async () => {
    try {
      const response = await fetch('/api/user/friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiverUsername: friendUsername, senderUsername: userInfo.username })
      });
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
      const data = await response.json();
      console.log(data);
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleAccept = async (request) => {
    try {
      const response = await fetch('/api/user/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: userInfo.username, requesterUsername: request })
      });
      if (!response.ok) {
        throw new Error('Failed to accept friend');
      }
      const data = await response.json();
      alert(data.message);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleDecline = async (request) => {
    try {
      const response = await fetch('/api/user/reject-request', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: userInfo.username, requesterUsername: request })
      });
      if (!response.ok) {
        throw new Error('Failed to decline friend');
      }
      const data = await response.json();
      alert(data.message);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }


  return (
    <div className="profile-page">
      <div className="header">
        <h1>{username}</h1>
        <div>
          {userInfo.username === user.username && (
            <button className='logout-button'><a href="/signout">Log out</a></button>
          )}
        </div>
      </div>
      <div className="statistics">
        <p>ELO Rating: {userInfo.elo}</p>
        <p>Games Played: {userInfo.gamesPlayed.length}</p>
        <p>Games Won: {userInfo.gamesWon}</p>
        <p>Games Lost: {userInfo.gamesLost}</p>
      </div>
      <div className="row">
        <div className="labeled-column">
          <div className='label'><strong>Friends</strong></div>
          <input
            type="text"
            placeholder="Enter Username Here"
            value={friendUsername}
            onChange={e => setFriendUsername(e.target.value)}
          />
          <button onClick={handleAddFriend}>Add Friend</button>
          <div className="column friends-list">
            {userInfo.friends.map((friend, index) => (
              <Link to={`/profile/${encodeURIComponent(friend)}`} className="icon-container">
                <p key={index}>{friend}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="labeled-column">
          <div className='label'><strong>Game History</strong></div>
          <div className="column game-history">
            {gameInfo.map((game, index) => (
              <div key={index}>
                <p>{game.players[0]} vs. {game.players[1]}</p>
                <p>Winner: {game.winner}</p>
                <br></br>
              </div>
            ))}
          </div>
        </div>
        <div className="labeled-column">
          <div className='label'><strong>Friend Requests</strong></div>
          <div className="column friend-requests">
            <div>
              {userInfo.username === user.username ? (
                userInfo.requests.map((request, index) => (
                  <div key={index}>
                    <p>{request}</p>
                    <button onClick={() => handleAccept(request)}>Accept</button>
                    <button onClick={() => handleDecline(request)}>Decline</button>
                  </div>
                ))
              ) : (
                <p>Friend requests are private.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
