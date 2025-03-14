import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './settings.css';

const API_BASE_URL = "http://localhost:3001/api";

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

const SettingsPage = () => {
  const [stateCodes, setStateCodes] = useState({});
  const [stateCodesRev, setStateCodesRev] = useState({});
  const [activeMode, setActiveMode] = useState('tempMode'); // Mode being edited
  const [currentMode, setCurrentMode] = useState(); // Currently active mode

  const [configs, setConfigs] = useState({
    state: "61",
    tempMode: { temp: 0, minTime: 0, maxTime: 0 },
    SoilMoisture: { percent: 0 },
    shabbatMode: [{ startDateTime: '', endDateTime: '' }],
    manual: { pumpEnabled: false }
  });

  const [notification, setNotification] = useState({ message: "", type: "" });

  // Fetch state codes and configuration on mount
  useEffect(() => {
    const fetchStateCodes = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/config/stateCodes`);
        setStateCodes(data);
        const reversed = Object.entries(data).reduce((acc, [key, value]) => {
          acc[value] = key;
          return acc;
        }, {});
        setStateCodesRev(reversed);
      } catch (error) {
        console.error('Error fetching state codes:', error);
      }
    };

    const fetchConfigs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/config/all`);
        if (!Array.isArray(response.data.shabbatMode)) {
          response.data.shabbatMode = [];
        }
        setConfigs(response.data);
      } catch (error) {
        console.error('Error fetching configs:', error);
      }
    };

    fetchStateCodes();
    fetchConfigs();
  }, []);

  useEffect(() => {
    if (configs.state && Object.keys(stateCodes).length > 0) {
      setCurrentMode(stateCodes[configs.state]);
    }
  }, [configs, stateCodes]);

  // Handle change for both simple objects and shabbatMode array entries
  const handleChange = (mode, fieldOrIndex, value, subField = null) => {
    setConfigs(prev => {
      if (mode === 'shabbatMode') {
        const newShabbatMode = [...prev.shabbatMode];
        newShabbatMode[fieldOrIndex] = {
          ...newShabbatMode[fieldOrIndex],
          [subField]: value
        };
        return { ...prev, shabbatMode: newShabbatMode };
      } else {
        return {
          ...prev,
          [mode]: { ...prev[mode], [fieldOrIndex]: value },
        };
      }
    });
  };

  // Add a new Shabbat mode entry
  const addShabbatModeEntry = () => {
    setConfigs(prev => ({
      ...prev,
      shabbatMode: [...prev.shabbatMode, { startDateTime: '', endDateTime: '' }]
    }));
  };

  // Remove a Shabbat mode entry by index
  const removeShabbatModeEntry = (index) => {
    setConfigs(prev => ({
      ...prev,
      shabbatMode: prev.shabbatMode.filter((_, i) => i !== index)
    }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 2000);
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
      let dataToSend = stateCodesRev[mode];
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
        content = (
          <>
            {Array.isArray(configs.shabbatMode) && configs.shabbatMode.map((entry, index) => (
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
                  <button className="remove-btn" onClick={() => removeShabbatModeEntry(index)}>-</button>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addShabbatModeEntry}>+</button>
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
            <li
              key={modeObj.key}
              className={`mode-item ${activeMode === modeObj.key ? 'selected' : ''}`}
              onClick={() => setActiveMode(modeObj.key)}
            >
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
      {notification.message && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
      <div className="settings-container">
        {renderSidebar()}
        {renderEditContainer()}
      </div>
    </div>
  );
};

export default SettingsPage;
