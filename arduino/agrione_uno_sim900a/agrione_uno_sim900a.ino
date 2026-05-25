/*
 * AgriOne — Arduino UNO + SIM900A + DHT11 + Senzor Umiditate Sol + GPS NEO-6M (opțional)
 *
 * ===== HARDWARE =====
 *   - Arduino UNO
 *   - SIM900A GSM/GPRS (TX→pin 7, RX→pin 8)
 *   - DHT11 (data→pin 2)
 *   - Senzor umiditate sol digital FC-28 (DO→pin 4)
 *   - GPS NEO-6M (TX→pin 3) — OPȚIONAL, codul merge si fara el
 *   - Cartela SIM cu date mobile in modulul SIM900A
 *
 * ===== CABLARE GPS NEO-6M (optional) =====
 *   NEO-6M TX  → Arduino pin 3   (SoftwareSerial RX)
 *   NEO-6M RX  → neconectat       (nu trimitem comenzi la GPS)
 *   NEO-6M GND → Arduino GND
 *   NEO-6M VCC → Arduino 5V (verifica eticheta modulului — unele suporta doar 3.3V!)
 *
 *   ATENTIE: GPS-ul trebuie OUTDOOR pentru a prinde fix. Prima fixare (cold start)
 *   poate dura 2-5 minute. LED-ul clipeste 1/sec cand are fix valid.
 *
 *   OPTIONAL — control alimentare GPS prin MOSFET (economie energie):
 *     Pin 6 Arduino → Gate MOSFET (IRLML6344)
 *     Source MOSFET → GND
 *     Drain MOSFET  → GND-ul GPS-ului
 *     Daca folosesti MOSFET, decomenteaza GPS_POWER_PIN mai jos.
 *
 * ===== CABLARE SIM900A =====
 *   SIM900A TX   → Arduino pin 7  (SoftwareSerial RX)
 *   SIM900A RX   → Arduino pin 8  (SoftwareSerial TX) prin DIVISOR DE TENSIUNE!
 *                   Arduino pin 8 → rezistor 1kΩ → SIM900A RX
 *                                                → rezistor 2kΩ → GND
 *                   (SIM900A e la 3.3V logic, Arduino la 5V — fara divisor arzi modulul!)
 *   SIM900A GND  → Arduino GND
 *   SIM900A VCC  → Sursa EXTERNA 5V / 2A (NU din Arduino 5V — nu are curent suficient!)
 *
 * ===== CABLARE DHT11 =====
 *   VCC  → 5V
 *   DATA → pin 2 (cu rezistor pull-up 10kΩ la 5V)
 *   GND  → GND
 *
 * ===== CABLARE SENZOR SOL (FC-28) =====
 *   VCC → 5V
 *   DO  → pin 4 (iesire digitala: HIGH = uscat, LOW = umed)
 *   GND → GND
 *   (Daca senzorul are si pin AO — analogic — poti conecta la A0 pentru procente exacte.
 *    Vezi SOIL_USE_ANALOG mai jos.)
 *
 * ===== CONFIGURARE =====
 *   1. Pune SENSOR_CODE — ACELASI cod pe care l-ai asociat in aplicatia web AgriOne
 *   2. Pune SERVER_HOST — IP-ul public al serverului (NU localhost!)
 *   3. Pune IOT_KEY — sa fie IDENTIC cu IOT_MASTER_KEY din backend/.env
 *   4. Pune APN-ul operatorului tau (Orange/Vodafone = "internet", Digi = "broadband")
 *
 * ===== FLUX =====
 *   La fiecare SEND_INTERVAL_MS (default 5 min):
 *     Citeste DHT11 + senzor sol → construieste JSON →
 *     trimite HTTP POST la /api/iot/ingest prin GPRS (AT commands) →
 *     backend-ul salveaza in PostgreSQL → datele apar in web UI
 */

#include <SoftwareSerial.h>
#include <DHT.h>
#include <TinyGPS++.h>   // Install via Arduino IDE → Library Manager → "TinyGPS++"

// ==================== CONFIGURARE — MODIFICA AICI ====================

// Codul senzorului — TREBUIE sa fie IDENTIC cu cel din aplicatia web AgriOne
// (Dashboard → Terenuri → Asociaza Senzor → codul pe care l-ai ales)
const char* SENSOR_CODE = "AGRI-FARM001";

