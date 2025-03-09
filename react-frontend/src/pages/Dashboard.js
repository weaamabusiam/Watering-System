import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherWidget from "../components/WeatherWidget"; // adjust the path as needed

const state_codes = {
  "61": "tempMode",
  "62": "SoilMoisture",
  "63": "shabbatMode",
  "64": "manual"
};
const state_hebrew = {
  "tempMode": "טמפרטורה",
  "SoilMoisture": "לחות",
  "shabbatMode": "שבת",
  "manual": "ידני"
};

const getSuffix = (sensorName) => {
  const name = sensorName.toLowerCase();
  if (name.includes("temp")) return "°C ";
  if (name.includes("pump")) return " שניות";
  if (name.includes("moisture") || name.includes("light")) return "%";
  return "";
};

const getTimeAgo = (timestamp) => {
  if (!timestamp) return "אין עדכון";
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);
  return diffInSeconds;
};


function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [currentMode, setCurrentMode] = useState("טוען..."); // current mode text
  const [configData, setConfigData] = useState({});
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:3001/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sensor data
        const responseSensors = await axios.get(`${API_BASE_URL}/telemetry`);
        setSensorData(responseSensors.data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }

      try {
        // Fetch config data from server
        const responseConfig = await axios.get(`${API_BASE_URL}/config/all`);
        setConfigData(responseConfig.data);
        setCurrentMode(state_codes[responseConfig.data.state] || "לא ידוע");
      } catch (error) {
        console.error("Error fetching config data:", error);
        setCurrentMode("שגיאה בטעינת מצב");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper function to format an ISO date string to human-readable format
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleString("he-IL", {
      second : "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // This function returns a human-readable view of the configuration for the active mode.
  const renderHumanReadableConfig = () => {
    if (!configData || !configData[currentMode]) return null;
    const config = configData[currentMode];
    switch (currentMode) {
      case "tempMode":
        return (
          <div className="config-details">
            <p>טמפרטורה רצויה: {config.temp}</p>
            <p>משך השקיה בטמפ' גבוהה: {config.maxTime} דקות</p>
            <p>משך השקיה בטמפ' נמוכה: {config.minTime} דקות</p>
          </div>
        );
      case "SoilMoisture":
        return (
          <div className="config-details">
            <p>רמת לחות רצויה: {config.percent}%</p>
          </div>
        );
      case "shabbatMode":
        return (
          <div className="config-details">
            {Array.isArray(config) && config.length > 0 ? (
              config.map((entry, index) => (
                <p key={index}>
                  <p>{`התחלה: ${formatDate(entry.startDateTime)}`}</p>
                  <p>{`סיום: ${formatDate(entry.endDateTime)}`}</p>
                </p>
              ))
            ) : (
              <p>אין הגדרות זמניות</p>
            )}
          </div>
        );
      case "manual":
        return (
          <div className="config-details">
            <p>מצב משאבה: {config.pumpEnabled ? "מופעל" : "כבוי"}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Current mode container including configuration details and global sync data */}
    <div className="current-mode">
      <h3>
        📡 מצב נוכחי בשרת: <span>{state_hebrew[currentMode]}</span>
      </h3>
      {!loading && configData && (
        <div className="config-row">
            <div className="config-details">
                {configData[currentMode] && renderHumanReadableConfig()}
            </div>
          <div className="global-config">
            <p>סינכרון מצב אחרון: לפני {getTimeAgo(configData.lastModeSync)} שניות</p>
            <p>דוח חיישנים אחרון: לפני {getTimeAgo(configData.lastSensorReportSync)} שניות</p>
          </div>
        </div>
      )}
    </div>


      <h2>📊 נתוני חיישנים</h2>
      {loading ? (
        <div className="loading">🔄 טוען נתונים...</div>
      ) : (
        <table className="sensor-table">
          <thead>
            <tr>
              <th>⏳ זמן דגימה</th>
              <th>חיישן</th>
              <th>ערך</th>
              <th>🪴 מספר עץ</th>
              <th>עובד ?</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.date)}</td>
                <td>{item.name_sensor}</td>
                <td>{item.avg}{getSuffix(item.name_sensor)}</td>
                <td>{item.id_plants}</td>
                <td>{item.is_running ? "כן" : "לא"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <WeatherWidget />
    </div>
  );
}

export default Dashboard;
