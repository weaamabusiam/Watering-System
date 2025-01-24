const express = require('express');
const router = express.Router();

// נקודת קצה לקבלת נתונים
router.get('/', (req, res) => {
    const { temperature, light, humidity } = req.query; // חילוץ הפרמטרים ממחרוזת השאילתה

    // כאן ניתן להוסיף לוגיקה לעיבוד הנתונים שהתקבלו
     // Log the received parameters
     console.log('Temperature:', temperature);
     console.log('Light:', light);
     console.log('Humidity:', humidity);

    res.status(200).send('Data received successfully');
});

module.exports = router;
