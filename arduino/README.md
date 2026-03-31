# AgriOne — Ghid Complet Arduino + SIM900A

## Cuprins
1. [Hardware necesar](#hardware-necesar)
2. [Schema de conectare](#schema-de-conectare)
3. [Fluxul de date (Arduino → Web)](#fluxul-de-date)
4. [Pas cu pas: Configurare completă](#configurare-completa)
5. [Testare fără SIM (USB Serial Bridge)](#testare-fara-sim)
6. [Testare cu cURL (fără Arduino)](#testare-curl)
7. [Troubleshooting](#troubleshooting)

---

## Hardware necesar

| Componentă | Pin Arduino | Notă |
|---|---|---|
| **DHT11** (temperatură + umiditate aer) | Pin 2 (DATA) | Pull-up 10kΩ la 5V |
| **Senzor umiditate sol FC-28** | Pin 4 (DO) | Digital: HIGH=uscat, LOW=umed |
| **SIM900A** (modul GSM/GPRS) | Pin 7 (TX), Pin 8 (RX) | Alimentare EXTERNĂ 5V/2A! |
| **Cartela SIM** cu date mobile | În SIM900A | PIN dezactivat |

---

## Schema de conectare

```
                    ARDUINO UNO
                   ┌───────────────┐
                   │               │
  DHT11 DATA ──────┤ Pin 2         │
                   │               │
  Sol FC-28 DO ────┤ Pin 4         │
                   │               │
  SIM900A TX ──────┤ Pin 7  (RX)   │
                   │               │
  SIM900A RX ◄─┬──┤ Pin 8  (TX)   │     ⚠ DIVISOR TENSIUNE!
               │   │               │     Pin 8 → 1kΩ → SIM RX
              2kΩ  │  5V ──────────┤──── DHT VCC, Sol VCC
               │   │               │
              GND  │  GND ─────────┤──── DHT GND, Sol GND, SIM GND
                   └───────────────┘

  SIM900A VCC → SURSA EXTERNĂ 5V / 2A (NU din Arduino!)
  SIM900A GND → GND comun cu Arduino
```

**⚠ IMPORTANT:**
- SIM900A consumă **2A vârf** la transmisie. Nu se alimentează din pinul 5V al Arduino (max 500mA)!
- SIM900A lucrează la **3.3V logic** — pe pinul RX trebuie **divisor de tensiune** (1kΩ + 2kΩ)
- Fără divisor de tensiune pe RX → arzi modulul SIM

---

## Fluxul de date

```
┌──────────────────┐     GPRS (AT commands)     ┌─────────────────┐
│  ARDUINO UNO     │ ──── HTTP POST ──────────► │  BACKEND NODE   │
│  DHT11 + Sol     │     /api/iot/ingest        │  Express.js     │
│  + SIM900A       │     x-iot-key: ...         │  Port 5000      │
└──────────────────┘     Content-Type: json     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │  PostgreSQL     │
                                                │  Tabel: readings│
                                                │  + sensors      │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │  FRONTEND React │
                                                │  Dashboard      │
                                                │  → Senzori      │
                                                │  → Grafice      │
                                                └─────────────────┘
```

**Ce trimite Arduino (JSON):**
```json
{
  "sensorCode": "AGRI-FARM01",
  "temperatureC": 24.3,
  "humidityPct": 62.0,
  "soilMoisturePct": 100.0
}
```

**Header necesar:** `x-iot-key: <IOT_MASTER_KEY>` (din `backend/.env`)

- `soilMoisturePct` — opțional (senzorul digital trimite 0% = uscat sau 100% = umed)
- `recordedAt` — opțional (serverul folosește ora curentă dacă lipsește)

---

## Configurare completă

### Pasul 1: Configurare în aplicația web AgriOne

1. Deschide aplicația web → **Login**
2. Mergi la **Terenuri** → Alege un teren → **Detalii**
3. Click **Asociază Senzor** (sau "Pair Board")
4. Introdu un **cod** pe care ți-l alegi tu (ex: `AGRI-FARM01`)
   - Acest cod face legătura: Arduino ↔ Senzor din DB ↔ Teren
   - Trebuie să fie **IDENTIC** pe web și în sketch-ul Arduino

### Pasul 2: Configurare sketch Arduino

Deschide `arduino/agrione_uno_sim900a/agrione_uno_sim900a.ino` în Arduino IDE.

Modifică **4 constante**:

```cpp
// 1. Codul senzorului — IDENTIC cu cel din aplicația web
const char* SENSOR_CODE = "AGRI-FARM01";

// 2. IP-ul serverului — IP public sau domeniu (NU localhost!)
const char* SERVER_HOST = "192.168.1.100";  // sau "agri.example.com"
const int   SERVER_PORT = 5000;

// 3. Cheia IoT — IDENTICA cu IOT_MASTER_KEY din backend/.env
const char* IOT_KEY = "iot_dev_key_change_me";

// 4. APN-ul operatorului de la cartela SIM
const char* APN = "internet";  // Orange/Vodafone: "internet", Digi: "broadband"
```

### Pasul 3: Upload pe placă

1. Arduino IDE → **Tools → Board → Arduino UNO**
2. Arduino IDE → **Tools → Port → COMx** (portul plăcii)
3. Click **Upload** (→)
4. Deschide **Serial Monitor** (Ctrl+Shift+M) la **9600 baud**
5. Ar trebui să vezi:
```
=== AgriOne IoT ===
DHT11 + Senzor Sol + SIM900A
Astept SIM900A sa porneasca...
Cartela SIM: OK
Retea: CONECTAT
GPRS: CONECTAT
--- Citire senzori ---
  Temperatura: 24.3 °C
  Umiditate:   62.0 %
  [Sol: UMED]
  Sol:         100 %
Trimit date catre AgriOne...
SUCCES — Citire salvata in baza de date!
```

### Pasul 4: Verificare în web UI

1. Deschide aplicația web → **Terenuri** → terenul asociat → **Senzori / Istoric**
2. Vei vedea graficul cu temperatură, umiditate aer, și umiditate sol
3. Datele se actualizează la fiecare 5 minute (configurabil în sketch)

---

## Testare fără SIM (USB Serial Bridge)

Dacă nu ai încă SIM900A funcțional sau vrei să testezi rapid:

### 1. Upload sketch-ul serial

Deschide `arduino/agrione_uno_serial/agrione_uno_serial.ino` în Arduino IDE.
Setează `SENSOR_CODE` identic cu cel din aplicația web.
Upload pe placă.

### 2. Rulează bridge-ul pe PC

```bash
cd tools/agrione-serial-bridge
npm install
node bridge.mjs --port COM5 --key iot_dev_key_change_me
```

Înlocuiește:
- `COM5` cu portul tău (vezi Arduino IDE → Tools → Port)
- `iot_dev_key_change_me` cu valoarea din `backend/.env` → `IOT_MASTER_KEY`

Bridge-ul citește JSON de pe Serial USB și face POST la backend.

---

## Testare cu cURL (fără Arduino)

Poți testa endpoint-ul backend fără Arduino, direct din terminal:

```bash
curl -X POST http://localhost:5000/api/iot/ingest \
  -H "Content-Type: application/json" \
  -H "x-iot-key: iot_dev_key_change_me" \
  -d '{"sensorCode":"AGRI-FARM01","temperatureC":24.3,"humidityPct":62.0,"soilMoisturePct":100.0}'
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/iot/ingest" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"x-iot-key"="iot_dev_key_change_me"} `
  -Body '{"sensorCode":"AGRI-FARM01","temperatureC":24.3,"humidityPct":62.0,"soilMoisturePct":100.0}'
```

Dacă vezi `201 Created` → funcționează. Datele apar imediat în web UI.

---

## APN-uri operatori România

| Operator | APN |
|---|---|
| Orange | `internet` |
| Vodafone | `internet` sau `live.vodafone.com` |
| Digi (RCS-RDS) | `broadband` |
| Telekom | `internet` |

---

## Troubleshooting

| Problemă | Cauză | Soluție |
|---|---|---|
| `SIM900A nu raspunde!` | Alimentare insuficientă | Folosește sursă externă 5V / 2A |
| `Cartela SIM nu e detectata!` | SIM greșit introdusă sau PIN activ | Dezactivează PIN din telefon, reintrodu SIM |
| `Timeout retea!` | Fără semnal, SIM expirată | Verifică SIM activă + semnal GSM în zonă |
| `Conexiune GPRS esuata!` | APN greșit sau fără date mobile | Verifică APN-ul operatorului, credit/date pe SIM |
| `Conexiune TCP esuata!` | IP server greșit sau firewall | Verifică IP, port, și firewall (port 5000 deschis) |
| `HTTP 401` | Cheie IoT greșită | `IOT_KEY` din sketch = `IOT_MASTER_KEY` din `.env` |
| `HTTP 404 SENSOR_NOT_REGISTERED` | Cod senzor neasociat | Asociază senzorul în web UI mai întâi |
| `DHT11 nu raspunde!` | Cablare greșită | Verifică: DATA→pin 2, pull-up 10kΩ→5V, GND→GND |
| `localhost` nu merge de pe Arduino | Normal — localhost = placa | Folosește IP LAN: `192.168.x.x`, port 5000 deschis în firewall |
