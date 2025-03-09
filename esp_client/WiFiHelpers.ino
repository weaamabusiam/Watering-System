#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
// Need to adapt this
const int test_plant_id = 16;
const char* ssid = "<your_network_name>";
const char* password = "your_network_name";
String my_endpoint = "http://<your_pc_ip>:3001/esp/";

WiFiClient client;


void WiFi_SETUP() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void sendData(String name_sensor, int avg, int is_running) {
  HTTPClient http;
  String dataUrl = "name_sensor=" + name_sensor +
                   "&avg=" + String(avg) +
                   "&is_running=" + String(is_running) +
                   "&id_plants=" + String(test_plant_id);
  http.begin(client, String(my_endpoint) + "report_sensor_data?" + dataUrl);
  http.end();
}

String GetState() {
  HTTPClient http;
  http.begin(client, String(my_endpoint) + "state");
  String json = (http.GET() == HTTP_CODE_OK) ? http.getString() : "{\"state\":\"-1\",\"timeStamp\":\"0\"}";
  Serial.println(json);
  http.end();
  return json;
}

String getJsonData(String state) {
  HTTPClient http;
  http.begin(client, String(my_endpoint) + "dataMode?state=" + state);
  String json = (http.GET() == HTTP_CODE_OK) ? http.getString() : "";
  Serial.println(json);
  http.end();
  return json;
}

