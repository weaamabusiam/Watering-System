const express = require('express');
const router = express.Router();
const db = require('../models/database');
const DataSensors = require('../models/dataSensors'); // our new model
const dataSensors = new DataSensors(db);

// GET all sensor records or dummy data if simulation is enabled
router.get('/', async (req, res) => {
  try {
    const sensors = await dataSensors.getAllSensors();
    res.json(sensors);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({error: 'Error fetching sensor data'});
  }
});

// GET sensor records filtered by plant id
router.get('/plant/:plantId', async (req, res) => {
  try {
    const plantId = req.params.plantId;
    const { id_plants, name_sensor, avg, date, is_running } = req.query;
    const sensors = await dataSensors.getSensorsDataByPlant(plantId);
    res.json(sensors);
  } catch (error) {
    console.error('Error fetching sensors for plant:', error);
    res.status(500).json({error: 'Error fetching sensors for plant'});
  }
});

module.exports = router;
