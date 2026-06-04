Raspberry Pi 5 Deployment Guide (Scoreboard App)
1) Hardware + OS Prereqs
Raspberry Pi 5 with Raspberry Pi OS (64-bit, Bookworm recommended)
TV connected to Pi via HDMI (for /display)
Tablet/phone on same network (for /controller)
Network access between devices on port 3000
2) Install system packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl build-essential
3) Install Node.js (LTS)
Your app uses Vite/React/TypeScript + Express. Use Node 20 LTS:

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
4) Get the app code on the Pi
cd ~
git clone <YOUR_REPO_URL> scoreboard-app
cd scoreboard-app/dev
(If repo already exists, use git pull instead.)

5) Install dependencies
npm install
6) Build + run in host mode (recommended)
This project serves built UI from Express in host mode (server/index.ts) on port 3000.

npm run build
npm run host
You should see:

Scoreboard host listening on http://0.0.0.0:3000
Open from any device on LAN:

TV display: http://<PI_IP>:3000/display
Tablet controller: http://<PI_IP>:3000/controller
Find Pi IP:

hostname -I
7) Run as a background service (systemd)
Create service file:

sudo nano /etc/systemd/system/scoreboard.service
Paste (update User and WorkingDirectory if needed):

[Unit]
Description=Scoreboard App Host
After=network.target
[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/scoreboard-app/dev
ExecStart=/usr/bin/npm run host
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
[Install]
WantedBy=multi-user.target
Enable/start:

sudo systemctl daemon-reload
sudo systemctl enable scoreboard
sudo systemctl start scoreboard
sudo systemctl status scoreboard
Logs:

journalctl -u scoreboard -f
8) Re-deploy updates
From app directory:

git pull
npm install
npm run build
sudo systemctl restart scoreboard
9) Optional: auto-open TV display on Pi boot (Chromium kiosk)
If the Pi is the TV host screen, configure autostart for Chromium to /display.

Create autostart file (for desktop session):

mkdir -p ~/.config/autostart
nano ~/.config/autostart/scoreboard-display.desktop
Paste:

[Desktop Entry]
Type=Application
Name=Scoreboard Display
Exec=chromium-browser --kiosk --incognito --disable-infobars http://localhost:3000/display
X-GNOME-Autostart-enabled=true
Reboot and verify kiosk launches:

sudo reboot
10) Networking / firewall checks
If you use UFW:

sudo ufw allow 3000/tcp
sudo ufw status
Ensure tablet and Pi are on same subnet and can ping each other.

11) Quick validation checklist
http://localhost:3000/display works on Pi
http://<PI_IP>:3000/controller works on tablet
Score/button updates reflect instantly on display
Service survives reboot (systemctl status scoreboard)
If you want, I can also give you a second version of this doc tailored for non-git deploy (copying files from Windows to Pi via SCP/WinSCP).