# Scoreboard Controller Prototype

Simple scoreboard prototype for a host computer (Windows 11 PC or Raspberry Pi 5), a TV connected over HDMI, and a tablet controller over Wi-Fi.

## Tech Stack

- Node.js
- Express
- Socket.IO (WebSocket transport)
- React + TypeScript
- Vite

## Main Behavior

- Server maintains authoritative scoreboard state (`homeScore`, `visitorScore`).
- TV view displays live score from WebSocket updates.
- Tablet view sends score update commands over WebSocket.
- Both views stay synchronized in real time.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development mode (client + server):

   ```bash
   npm run dev
   ```

3. Open:
   - TV display: `http://<HOST_IP>:5173/display`
   - Tablet controller: `http://<HOST_IP>:5173/controller`

## Single-Host Runtime (Express serves built UI)

1. Build UI:

   ```bash
   npm run build
   ```

2. Start host server:

   ```bash
   npm run host
   ```

3. Open:
   - TV display: `http://<HOST_IP>:3000/display`
   - Tablet controller: `http://<HOST_IP>:3000/controller`

## Suggested Deployment Notes

- Connect TV to host via HDMI and open `/display` in full-screen browser mode.
- Set tablet browser to kiosk mode and open `/controller`.
- Keep host and tablet on the same Wi-Fi network.
- If needed, allow incoming firewall traffic on the selected app port.

HOW to RUN thIS

npm run dev

Then in a browser...enter thos adress  http://localhost:5173/
Then open the http://localhost:5173/display
Then open this:  http://localhost:5173/controller


[1]   ➜  Network: http://192.168.200.97:5173/