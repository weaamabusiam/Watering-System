const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const index = express();
const HTTP_PORT = process.env.PORT || 3001;

// Middleware setup
index.use(cookieParser());
index.use(express.json());
index.use(cors());
// Use a lighter Morgan format if dummy mode is enabled
index.use(morgan( 'dev'));

// Import routes
const espRoutes = require('./routes/esp');
const configRoutes = require('./routes/config');
const telemetryRoutes = require('./routes/telemetry');
const tree = require('./routes/treeRout');


// Route definitions
index.use('/esp', espRoutes);
index.use('/api/config', configRoutes);
index.use('/api/telemetry', telemetryRoutes);
index.use('/api/tree', tree);



index.listen(HTTP_PORT, () => {
    console.log(`Server running on port: ${HTTP_PORT}\nLink: http://localhost:${HTTP_PORT}`);
});
