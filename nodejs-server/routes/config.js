const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = "Inside_information.json";


router.get('/state', (req,res) =>{
  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data = {
    state: data.state,
    date: new Date().getHours()
  }
  res.json(data);
})

router.get('/dataMode', (req,res) =>{
  const { state } = req.query;
  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data[state]);
})

// POST /state - update the "state" key value and return it along with the current hour
router.post('/state', (req, res) => {
  try {
    // Read current JSON file data
    let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Update the "state" key if provided in the request body
    if (req.body.state !== undefined) {
      data.state = req.body.state;
    } else {
      return res.status(400).json({ error: "Missing 'state' in request body" });
    }

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    // Return updated state along with the current hour (date)
    res.json({
      state: data.state,
      date: new Date().getHours()
    });
  } catch (error) {
    console.error("Error updating state:", error);
    res.status(500).json({ error: "Failed to update state" });
  }
});

// POST /dataMode - update keys like tempMode, SoilMoisture, shabbatMode, manual
router.post('/dataMode', (req, res) => {
  console.log(req.body);
  try {
    // Read the existing JSON file data
    let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Update the keys if they are provided in the request body
    if (req.body.tempMode !== undefined) {
      data.tempMode = req.body.tempMode;
    }
    if (req.body.SoilMoisture !== undefined) {
      data.SoilMoisture = req.body.SoilMoisture;
    }
    if (req.body.shabbatMode !== undefined) {
      data.shabbatMode = req.body.shabbatMode;
    }
    if (req.body.manual !== undefined) {
      data.manual = req.body.manual;
    }

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    res.json({
      message: "Data mode updated successfully",
      data
    });
  } catch (error) {
    console.error("Error updating data mode:", error);
    res.status(500).json({ error: "Failed to update data mode" });
  }
});

router.get('/all', (req,res) =>{
  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
})

module.exports = router;
