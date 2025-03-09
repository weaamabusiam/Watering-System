// MANUAL_MODE handling: read manual config and control pump accordingly.
void handleManualMode() {
  if ((millis() - DataPullTime) > manualModeCheckConfigInterval) {
    logMessage("Checking manual mode config");
    getCurrentConfig();
    bool shouldPumpBeOn = CurrentConfig["pumpEnabled"];
    turn_pump_on_off(shouldPumpBeOn);
  }
}