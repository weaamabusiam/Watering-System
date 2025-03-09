// Checks if a sensor value is valid (assumes a disconnected sensor gives near-zero reading)
int is_sensor_running(int sensorValue) {
  if(sensorValue < 1) {
    // Optionally log a message here
    return 0;
  } else {
    return 1;
  }
}

// Reports sensor data and pump active time (Y) to the server.
void reportSensorData() {
  logMessage("Reporting sensor data");

  CurrentTemp = dht.readTemperature();
  CurrentLight = map(analogRead(lightSensor), 0, 4092, 0, 100);
  CurrentMoisture = map(analogRead(MoistureSensore), 0, 4095, 0, 100);
  logMessage("Temp: " + String(CurrentTemp) + ", Light: " + String(CurrentLight) + ", Moisture: " + String(CurrentMoisture));
  
  sendData("temperature", (int)CurrentTemp, is_sensor_running((int)CurrentTemp));
  sendData("moisture", CurrentMoisture, is_sensor_running(CurrentMoisture));
  sendData("light", CurrentLight, is_sensor_running(CurrentLight));
  sendData("pump", pumpActiveTime / 1000, isPumpActive ? 1 : 0);
  reportingTime = millis();
  pumpActiveTime = 0;
}