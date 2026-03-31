/*
 * AgriOne — Arduino UNO + DHT11 + Senzor Sol (USB Serial)
 *
 * Versiune pentru TESTARE — fara SIM900A!
 * Trimite date JSON pe Serial USB → bridge.mjs le trimite la backend.
 *
 * Hardware:
 *   - Arduino UNO
 *   - DHT11 (data → pin 2, cu pull-up 10kΩ la 5V)
 *   - Senzor umiditate sol digital FC-28 (DO → pin 4)
 *
 * Utilizare:
 *   1. Upload acest sketch pe Arduino
 *   2. Ruleaza bridge-ul pe PC:
 *      cd tools/agrione-serial-bridge
 *      npm install
 *      node bridge.mjs --port COM5 --key iot_dev_key_change_me
 *      (inlocuieste COM5 cu portul tau — vezi Arduino IDE → Tools → Port)
 */

#include <DHT.h>

// ==================== CONFIGURARE ====================
const char* SENSOR_CODE = "AGRI-CHANGE-ME";  // Identic cu cel din aplicatia AgriOne
#define DHTPIN        2       // Pinul DATA al DHT11
#define DHTTYPE       DHT11   // DHT11
#define SOIL_DIG_PIN  4       // Pinul DO al senzorului de sol (digital)

// Daca vrei citiri analog in procente, conecteaza AO la A0 si seteaza true:
#define SOIL_USE_ANALOG   false
#define SOIL_ANALOG_PIN   A0
#define SOIL_DRY_VALUE    1023
#define SOIL_WET_VALUE    300

#define READ_INTERVAL 10000   // 10 secunde (bridge-ul trimite fiecare citire)
// ==================== SFARSIT CONFIGURARE ====================

DHT dht(DHTPIN, DHTTYPE);
unsigned long lastRead = 0;

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(SOIL_DIG_PIN, INPUT);
  delay(2000);
  Serial.println("{\"status\":\"AgriOne senzor pornit\"}");
}

void loop() {
  unsigned long now = millis();

  if (now - lastRead >= READ_INTERVAL) {
    lastRead = now;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("{\"error\":\"DHT11 nu raspunde\"}");
      return;
    }

    // Citire umiditate sol
    float soilPct;
#if SOIL_USE_ANALOG
    int raw = analogRead(SOIL_ANALOG_PIN);
    soilPct = (float)(SOIL_DRY_VALUE - raw) / (float)(SOIL_DRY_VALUE - SOIL_WET_VALUE) * 100.0;
    if (soilPct < 0.0) soilPct = 0.0;
    if (soilPct > 100.0) soilPct = 100.0;
#else
    int state = digitalRead(SOIL_DIG_PIN);
    soilPct = (state == HIGH) ? 0.0 : 100.0;  // HIGH = uscat, LOW = umed
#endif

    // Trimite o linie JSON — bridge.mjs o citeste si o trimite la backend
    Serial.print("{\"sensorCode\":\"");
    Serial.print(SENSOR_CODE);
    Serial.print("\",\"temperatureC\":");
    Serial.print(temperature, 1);
    Serial.print(",\"humidityPct\":");
    Serial.print(humidity, 1);
    Serial.print(",\"soilMoisturePct\":");
    Serial.print(soilPct, 1);
    Serial.println("}");
  }
}
