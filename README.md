# 🐶 Autonomous Pet Feeder

A smart pet feeder system that combines hardware and software to automate feeding schedules for your furry friends. Powered by an Arduino-controlled dispenser and a custom-built mobile app, the system allows users to add pet profiles, set feeding times, and check food storage levels in real-time — all through a clean React Native interface.

<div align="center">
  <img src="images/feeder_preview.png" alt="Autonomous Pet Feeder Demo" width="500"/>
</div>

---

## 🚀 Features

- 📱 **Mobile App (React Native + Expo)**  
  Add pets, edit their details, view profiles, and set custom feeding times.

- 🍽 **Automated Food Dispensing**  
  Uses an Arduino and servo motor to dispense food on schedule via Ably-powered messages.

- 🧠 **Real-Time Messaging with Ably**  
  Ensures immediate communication between app and hardware for instant food delivery and status updates.

- 📦 **Food Storage Check**  
  Check current food levels and get alerts via the app interface.

---

## 🛠 Tech Stack

### Hardware
- Arduino UNO
- Servo Motor
- Real-time communication via Bluetooth (or wired serial)
- Power supply + custom enclosure

### Mobile App
- React Native with Expo
- Ably Realtime API
- AsyncStorage for persistent pet data
- Custom UI using images and fonts

---

## 📂 Project Structure

```
autonomous-pet-feeder/
├── hardware/                # Arduino servo control
│   └── DOG_FEEDER_FINAL.ino
├── mobile-app/              # Full mobile frontend
│   ├── App.js
│   ├── screens/
│   ├── services/
│   ├── assets/
│   ├── package.json
│   └── app.json
├── images/                  # Demo screenshots
├── videos/                  # (Optional) demo video
├── README.md
└── .gitignore
```

---

## 📷 Screenshots

| Home Screen             | Main Menu |
|------------------------|-----------|
| *Add screenshots here* | *...*     |
