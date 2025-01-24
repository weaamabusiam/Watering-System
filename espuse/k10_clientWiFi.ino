#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>

const char* ssid = "Kinneret College";
//const char* ssid = "";
const char* password = "";

WiFiClient client;

void WiFi_Setup() {
  WiFi.begin(ssid, password);
//  WiFi.begin(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("IP Address: ");
  Serial.println("WiFi Connected");
}

void SendData(float temperature,int light, int humidity) {
  HTTPClient http;
     // בניית כתובת URL עם הנתונים כפרמטרים
    String url = "http:// 192.168.56.1:4000/esp?";
    url += "temperature=" + String(temperature);
    url += "&light=" + String(light);
    url += "&humidity=" + String(humidity);

    // התחלת בקשת HTTP GET
    http.begin(client, url);
    int httpCode = http.GET();

    // בדיקת תגובת השרת
    if (httpCode > 0) {
      Serial.print("HTTP response code: ");
      Serial.println(httpCode);

      String response = http.getString(); // קריאת התגובה מהשרת
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error in GET request: ");
      Serial.println(httpCode);
    }

    http.end(); // סיום החיבור
  }
