# 🐶 Autonomous Pet Feeder

A smart IoT-powered pet feeder developed for the **MREN 328: Signals and Systems** course at Queen’s University.  
It features mobile app control, real-time database communication, and Siri voice command integration for seamless pet care automation.

![Feeder Prototype](/images/pet_feeder_banner.png)

---

## 🚀 Overview

Designed to simplify pet feeding routines, this system combines hardware automation with cross-platform mobile development.  
It lets users feed pets manually, on a schedule, or using voice commands — even when they’re not home.

---

## 📸 Gallery

| iOS App UI | Feeder Hardware | Siri Voice Trigger |
|------------|------------------|---------------------|
| <img src="/assets/images/pet-feeder/main_menu.png" width="220"/> | <img src="/assets/images/pet-feeder/dog_feeder.jpg" width="220"/> | <img src="/assets/images/pet-feeder/siri_fed.png" width="220"/> |

| Pet Profile | Food Storage View | Dispense Confirmation |
|-------------|--------------------|-------------------------|
| <img src="/assets/images/pet-feeder/pet_profile.png" width="220"/> | <img src="/assets/images/pet-feeder/food_check.png" width="220"/> | <img src="/assets/images/pet-feeder/food_dispensed.png" width="220"/> |

---

## 🧩 Problem / 💡 Solution

**Problem:** Busy schedules and inconsistent feeding times lead to missed meals and unhealthy habits for pets.  
**Solution:** A connected feeder that works through an app or Siri, allowing remote, scheduled, or voice-triggered food dispensing — anytime, anywhere.

---

## ✨ Features

- 📱 iOS App Interface (React Native)
- 📡 Real-time updates via Firebase
- 🗣️ “Hey Siri, feed my dog” shortcut
- 🧠 Custom pet profiles + food level tracking
- 🔘 Hardware override with push-button

---

## 🧠 How It Works

1. **User Interface**  
   The app allows owners to create pet profiles, check food levels, and trigger feed events with a tap.

2. **Backend Logic**  
   Firebase Realtime Database syncs instantly with the Arduino board to trigger the stepper motor.

3. **Hardware System**  
   Arduino-based controller operates the feeder. The circuit includes a button for manual override.

4. **Voice Activation**  
   Siri Shortcuts send HTTP requests to update Firebase, triggering the feeder remotely via voice.

---

## 💻 Tech Stack

| Area             | Tools & Technologies                     |
|------------------|-------------------------------------------|
| Mobile App       | React Native, Swift (iOS Shortcuts)       |
| Backend          | Firebase Realtime Database                |
| Microcontroller  | Arduino Uno, Stepper Motor, Push Button   |
| Communication    | Siri Shortcuts + Firebase Event Listener  |

---

## 🛠️ Files & Structure

```bash
AutonomousPetFeeder/
├── app/                  # React Native frontend code
├── arduino/              # Arduino sketches for feeder motor
├── assets/               # App images and media
├── docs/                 # Engineering case study
└── README.md
```

---

## 👥 Team

- **Mousa Pirzada** – iOS app, Firebase integration, system design, Siri command implementation
- **Mustafa Hasan** – Circuitry, Arduino setup, motor driver configuration
- **Raihan Ahmed** – 3D printing, mechanical design, hardware assembly

---

## 🏛️ Course

> MREN 328 – Signals and Systems, Queen’s University, 2024

---

## 📖 Learn More

- [📄 Engineering Case Study](docs/pet-feeder-case-study.md)
- [📱 UI Screenshots](/assets/images/pet-feeder/)
- [🌐 GitHub Repo](https://github.com/20mup/AutonomousPetFeeder)

---

> _Made with circuits, code, and a lot of love for Milo._ 🐾
