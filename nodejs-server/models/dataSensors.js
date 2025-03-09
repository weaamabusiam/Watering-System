class DataSensors {
  constructor(db) {
    this.DB = db;
  }

  // Retrieve all sensor records from the dataSensors table
  async getAllSensors() {
    try {
      const [rows] = await this.DB.execute("SELECT * FROM dataSensors ORDER BY id DESC LIMIT 20");
      return rows;
    } catch (error) {
      console.error("Error fetching sensors:", error);
      throw error;
    }
  }

  // Add a new sensor record.
  // sensorData should be an object with keys: id_plants, name_sensor, avg, date, is_running.
  async insertSensorData(time_stamp,sensorData) {
    try {
      const { id_plants, name_sensor, avg, is_running } = sensorData;
      const [result] = await this.DB.execute(
        "INSERT INTO dataSensors (id_plants, name_sensor, avg, date, is_running) VALUES (?, ?, ?, ?, ?)",
        [id_plants, name_sensor, avg, time_stamp, is_running]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error adding sensor:", error);
      throw error;
    }
  }

  // Retrieve sensor records filtered by plant ID (id_plants)
  async getSensorsDataByPlant(plantId) {
    try {
      const [rows] = await this.DB.execute(
        "SELECT * FROM dataSensors WHERE id_plants = ? ORDER BY id DESC LIMIT 20",
        [plantId]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching sensors by plant id:", error);
      throw error;
    }
  }
}

module.exports = DataSensors;
