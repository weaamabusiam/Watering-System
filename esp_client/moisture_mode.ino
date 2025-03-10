int DesiredPercent = 0;

void handleSoilMoistureMode() {
    bool shouldPumpBeOn = false;
    if ((millis() - DataPullTime) > moistureModeCheckConfigInterval) {
      logMessage("Checking soil moisture mode config");
      getCurrentConfig();
      }
    if ((millis() - actionTime) > 1 * seconds){
        DesiredPercent = CurrentConfig["percent"].as<int>();
        CurrentMoisture = map(analogRead(MoistureSensore), 0, 4095, 0, 100);
        logMessage("Desired Moisture: " + String(DesiredPercent));
        logMessage("Current Moisture: " + String(CurrentMoisture));
        if (DesiredPercent > CurrentMoisture) {
              shouldPumpBeOn = true;
        }
        turn_pump_on_off(shouldPumpBeOn);
        actionTime = millis();
    }
}