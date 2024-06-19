import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LearnHowToPlay from './pages/LearnHowToPlay';
import CreateLobby from './pages/CreateLobby';
import JoinLobby from './pages/JoinLobby';
import GamePage from './pages/GamePage';
import Profile from './pages/Profile';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user/myIdentity');
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'loggedin') {
                    setUser(data.userInfo);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

      fetchUserData();
  }, []);

  return (
    <div className="app-container">
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<HomePage user={user}/>} />
          <Route path="/learn" element={<LearnHowToPlay />} />
          <Route path="/create-lobby" element={<CreateLobby user={user}/>} />
          <Route path="/join-lobby" element={<JoinLobby user={user}/>} />
          <Route path="/game" element={<GamePage user={user}/>} />
          <Route path="/profile/:username" element={<Profile user={user}/>} />
        </Routes> 
      </Router>
      <Footer/>
    </div>
    
  );
}

export default App;
