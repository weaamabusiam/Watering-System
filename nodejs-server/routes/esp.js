const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../models/database');
const DataSensors = require('../models/dataSensors'); // our new model
const dataSensors = new DataSensors(db);
const filePath = "Inside_information.json";


router.get('/report_sensor_data', (req,res) => {
    console.log(req.query)

    let syncData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Write the updated data back to the file
    syncData["lastSensorReportSync"] = new Date();
    fs.writeFileSync(filePath, JSON.stringify(syncData, null, 2), "utf8");
    try {
        const sensorData = req.body;
        dataSensors.insertSensorData(new Date(),req.query);
        res.status(201).json({ message: 'Sensor added successfully' });
    } catch (error) {
        console.error('Error adding sensor data:', error);
        res.status(500).json({ error: 'Error adding sensor data' });
    }
});

router.get('/state', (req,res) =>{


    let syncData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Write the updated data back to the file
    syncData["lastModeSync"] = new Date();
    fs.writeFileSync(filePath, JSON.stringify(syncData, null, 2), "utf8");

    let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    data = {
        state: data.state,
        timeStamp: Math.floor(new Date().getTime() / 1000)
    }
    res.json(data);

})

router.get('/dataMode', (req, res) => {
  console.log(req.query);
  const { state } = req.query;
  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let entry_name = data["modes"][state]
  if (state === "63") {
    // Convert each shabbat mode entry to include Unix timestamps (in seconds)
    let entries = data[entry_name].map(entry => {
      return {
        startDateTime: Math.floor(new Date(entry.startDateTime).getTime() / 1000),
        endDateTime: Math.floor(new Date(entry.endDateTime).getTime() / 1000)
      };
    });
    console.log(entries);
    res.json(entries);
  } else {
    console.log(data[entry_name]);
    res.json(data[entry_name]);
  }
});

module.exports = router;