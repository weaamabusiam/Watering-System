const express = require('express');
const bodyParser = require('body-parser');
const espRouter = require('./routes/esp'); // ייבוא הראוטר עבור הנתיב /esp

const app = express();
const port = 4000;

// Middleware לעיבוד בקשות JSON
app.use(bodyParser.json());

// שימוש ב-espRouter לטיפול בנתיבים תחת /esp
app.use('/esp', espRouter);

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
