
#include <DHT.h>

#define DHTPIN 16       // פין שמחובר לחיישן DHT
#define DHTTYPE DHT11   // סוג החיישן: DHT11 או DHT22

#define lightSensor 33
#define humiditySensor 32


DHT dht(DHTPIN, DHTTYPE); // יצירת אובייקט DHT


void setup() {
  Serial.begin(115200);
  dht.begin(); // אתחול החיישן
  WiFi_Setup();
  }

 
void loop() {

  float temperature = dht.readTemperature(); // טמפרטורה
int light = analogRead(lightSensor);
int humidity =analogRead(humiditySensor);
Serial.print("temperatur = ");
Serial.println(temperature);

Serial.print("light = ");
Serial.println(light);

Serial.print("humidity = ");
Serial.println(humidity);
  delay(2500);
SendData(temperature, light, humidity);
}