// Serverul backend AgriOne
// VARIANTA A (ngrok — pentru testare):
//   Ruleaza "ngrok http 5000" pe laptop → copiaza hostname-ul FARA https://
//   Exemplu: "a1b2c3d4.ngrok-free.app"
// VARIANTA B (VPS — pentru productie):
//   IP-ul public al serverului, ex: "185.123.45.67"
const char* SERVER_HOST = "PUNE_NGROK_HOSTNAME_AICI";  // <-- MODIFICA!
const int   SERVER_PORT = 80;                          // ngrok=80, VPS=5000
const char* SERVER_PATH = "/api/iot/ingest";

// Cheia IoT — IDENTICA cu IOT_MASTER_KEY din backend/.env
const char* IOT_KEY = "iot_dev_key_change_me";

// APN-ul operatorului de la cartela SIM:
//   Orange Romania = "internet"  |  Vodafone Romania = "internet"
//   Digi Romania   = "broadband" |  Telekom Romania  = "broadband"
const char* APN = "broadband";

// ----------- Pini senzori -----------
#define DHTPIN        2       // Pinul DATA al DHT11
#define DHTTYPE       DHT11   // DHT11 (nu DHT22!)
#define SOIL_DIG_PIN  4       // Pinul DO al senzorului de sol (digital)

// ----------- Senzor sol: digital vs analog -----------
// Senzorul tau FC-28 are iesire digitala (DO) pe pin 4:
//   HIGH = sol uscat → trimitem 0%
//   LOW  = sol umed  → trimitem 100%
//
// Daca vrei PROCENTE exacte (0-100%), conecteaza si pinul AO la A0
// si seteaza SOIL_USE_ANALOG pe true:
#define SOIL_USE_ANALOG   false   // true = citeste analog de pe A0
#define SOIL_ANALOG_PIN   A0      // doar daca SOIL_USE_ANALOG = true
#define SOIL_DRY_VALUE    1023    // valoare ADC in aer (calibreaza!)
#define SOIL_WET_VALUE    300     // valoare ADC in apa (calibreaza!)

// ----------- Pini SIM900A -----------
#define SIM_TX_PIN    7   // SIM900A TX → Arduino pin 7
#define SIM_RX_PIN    8   // SIM900A RX → Arduino pin 8 (prin divisor tensiune!)

// ----------- Pini GPS NEO-6M (optional) -----------
#define GPS_RX_PIN    3   // NEO-6M TX → Arduino pin 3
// #define GPS_POWER_PIN 6   // Decomenteaza daca folosesti MOSFET pentru pornit/oprit GPS
#define GPS_FIX_TIMEOUT_MS    90000UL   // Cat astept dupa fix-ul GPS la pornire (90s)
#define GPS_REFIX_INTERVAL_MS 86400000UL // Refac fix-ul o data pe zi (24h) pentru detectie mutare

// ----------- Interval trimitere -----------
#define SEND_INTERVAL_MS  30000UL  // 30 secunde (pentru testare)
// Pentru productie schimba in 300000UL (5 minute)

// ==================== SFARSIT CONFIGURARE ====================

SoftwareSerial sim900(SIM_TX_PIN, SIM_RX_PIN);
SoftwareSerial gpsSerial(GPS_RX_PIN, -1);  // -1 = nu transmitem catre GPS
TinyGPSPlus gps;
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSend = 0;
unsigned long lastGpsFixAt = 0;
bool gprsReady = false;

// Ultima fixare GPS valida (se trimite la fiecare uplink daca e disponibila)
float gpsLat = 0.0;
float gpsLng = 0.0;
bool gpsValid = false;

void setup() {
  Serial.begin(9600);
  sim900.begin(9600);
  gpsSerial.begin(9600);
  dht.begin();

  // Senzor sol digital
  pinMode(SOIL_DIG_PIN, INPUT);

#ifdef GPS_POWER_PIN
  pinMode(GPS_POWER_PIN, OUTPUT);
  digitalWrite(GPS_POWER_PIN, LOW);  // GPS oprit initial
#endif

  Serial.println(F("=== AgriOne IoT ==="));
  Serial.println(F("DHT11 + Senzor Sol + SIM900A + GPS"));

  // Incerc sa obtin un fix GPS inainte de orice. Daca esueaza, continuam fara — backend-ul accepta.
  acquireGpsFix();

  Serial.println(F("Astept SIM900A sa porneasca..."));
  sim900.listen();
  delay(5000);  // SIM900A are nevoie de cateva secunde sa booteze

  // Initializare SIM900A + GPRS
  gprsReady = initSIM900();

  if (gprsReady) {
    Serial.println(F("GPRS CONECTAT! Incep citirile."));
  } else {
    Serial.println(F("GPRS ESUAT. Reincercare la urmatoarea citire."));
  }

  // Prima citire imediat
  lastSend = millis() - SEND_INTERVAL_MS;
}

