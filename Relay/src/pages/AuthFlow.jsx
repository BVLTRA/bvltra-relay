import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthScreen from '../components/AuthScreen';
import InventoryGrid, { MINECRAFT_ITEMS } from '../components/InventoryGrid';
import CraftingGrid from '../components/CraftingGrid';
import TransitionScreen from '../components/TransitionScreen';

const AuthFlow = () => {
  const navigate = useNavigate();
  
  const [appPhase, setAppPhase] = useState('auth'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serverMessage, setServerMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // If they arrive at the login screen but already have a token, 
    // bypass the lock and send them zooming to their notessss.
    if (localStorage.getItem('gridlock_token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    if (!serverMessage) return;
    const timer = setTimeout(() => setServerMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [serverMessage]);

  const handleDropItem = (itemId, slotIndex) => {
    const itemData = MINECRAFT_ITEMS.find(item => item.id === itemId);
    if (!itemData) return;
    const newGrid = [...grid];
    newGrid[slotIndex] = itemData;
    setGrid(newGrid);
  };

  const handleRemoveItem = (slotIndex) => {
    const newGrid = [...grid];
    newGrid[slotIndex] = null; 
    setGrid(newGrid);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setServerMessage(null);
    setIsError(false);
  };

  const handleAuthSuccess = (data) => {
    setIsError(false);
    setServerMessage(data.message);
    setCurrentUser(data.user);
    localStorage.setItem('gridlock_token', data.token);

    setTimeout(() => {
      setAppPhase('transition');
    }, 800); 
  };

  const handleRegister = async () => {
    if (!name || !email) {
      setIsError(true);
      setServerMessage("Please fill out all fields.");
      return;
    }
    const gridString = grid.map(slot => slot ? slot.id : 'empty').join(',');
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, gridString })
      });
      const data = await response.json();
      if (response.ok) {
        handleAuthSuccess(data);
      } else {
        setIsError(true);
        setServerMessage(data.error);
      }
    } catch (err) {
      setIsError(true);
      setServerMessage("Cannot connect to the server.");
    }
  };

  const handleLogin = async () => {
    if (!email) {
      setIsError(true);
      setServerMessage("Please enter your email.");
      return;
    }
    const gridString = grid.map(slot => slot ? slot.id : 'empty').join(',');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, gridString })
      });
      const data = await response.json();
      if (response.ok) {
        handleAuthSuccess(data);
      } else {
        setIsError(true);
        setServerMessage(data.error);
      }
    } catch (err) {
      setIsError(true);
      setServerMessage("Cannot connect to the server.");
    }
  };

  if (appPhase === 'transition') {
    return (
      <TransitionScreen 
        name={currentUser?.name} 
        onComplete={() => {
          navigate('/dashboard', { state: { user: currentUser } });
        }} 
      />
    );
  }

  return (
    <>
      {serverMessage && (
        <div className={`toast-message ${isError ? 'toast-error' : 'toast-success'}`}>
          {serverMessage}
        </div>
      )}

      <AuthScreen 
        title={authMode === 'login' ? <>Access your<br/>workspace</> : <>Let's create<br/>your account</>}
        subtitle={authMode === 'login' ? "Login to continue." : "Join us to start building."}
        formInputs={
          <>
            {authMode === 'register' && (
              <input 
                type="text" placeholder="Enter your name" className="email-input"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            )}
            <input 
              type="email" placeholder="Enter your email" className="email-input"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </>
        }
        toolbox={
          <>
            <InventoryGrid />
            <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.9rem' }}>
              Drag items into the grid. Click an item on the grid to remove it.
            </p>
          </>
        }
        gridZone={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <CraftingGrid currentGrid={grid} onDropItem={handleDropItem} onSlotClick={handleRemoveItem} />
            
            <button 
              onClick={authMode === 'login' ? handleLogin : handleRegister}
              style={{
                marginTop: '2.5rem', width: '400px', padding: '16px 24px',
                backgroundColor: '#ffffff', color: '#000000', border: 'none',
                borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600',
                cursor: 'pointer', transition: 'transform 0.1s ease, background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              {authMode === 'login' ? 'Login' : 'Register'}
            </button>

            <p 
              onClick={toggleAuthMode}
              style={{
                marginTop: '1.5rem', color: '#888', fontSize: '0.95rem',
                cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px'
              }}
            >
              {authMode === 'login' 
                ? "Don't have an account? Register instead" 
                : "Already have an account? Login instead"}
            </p>
          </div>
        }
      />
    </>
  );
};

export default AuthFlow;