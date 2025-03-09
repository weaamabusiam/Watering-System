// ===== Helper Functions =====
void logMessage(const String &msg) {
  Serial.print(" [ ");
  Serial.print(getCurrentTimeStamp());
  Serial.print(" ] ");
  Serial.println(msg);
}

// Returns the current time in milliseconds (from millis()) plus a base server time.
long getCurrentTimeStamp() {
  return ServerTime + (millis()/1000) ;
}

void getCurrentConfig(){
    String jsonData = getJsonData(CurrentState);
    if (jsonData==""){
      logMessage("failed to get config");
      return;
    }
    deserializeJson(CurrentConfig, jsonData.c_str());
    DataPullTime = millis();
}
// turns the pump on and off and modify isPumpActive value
void turn_pump_on_off(bool should_run){
    if (should_run && !isPumpActive){
      logMessage("Pump ON");
      digitalWrite(pump, LOW);
      isPumpActive = true;
      activationTime = millis();


    }
    else if (!should_run && isPumpActive){
    logMessage("Pump OFF");
    digitalWrite(pump, HIGH);
    isPumpActive = false;
    }
}