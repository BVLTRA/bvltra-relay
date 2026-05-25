import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlowOrbs from "./GlowOrb";
import { useNotes } from "../hooks/useNotes"; 
import './Dashboard.css'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || { name: "Explorer" };

  const { 
    notes, currentNoteId, content, saveStatus, 
    handleTextChange, handleSelectNote, handleCreateNew 
  } = useNotes();

  const handleLogout = () => {
    localStorage.removeItem("gridlock_token");
    navigate("/");
  };

  const statusLineColor = saveStatus === "All changes saved" ? "#4ade80" :
                          saveStatus === "Saving..." ? "#fbbf24" :
                          saveStatus.includes("Failed") || saveStatus.includes("Offline") ? "#ff4d4d" : "transparent";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", position: "relative", overflow: "hidden" }}>
      <GlowOrbs />

      <div style={{ position: "relative", zIndex: 10, paddingBottom: "4rem" }}>
        
        {/* THE NAVBAR */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 5%", borderBottom: "1px solid #222" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "1px" }}>
            GRIDLOCK // NOTEBOOK
          </div>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <span className="nav-link active">
              Notes
            </span>
            {/* Navigates to the Account page, passing the user state with it */}
            <span 
              className="nav-link" 
              onClick={() => navigate("/account", { state: { user: user } })}
            >
              Account
            </span>
            <span className="nav-link">
              About this project
            </span>

            <button
              onClick={handleLogout}
              style={{ background: "transparent", border: "1px solid #333", color: "#fff", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseOver={(e) => (e.target.style.borderColor = "#666")}
              onMouseOut={(e) => (e.target.style.borderColor = "#333")}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT ZONE */}
        <main style={{ display: "flex", flexDirection: "column", paddingTop: "6vh", maxWidth: "800px", margin: "0 auto", width: "90%" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "400", margin: 0 }}>
              What would you like to type, {user.name}?
            </h2>
            <button
              onClick={handleCreateNew}
              style={{ background: "#fff", color: "#000", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "transform 0.1s ease" }}
              onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            >
              + New Note
            </button>
          </div>

          <textarea
            placeholder="Start typing..."
            value={content}
            onChange={handleTextChange}
            style={{
              width: "auto", minHeight: "200px", backgroundColor: "#111111b2", color: "#eee",
              border: "1px solid #333", borderRadius: "12px", padding: "24px",
              fontSize: "1.1rem", lineHeight: "1.6", resize: "none", outline: "none", transition: "border-color 0.5s ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#ffffff"; e.target.style.backgroundColor = "#111111e0"; e.target.style.borderWidth = "1px"; }}
            onBlur={(e) => { e.target.style.borderColor = "#333"; e.target.style.backgroundColor = "#111111b2"; e.target.style.borderWidth = "1px"; }}
          />

          <div style={{ width: '100%' }}>
            <div style={{ height: '2px', width: '97%', margin: '0 auto', backgroundColor: statusLineColor || '#333', transition: 'background-color 0.3s ease' }} />
            <div style={{ height: '20px', marginTop: '6px', fontSize: '0.85rem', width: '97%', margin: '0 auto', color: statusLineColor, display: 'flex', justifyContent: 'flex-end' }}>
              {saveStatus}
            </div>
          </div>

          <div style={{ marginTop: "3rem", width: "100%" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#888", marginBottom: "1.5rem", borderBottom: "1px solid #222", paddingBottom: "0.5rem" }}>
              Saved Notes
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
              {notes.map((note) => (
                <div
                  key={note._id}
                  className={`note-card ${currentNoteId === note._id ? "active-card" : ""}`}
                  style={{ backgroundColor: currentNoteId === note._id ? "#141414" : "#000000b2", borderWidth: "1px" }}
                  onClick={() => handleSelectNote(note)}
                >
                  <div style={{ fontWeight: "600", fontSize: "1.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {note.title}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    {new Date(note.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;