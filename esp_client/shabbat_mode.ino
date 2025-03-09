// SHABBAT_MODE handling: if current time falls in any of the scheduled ranges, pump ON, else OFF.
void handleShabbatMode() {
  bool shouldPumpBeOn = false;
  if ((millis() - DataPullTime) > shabbatModeCheckConfigInterval) {
    logMessage("Checking shabbat mode config");
    getCurrentConfig();
    }
    // Assuming the JSON is an array of objects, each with "startTime" and "endTime" (Unix timestamps in seconds)
    if ((millis() - actionTime) > 10 * seconds){
        long currentSeconds = getCurrentTimeStamp();
        JsonArray schedule = CurrentConfig.as<JsonArray>();
        for (JsonObject entry : schedule) {
          long startTime = entry["startDateTime"];
          long endTime = entry["endDateTime"];
          if (currentSeconds >= startTime && currentSeconds <= endTime) {
            shouldPumpBeOn = true;
            break;
          }
        }
        turn_pump_on_off(shouldPumpBeOn);
        actionTime = millis();
    }
   
}