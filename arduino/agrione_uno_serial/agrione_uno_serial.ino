

#include <DHT.h>

// ==================== CONFIGURARE ====================
const char* SENSOR_CODE = "AGRI-FARM001"; 
#define DHTPIN        2       // Pinul DATA al DHT11
#define DHTTYPE       DHT11   // DHT11
#define SOIL_DIG_PIN  4       // Pinul DO al senzorului de sol

#define SOIL_USE_ANALOG   false
#define SOIL_ANALOG_PIN   A0
#define SOIL_DRY_VALUE    1023
#define SOIL_WET_VALUE    300

#define READ_INTERVAL 10000 


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
