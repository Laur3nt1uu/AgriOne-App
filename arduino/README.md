# AgriOne Arduino / IoT

This folder contains example sketches to send sensor readings to the AgriOne backend.

## Backend ingest endpoint

- URL: `POST /api/iot/ingest`
- Header: `x-iot-key: <IOT_MASTER_KEY>` (from `backend/.env`)
- Body (JSON):

```json
{
  "sensorCode": "AGRI-123456",
  "temperatureC": 23.4,
  "humidityPct": 51,
  "recordedAt": "2026-02-25T10:30:00.000Z"
}
```

`recordedAt` is optional (server will use current time if missing).

## Arduino UNO (CH340) note

Arduino UNO (and UNO clones with CH340) does not have WiFi.

Recommended local-dev flow:
- Arduino UNO reads sensors and prints **one JSON per line** over USB Serial.
- A small script on the PC reads the COM port and forwards the JSON to the backend `POST /api/iot/ingest`.

Example sketch:
- `arduino/agrione_uno_dht22_serial/agrione_uno_dht22_serial.ino`

Serial bridge:
- `tools/agrione-serial-bridge/bridge.mjs`

Run bridge (Windows example):
- `cd tools/agrione-serial-bridge`
- `npm install`
- `node bridge.mjs --port COM5 --baud 115200 --url http://localhost:5000/api/iot/ingest --key <IOT_MASTER_KEY>`

## ESP32 note

If you use an ESP32/ESP8266 (WiFi), you can post directly to the backend.
Example sketch:
- `arduino/agrione_esp32_dht22/agrione_esp32_dht22.ino`

## Important local networking note

Microcontrollers cannot reach `http://localhost:5000` (that's *their* localhost).
Use your PC LAN IP instead, e.g. `http://192.168.0.23:5000`.

If requests fail:
- Ensure backend is running and reachable
- Allow port `5000` through Windows Firewall (Private network)
- Make sure the sensor exists in the app/DB; otherwise backend returns `SENSOR_NOT_REGISTERED`