void loop() {
  unsigned long now = millis();

  if (now - lastSend >= SEND_INTERVAL_MS) {
    lastSend = now;

    // ===== REFRESH PERIODIC GPS (1x / 24h) =====
    // Detecteaza daca Arduino-ul a fost mutat in afara terenului. Skip daca n-am avut niciodata fix.
    if (gpsValid && (now - lastGpsFixAt >= GPS_REFIX_INTERVAL_MS)) {
      Serial.println(F("Refac fix GPS periodic..."));
      acquireGpsFix();
      sim900.listen();
    }

    // ===== CITIRE SENZORI =====
    float temperature = dht.readTemperature();   // Celsius
    float humidity = dht.readHumidity();         // %

    // Citire umiditate sol
    float soilPct = readSoilMoisture();

    // Verifica daca DHT11 a citit corect
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println(F("EROARE: DHT11 nu raspunde!"));
      Serial.println(F("Verifica cablarea: DATA→pin 2, pull-up 10k la 5V"));
      return;
    }

    // Afisare in Serial Monitor (pentru debug)
    Serial.println(F("--- Citire senzori ---"));
    Serial.print(F("  Temperatura: ")); Serial.print(temperature, 1); Serial.println(F(" °C"));
    Serial.print(F("  Umiditate:   ")); Serial.print(humidity, 1);    Serial.println(F(" %"));
    Serial.print(F("  Sol:         ")); Serial.print(soilPct, 0);     Serial.println(F(" %"));

    // ===== TRIMITERE DATE =====
    if (!gprsReady) {
      Serial.println(F("Reincerc conexiunea GPRS..."));
      gprsReady = initSIM900();
    }

    if (gprsReady) {
      bool ok = sendReading(temperature, humidity, soilPct);
      if (ok) {
        Serial.println(F("TRIMIS CU SUCCES!"));
      } else {
        Serial.println(F("Trimitere esuata. Reincercare la urmatorul ciclu."));
        gprsReady = false;  // Forteaza reconectare GPRS
      }
    } else {
      Serial.println(F("GPRS indisponibil, datele nu au fost trimise."));
    }

    Serial.println(F("---"));
  }
}

// ==================== CITIRE SOL ====================

float readSoilMoisture() {
#if SOIL_USE_ANALOG
  // Mod ANALOG — procente exacte 0-100%
  int raw = analogRead(SOIL_ANALOG_PIN);
  float pct = (float)(SOIL_DRY_VALUE - raw) / (float)(SOIL_DRY_VALUE - SOIL_WET_VALUE) * 100.0;
  if (pct < 0.0) pct = 0.0;
  if (pct > 100.0) pct = 100.0;
  return pct;
#else
  // Mod DIGITAL — doar uscat (0%) sau umed (100%)
  int state = digitalRead(SOIL_DIG_PIN);
  if (state == HIGH) {
    Serial.println(F("  [Sol: USCAT]"));
    return 0.0;    // Uscat
  } else {
    Serial.println(F("  [Sol: UMED]"));
    return 100.0;  // Umed
  }
#endif
}

// ==================== FUNCTII SIM900A ====================

bool sendATCommand(const char* cmd, const char* expected, unsigned long timeout) {
  sim900.println(cmd);
  return waitForResponse(expected, timeout);
}

bool waitForResponse(const char* expected, unsigned long timeout) {
  unsigned long start = millis();
  String response = "";

  while (millis() - start < timeout) {
    while (sim900.available()) {
      char c = sim900.read();
      response += c;
    }
    if (response.indexOf(expected) >= 0) {
      return true;
    }
    if (response.indexOf("ERROR") >= 0) {
      Serial.print(F("AT EROARE: "));
      Serial.println(response);
      return false;
    }
  }

  Serial.print(F("AT TIMEOUT: "));
  Serial.println(response);
  return false;
}

