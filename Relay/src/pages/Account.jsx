import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlowOrbs from "../components/GlowOrb";
import { useNotes } from "../hooks/useNotes"; 

import '../components/Dashboard.css'; 
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentUser, setCurrentUser] = useState(location.state?.user || { name: "Explorer", email: "..." });

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(currentUser.name);

  const { notes } = useNotes();

  const handleLogout = () => {
    localStorage.removeItem("gridlock_token");
    navigate("/");
  };

  const handleSaveName = async () => {
    if (!editNameValue.trim()) return;
    
    const token = localStorage.getItem("gridlock_token");
    try {
      const response = await fetch("http://localhost:5000/api/user/name", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editNameValue })
      });
      
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user); 
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Failed to update name");
    }
  };

  return (
    <div className="account-layout">
      <GlowOrbs />

      <div className="account-foreground">
        
        {/* THE NAVBAR */}
        <nav className="account-navbar">
          <div className="nav-brand">
            GRIDLOCK // NOTEBOOK
          </div>
          <div className="nav-menu">
            <span 
              className="nav-link" 
              onClick={() => navigate("/dashboard", { state: { user: currentUser } })}
            >
              Notes
            </span>
            <span className="nav-link active">
              Account
            </span>
            <span className="nav-link">
              About this project
            </span>

            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          </div>
        </nav>

        {/* ACCOUNT CONTENT */}
        <main className="account-main">
          <h2 className="account-heading">
            Account Details
          </h2>

          <div className="account-card">
            
            {/* Name Block */}
            <div className="form-section">
              <label className="field-label">Display Name</label>
              {isEditingName ? (
                <div className="edit-wrapper">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="btn-primary">Save</button>
                  <button 
                    onClick={() => { setIsEditingName(false); setEditNameValue(currentUser.name); }} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="display-wrapper">
                  <span className="display-name">{currentUser.name}</span>
                  <button onClick={() => setIsEditingName(true)} className="btn-text">
                    Edit Name
                  </button>
                </div>
              )}
            </div>

            {/* Email Block */}
            <div className="form-section-spaced">
              <label className="field-label">Email Address</label>
              <div className="display-email">{currentUser.email}</div>
            </div>

            {/* Data Stats Block */}
            <div className="stats-container">
              <div>
                <label className="field-label">Total Notes</label>
                <div className="stat-large">{notes.length}</div>
              </div>
              <div>
                <label className="field-label">Member Since</label>
                <div className="stat-medium">
                  {currentUser.createdAt 
                    ? new Date(currentUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) 
                    : "Just now"}
                </div>
              </div>
              <div>
                <label className="field-label">Last Profile Update</label>
                <div className="stat-medium">
                  {currentUser.updatedAt 
                    ? new Date(currentUser.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
                    : "No updates"}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Account;