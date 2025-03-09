#include <DHT.h>
#include <ArduinoJson.h>

// ---- Pins ----
#define dhtPin          16
#define pump            15
#define lightSensor     34
#define MoistureSensore 35
// ----- State Machine -----
#define TEMP_MODE           61
#define SOIL_MOISTURE_MODE  62
#define SHABBAT_MODE        63
#define MANUAL_MODE         64
// ----- General Data -----
#define DHTTYPE DHT11
DHT dht(dhtPin, DHTTYPE);
DynamicJsonDocument StateDocument(1024);  // JSON document with a 1KB capacity

// global variables
int CurrentState = 0;
DynamicJsonDocument CurrentConfig(1024);
// Sensor variables
float CurrentTemp;
int CurrentLight;
int CurrentMoisture;
bool isPumpActive = false;

// global system timings
const int minutes = 1000 * 60;
const int seconds = 1000;
const int modeCheckInterval = 30 * seconds;
const int tempModeCheckConfigInterval = 20 * seconds;
const int moistureModeCheckConfigInterval = 10 * seconds;
const int shabbatModeCheckConfigInterval = 30 * seconds;
const int manualModeCheckConfigInterval = 3 * seconds;
const int sensorDataReportInterval = 60 * seconds;

// Total pump active time in current reporting interval (ms)
unsigned long pumpActiveTime = 0;
unsigned long pumpCheckTime = 0;
unsigned long reportingTime=0;
unsigned long DataPullTime=0;
unsigned long statusCheckTime=0;
long actionTime = 0;
// the initial time form the server (timeStamp)
unsigned long ServerTime = 0;

// ===== Main Setup & Loop =====
void setup() {
  pinMode(pump, OUTPUT);
  digitalWrite(pump, HIGH); // Ensure pump is off (assuming HIGH = off)
  Serial.begin(115200);
  WiFi_SETUP();  // WiFi and HTTP helpers from WiFiHelpers.h
  dht.begin();
  String initialJson = GetState();
  deserializeJson(StateDocument, initialJson.c_str());
  CurrentState = StateDocument["state"].as<int>();
  ServerTime = StateDocument["timeStamp"];
  String initialConfig = getJsonData(CurrentState);
  deserializeJson(CurrentConfig, initialConfig.c_str());
  isPumpActive = false;
  DataPullTime = millis();
  statusCheckTime = millis();
}

void loop() {
  // Accumulate pump active time every 1s if pump is on
  if ((millis() - pumpCheckTime) > seconds) {
      if (isPumpActive) {
        pumpActiveTime += seconds;
      }
    pumpCheckTime = millis();
  }

  // Update state machine every modeCheckInterval (if needed)
  if ((millis() - statusCheckTime) > modeCheckInterval) {
    String jsonData = GetState();
    deserializeJson(StateDocument, jsonData.c_str());
    // on every state change turn off the pump first
    if (CurrentState != StateDocument["state"].as<int>()){
        turn_pump_on_off(false);
        CurrentState = StateDocument["state"].as<int>();
        String initialConfig = getJsonData(CurrentState);
        deserializeJson(CurrentConfig, initialConfig.c_str());
        DataPullTime = millis();
    }
  statusCheckTime = millis();
  }
  
  // Report sensor data every sensorUpdateInterval
  if ((millis() - reportingTime) > sensorDataReportInterval) {
    reportSensorData();
  }
  
  // Execute mode-specific logic based on CurrentState
  switch (CurrentState) {
    case TEMP_MODE:
      handleTempMode();
      break;
    case SOIL_MOISTURE_MODE:
      handleSoilMoistureMode();
      break;
    case SHABBAT_MODE:
      handleShabbatMode();
      break;
    case MANUAL_MODE:
      handleManualMode();
      break;
    default:
      logMessage("Unsupported Mode");
      break;
  }
}
