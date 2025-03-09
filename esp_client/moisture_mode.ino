unsigned long moistureTime = 0;
int DesiredPercent = 0;

void handleSoilMoistureMode() {
    bool shouldPumpBeOn = false;
    if ((millis() - DataPullTime) > moistureModeCheckConfigInterval) {
      logMessage("Checking soil moisture mode config");
      String jsonData = getJsonData("SoilMoisture");
      if (jsonData==""){
          logMessage("failed to get config");
          return;
      }
      deserializeJson(doc, jsonData.c_str());
      DesiredPercent = doc["percent"].as<int>();
      DataPullTime = millis();
      }
    if ((millis() - moistureTime) > seconds){
        CurrentMoisture = map(analogRead(MoistureSensore), 0, 4095, 0, 100);
        logMessage("Desired Moisture: " + String(DesiredPercent));
        logMessage("Current Moisture: " + String(CurrentMoisture));
        if (DesiredPercent > CurrentMoisture) {
              shouldPumpBeOn = true;
        }
     turn_pump_on_off(shouldPumpBeOn);
     moistureTime = millis();
    }
}