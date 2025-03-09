import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ThreesPanel.css';

const API_BASE_URL = 'http://localhost:3001/api';

const ThreesPanel = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTreeName, setNewTreeName] = useState('');

  // Notification state
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 2000); // Auto-hide after 3 seconds
  };

  const fetchTrees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tree/all`);
      setTrees(response.data);
    } catch (error) {
      console.error("Error fetching trees:", error);
      showNotification("❌ שגיאה בטעינת רשימת העצים", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);

  const handleAddTree = async () => {
    if (!newTreeName.trim()) {
      showNotification("❌ הזן שם עץ חוקי", "error");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/tree/add`, { name: newTreeName });
      showNotification("✅ עץ נוסף בהצלחה!", "success");
      setNewTreeName('');
      fetchTrees();
    } catch (error) {
      console.error("Error adding tree:", error);
      showNotification("❌ שגיאה בהוספת העץ", "error");
    }
  };

  const handleDeleteTree = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tree/delete/${id}`);
      showNotification("✅ עץ נמחק בהצלחה!", "success");
      fetchTrees();
    } catch (error) {
      console.error("Error deleting tree:", error);
      showNotification("❌ שגיאה במחיקת העץ", "error");
    }
  };

  const handleUpdateTree = async (id, currentName) => {
    const newName = prompt("הזן שם חדש לעץ", currentName);
    if (!newName || !newName.trim()) {
      showNotification("❌ שם עץ אינו תקין", "error");
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/tree/update/${id}`, { name: newName });
      showNotification("✅ עץ עודכן בהצלחה!", "success");
      fetchTrees();
    } catch (error) {
      console.error("Error updating tree:", error);
      showNotification("❌ שגיאה בעדכון העץ", "error");
    }
  };

  return (
    <div className="threes-panel">
      {notification.message && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      <h2>ניהול עצים</h2>
      <div className="add-tree">
        <input
          type="text"
          placeholder="הזן שם עץ חדש"
          value={newTreeName}
          onChange={(e) => setNewTreeName(e.target.value)}
        />
        <button onClick={handleAddTree}>+</button>
      </div>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>מספר מזהה</th>
              <th>סוג עץ</th>
              <th>זמן הוספה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {trees.map((tree) => (
              <tr key={tree.treeId}>
                <td>{tree.treeId}</td>
                <td>{tree.name}</td>
                <td>
                  {new Date(tree.date).toLocaleString("he-IL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td>
                  <button onClick={() => handleUpdateTree(tree.treeId, tree.name)}>עדכן</button>
                  <button onClick={() => handleDeleteTree(tree.treeId)}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ThreesPanel;
