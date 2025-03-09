// MANUAL_MODE handling: read manual config and control pump accordingly.
void handleManualMode() {
  if ((millis() - DataPullTime) > manualModeCheckConfigInterval) {
    logMessage("Checking manual mode config");
    String jsonData = getJsonData("manual");
    if (jsonData==""){
        logMessage("failed to get config");
        return;
    }
    deserializeJson(doc, jsonData.c_str());
    bool shouldPumpBeOn = doc["pumpEnabled"];
    turn_pump_on_off(shouldPumpBeOn);
    DataPullTime = millis();
  }
}