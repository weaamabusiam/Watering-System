bool isOnPump=true;
float temp;
int minT, maxT;
int countOn = 0;
long activationTime=0;

void handleTempMode() {
  if ((millis() - DataPullTime) > tempModeCheckConfigInterval) {
    getCurrentConfig();
    temp = CurrentConfig["temp"];
    minT = CurrentConfig["minTime"];
    maxT = CurrentConfig["maxTime"];
    DataPullTime = millis();
    logMessage("TempMode config: temp=" + String(temp) + ", minTime=" + String(minT) + ", maxTime=" + String(maxT));
    logMessage("CurrentTemp : " + String(CurrentTemp) + " CurrentLight : " + String(CurrentLight));
    logMessage("countOn : " + String(countOn));
  }

  CurrentTemp = dht.readTemperature();
  CurrentLight = map(analogRead(lightSensor), 0, 4095, 0, 100);

  if (CurrentLight > 90) {
    isOnPump = true;
  } else if (CurrentLight < 10 && countOn == 2) {
    isOnPump = true;
    countOn = 0;
  }

  if (isOnPump && temp < CurrentTemp && countOn < 2 && CurrentLight < 40) {
    turn_pump_on_off(true);
    activationTime = millis();
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