String readSIM900(unsigned long timeout) {
  unsigned long start = millis();
  String response = "";
  while (millis() - start < timeout) {
    while (sim900.available()) {
      char c = sim900.read();
      response += c;
    }
    if (response.length() > 0 && millis() - start > 500) break;
  }
  response.trim();
  return response;
}

bool initSIM900() {
  // 1. Test comunicare
  if (!sendATCommand("AT", "OK", 2000)) {
    Serial.println(F("SIM900A nu raspunde! Verifica cablarea si alimentarea."));
    return false;
  }

  // Dezactiveaza echo
  sendATCommand("ATE0", "OK", 1000);

  // 2. Verifica cartela SIM
  if (!sendATCommand("AT+CPIN?", "READY", 5000)) {
    Serial.println(F("Cartela SIM nu e detectata! Verifica daca e introdusa corect."));
    return false;
  }
  Serial.println(F("Cartela SIM: OK"));

  // 3. Asteptam inregistrarea in retea
  Serial.println(F("Astept semnal de retea..."));
  for (int i = 0; i < 30; i++) {
    sim900.println("AT+CREG?");
    delay(1000);
    String resp = readSIM900(2000);
    // ,1 = inregistrat retea proprie, ,5 = inregistrat roaming
    if (resp.indexOf(",1") >= 0 || resp.indexOf(",5") >= 0) {
      Serial.println(F("Retea: CONECTAT"));
      break;
    }
    if (i == 29) {
      Serial.println(F("Timeout retea! Verifica daca cartela SIM e activa si are semnal."));
      return false;
    }
  }

  // 4. Configureaza GPRS (internet prin date mobile)
  // Inchide orice conexiune existenta
  sendATCommand("AT+CIPSHUT", "SHUT OK", 5000);

  // Mod conexiune singulara
  sendATCommand("AT+CIPMUX=0", "OK", 2000);

  // Seteaza APN-ul operatorului
  sim900.print("AT+CSTT=\"");
  sim900.print(APN);
  sim900.println("\"");
  if (!waitForResponse("OK", 5000)) {
    Serial.print(F("APN \""));
    Serial.print(APN);
    Serial.println(F("\" nu a fost acceptat!"));
    return false;
  }

  // Porneste conexiunea GPRS
  if (!sendATCommand("AT+CIICR", "OK", 30000)) {
    Serial.println(F("Conexiune GPRS esuata! Verifica daca cartela are date mobile active."));
    return false;
  }

  // Obtine adresa IP
  delay(1000);
  sim900.println("AT+CIFSR");
  String ip = readSIM900(5000);
  Serial.print(F("IP obtinut: "));
  Serial.println(ip);

  if (ip.indexOf("ERROR") >= 0 || ip.length() < 7) {
    Serial.println(F("Nu s-a obtinut IP! Verifica APN-ul si creditul/datele pe cartela."));
    return false;
  }

  Serial.println(F("GPRS: CONECTAT"));
  return true;
}

