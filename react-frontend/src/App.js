import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import ThreesPanel from "./pages/ThreesPanel"; // Import the new component

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>🌱 מערכת השקיה חכמה</h1>
          <NavButtons />
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/config" element={<SettingsPage />} />
          <Route path="/threes" element={<ThreesPanel />} />  {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

function NavButtons() {
  const navigate = useNavigate();
  return (
    <nav>
      <button onClick={() => navigate("/")}>📊 לוח בקרה</button>
      <button onClick={() => navigate("/config")}>⚙️ הגדרות</button>
      <button onClick={() => navigate("/threes")}>🪴 עצים</button>  {/* New navigation button */}
    </nav>
  );
}

export default App;
