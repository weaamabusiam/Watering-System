bool isOnPump=true;
float temp;
int minT, maxT;
int countOn = 0;
long activationTime=0;

void handleTempMode() {
  CurrentTemp = dht.readTemperature();
  CurrentLight = map(analogRead(lightSensor), 0, 4095, 0, 100);
  
  if ((millis() - DataPullTime) > tempModeCheckConfigInterval) {
    String jsonData = getJsonData("tempMode");
    if (jsonData==""){
            logMessage("failed to get config");
            return;
        }
    deserializeJson(doc, jsonData.c_str());
    temp = doc["temp"];
    minT = doc["minTime"];
    maxT = doc["maxTime"];
    DataPullTime = millis();
    logMessage("TempMode config: temp=" + String(temp) + ", minTime=" + String(minT) + ", maxTime=" + String(maxT));
    logMessage("CurrentTemp : " + String(CurrentTemp) + " CurrentLight : " + String(CurrentLight));
    logMessage("countOn : " + String(countOn));
  }

  if (CurrentLight > 90) {
    isOnPump = true;
  } else if (CurrentLight < 10 && countOn == 2) {
    isOnPump = true;
    countOn = 0;
  }

  if (isOnPump && temp < CurrentTemp && countOn < 2 && CurrentLight < 40) {
    turn_pump_on_off(true);
    activationTime = millis();
    Serial.println(millis() - activationTime);
    Serial.println((maxT * minutes));

    if (millis() - activationTime > (maxT * minutes)) {
      turn_pump_on_off(false);
      isOnPump = false;
      countOn++;
    }
  } else if (isOnPump && temp > CurrentTemp && countOn < 2 && CurrentLight < 40) {
      turn_pump_on_off(true);
      activationTime = millis();
    if (millis() - activationTime > (minT * minutes)) {
      turn_pump_on_off(false);
      isOnPump = false;
      countOn++;
    }
  }
}