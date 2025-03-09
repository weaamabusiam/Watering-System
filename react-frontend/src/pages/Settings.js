import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import './settings.css';

    const state_codes = {
      "61": "tempMode",
      "62": "SoilMoisture",
      "63": "shabbatMode",
      "64": "manual"
    };

    const state_codes_rev = {
      "tempMode": "61",
      "SoilMoisture": "62",
      "shabbatMode": "63",
      "manual": "64"
    };

    const API_BASE_URL = "http://localhost:3001/api";

    const SettingsPage = () => {
      const [activeMode, setActiveMode] = useState('tempMode'); // Mode being edited
      const [currentMode, setCurrentMode] = useState(); // Currently active mode

      const [configs, setConfigs] = useState({
        state: "61",
        tempMode: { temp: 0, minTime: 0, maxTime: 0 },
        SoilMoisture: { percent: 0 },
        shabbatMode: [{ startDateTime: '', endDateTime: '' }],
        manual: { pumpEnabled: false }
      });

      useEffect(() => {
        const fetchConfigs = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/config/all`);
            if (!Array.isArray(response.data.shabbatMode)) {
                  response.data.shabbatMode = [];
                }
            setConfigs(response.data);
            setCurrentMode(state_codes[response.data.state]); // Set active mode from backend
          } catch (error) {
            console.error('Error fetching configs:', error);
          }
        };

        fetchConfigs();
      }, []);

      const handleChange = (mode, fieldOrIndex, value, subField = null) => {
        setConfigs(prev => {
          if (mode === 'shabbatMode') {
            // Handle array modification for shabbatMode
            const newShabbatMode = [...prev.shabbatMode]; // Clone the array
            newShabbatMode[fieldOrIndex] = {
              ...newShabbatMode[fieldOrIndex],
              [subField]: value
            }; // Update specific entry

            return { ...prev, shabbatMode: newShabbatMode };
          } else {
            // Handle normal config updates
            return {
              ...prev,
              [mode]: { ...prev[mode], [fieldOrIndex]: value },
            };
          }
        });
      };


  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 2000); // Auto-hide after 2 seconds
  };

  const handleSaveConfig = async (mode) => {
    try {
      const dataToSend = { [mode]: configs[mode] };
      await axios.post(`${API_BASE_URL}/config/dataMode`, dataToSend);
      showNotification(`✅ ההגדרות עבור מצב "${mode}" נשמרו בהצלחה!`, "success");
    } catch (error) {
      console.error(`Error saving configuration for ${mode}:`, error);
      showNotification(`❌ שגיאה בשמירת ההגדרות עבור מצב "${mode}"`, "error");
    }
  };

  const handleSetActive = async (mode) => {
    try {
      let dataToSend = state_codes_rev[mode];
      await axios.post(`${API_BASE_URL}/config/state`, { state: dataToSend });
      setCurrentMode(mode);
      showNotification(`✅ מצב "${mode}" נקבע כפעיל`, "success");
    } catch (error) {
      console.error('Error setting active mode:', error);
      showNotification(`❌ שגיאה בקביעת מצב "${mode}"`, "error");
    }
  };

  const renderNotification = () => {
    if (!notification.message) return null;
    return <div className={`notification ${notification.type}`}>{notification.message}</div>;
  };

  const renderEditContainer = () => {
    let title = "";
    let content = null;

    switch (activeMode) {
      case 'tempMode':
        title = 'הגדרות מצב טמפרטורה';
        content = (
          <>
            <div className="field-group">
              <label>טמפרטורה רצויה:</label>
              <input
                type="number"
                value={configs.tempMode.temp}
                onChange={(e) => handleChange('tempMode', 'temp', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>משך השקיה בטמפ' גבוהה (דקות):</label>
              <input
                type="number"
                value={configs.tempMode.maxTime}
                onChange={(e) => handleChange('tempMode', 'maxTime', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>משך השקיה בטמפ' נמוכה (דקות):</label>
              <input
                type="number"
                value={configs.tempMode.minTime}
                onChange={(e) => handleChange('tempMode', 'minTime', e.target.value)}
              />
            </div>
          </>
        );
        break;
      case 'SoilMoisture':
        title = 'הגדרות מצב לחות אדמה';
        content = (
          <div className="field-group">
            <label>רמת לחות רצויה (%):</label>
            <input
              type="number"
              value={configs.SoilMoisture.percent}
              onChange={(e) => handleChange('SoilMoisture', 'percent', e.target.value)}
            />
          </div>
        );
        break;
      case 'shabbatMode':
        title = 'הגדרות מצב שבת';
//         console.log(configs);
        content = (
          <>
            {configs.shabbatMode.map((entry, index) => (
              <div key={index} className="shabbat-entry">
                          <div className="time-fields">
                            <div className="field-group">
                              <label>שעת התחלה:</label>
                              <input
                                type="datetime-local"
                                value={entry.startDateTime || ""}
                                onChange={(e) =>
                                  handleChange('shabbatMode', index, e.target.value, 'startDateTime')
                                }
                              />
                            </div>
                            <div className="field-group">
                              <label>שעת סיום:</label>
                              <input
                                type="datetime-local"
                                value={entry.endDateTime || ""}
                                onChange={(e) =>
                                  handleChange('shabbatMode', index, e.target.value, 'endDateTime')
                                }
                              />
                            </div>
                          </div>
                        </div>
            ))}
          </>
        );
        break;
      case 'manual':
        title = 'הגדרות מצב ידני';
        content = (
          <div className="toggle-container">
            <label>מצב משאבה: {configs.manual.pumpEnabled ? "מופעל" : "כבוי"}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={configs.manual.pumpEnabled}
                onChange={(e) => handleChange('manual', 'pumpEnabled', e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div className="edit-container">
        <h2>{title}</h2>
        {content}
        <div className="button-group">
          <button className="button-save" onClick={() => handleSaveConfig(activeMode)}>שמור הגדרות</button>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    const modes = [
      { key: "tempMode", label: "מצב טמפרטורה" },
      { key: "SoilMoisture", label: "מצב לחות אדמה" },
      { key: "shabbatMode", label: "מצב שבת" },
      { key: "manual", label: "מצב ידני" },
    ];

    return (
      <div className="sidebar">
        <h2>מצבים</h2>
        <ul className="mode-list">
          {modes.map((modeObj) => (
            <li key={modeObj.key} className={`mode-item ${activeMode === modeObj.key ? 'selected' : ''}`} onClick={() => setActiveMode(modeObj.key)}>
              <span>{modeObj.label}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={currentMode === modeObj.key}
                  onChange={() => handleSetActive(modeObj.key)}
                />
                <span className="slider round"></span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="settings-page">
        {renderNotification()} {/* Notification Display */}
      <div className="settings-container">
        {renderSidebar()}
        {renderEditContainer()}
      </div>
    </div>
  );
};

export default SettingsPage;