bool sendReading(float tempC, float humPct, float soilPct) {
  Serial.println(F("Trimit date catre AgriOne..."));

  // Construim JSON-ul manual (nu folosim ArduinoJson ca sa economisim RAM)
  String json = "{\"sensorCode\":\"";
  json += SENSOR_CODE;
  json += "\",\"temperatureC\":";
  json += String(tempC, 1);
  json += ",\"humidityPct\":";
  json += String(humPct, 1);
  json += ",\"soilMoisturePct\":";
  json += String(soilPct, 1);

  // Adauga coordonatele GPS doar daca avem fix valid.
  // Backend-ul accepta payload-ul si fara aceste campuri (backward-compatible).
  if (gpsValid) {
    json += ",\"lat\":";
    json += String(gpsLat, 6);
    json += ",\"lng\":";
    json += String(gpsLng, 6);
    json += ",\"locValid\":true";
  }

  json += "}";

  // Deschide conexiune TCP catre server
  sim900.print("AT+CIPSTART=\"TCP\",\"");
  sim900.print(SERVER_HOST);
  sim900.print("\",\"");
  sim900.print(SERVER_PORT);
  sim900.println("\"");

  if (!waitForResponse("CONNECT OK", 15000)) {
    Serial.println(F("Conexiune TCP esuata!"));
    sendATCommand("AT+CIPCLOSE", "OK", 3000);
    return false;
  }

  // Construim cererea HTTP POST
  String http = "POST ";
  http += SERVER_PATH;
  http += " HTTP/1.1\r\n";
  http += "Host: ";
  http += SERVER_HOST;
  http += "\r\n";
  http += "Content-Type: application/json\r\n";
  http += "x-iot-key: ";
  http += IOT_KEY;
  http += "\r\n";
  http += "ngrok-skip-browser-warning: true\r\n";
  http += "Content-Length: ";
  http += String(json.length());
  http += "\r\n";
  http += "Connection: close\r\n";
  http += "\r\n";
  http += json;

  // Trimitem datele
  sim900.print("AT+CIPSEND=");
  sim900.println(http.length());

  if (!waitForResponse(">", 5000)) {
    Serial.println(F("CIPSEND prompt esuat"));
    sendATCommand("AT+CIPCLOSE", "OK", 3000);
    return false;
  }

  sim900.print(http);

  if (!waitForResponse("SEND OK", 10000)) {
    Serial.println(F("Trimitere esuata"));
    sendATCommand("AT+CIPCLOSE", "OK", 3000);
    return false;
  }

  // Citim raspunsul serverului
  String response = readSIM900(10000);
  Serial.print(F("Raspuns server: "));
  Serial.println(response);

  // Inchidem conexiunea
  sendATCommand("AT+CIPCLOSE", "OK", 3000);

  // Verificam codul HTTP
  if (response.indexOf("201") >= 0) {
    Serial.println(F("SUCCES — Citire salvata in baza de date!"));
    return true;
  } else if (response.indexOf("200") >= 0) {
    Serial.println(F("OK — Serverul a raspuns."));
    return true;
  } else {
    Serial.print(F("Cod raspuns neasteptat. Verifica ca SENSOR_CODE si IOT_KEY sunt corecte."));
    return false;
  }
}

// ==================== FUNCTII GPS ====================

/*
 * Incearca sa obtina un fix GPS valabil in maxim GPS_FIX_TIMEOUT_MS milisecunde.
 * Folosirea: comuta SoftwareSerial pe GPS (gpsSerial.listen()), citeste bytes,
 * parseaza cu TinyGPS++, opreste cand are fix proaspat (< 2s vechime).
 *
 * IMPORTANT: dupa apel TREBUIE sa apelezi sim900.listen() inainte de a folosi SIM900A,
 * altfel SoftwareSerial-ul SIM-ului nu mai primeste date!
 *
 * Daca nu prinde fix in timeout, lasa gpsValid neschimbat — datele se trimit
 * fara coordonate, backend-ul accepta.
 */
bool acquireGpsFix() {
  Serial.println(F("--- GPS fix ---"));

#ifdef GPS_POWER_PIN
  // Aprinde GPS-ul (MOSFET) si lasa-l sa booteze
  digitalWrite(GPS_POWER_PIN, HIGH);
  delay(1000);
#endif

  gpsSerial.listen();
  delay(100);

  unsigned long start = millis();
  unsigned long lastReport = 0;
  bool gotFix = false;

  while (millis() - start < GPS_FIX_TIMEOUT_MS) {
    while (gpsSerial.available() > 0) {
      gps.encode(gpsSerial.read());
    }

    if (gps.location.isValid() && gps.location.age() < 2000) {
      gpsLat = gps.location.lat();
      gpsLng = gps.location.lng();
      gpsValid = true;
      lastGpsFixAt = millis();
      gotFix = true;

      Serial.print(F("  Fix GPS: "));
      Serial.print(gpsLat, 6);
      Serial.print(F(", "));
      Serial.print(gpsLng, 6);
      Serial.print(F(" (sateliti: "));
      Serial.print(gps.satellites.value());
      Serial.println(F(")"));
      break;
    }

    // Status la fiecare 10 secunde
    if (millis() - lastReport > 10000) {
      lastReport = millis();
      Serial.print(F("  Astept fix... sateliti vizibili: "));
      Serial.println(gps.satellites.value());
    }
  }

  if (!gotFix) {
    Serial.println(F("  Fix GPS esuat (timeout). Continui fara verificare locatie."));
    Serial.println(F("  Verifica: GPS conectat? Antena outdoor? LED GPS clipeste 1/sec?"));
  }

#ifdef GPS_POWER_PIN
  // Oprim GPS-ul pentru economie de energie pana la urmatorul refresh
  digitalWrite(GPS_POWER_PIN, LOW);
#endif

  Serial.println(F("--- GPS fix end ---"));
  return gotFix;
}
