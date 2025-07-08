# 🦖 Jurassic Rescue Robot – BIG WHEELS

An award-winning autonomous + manually controlled robot designed for a Jurassic Park-themed rescue mission. Built as part of the MREN 303 course, the robot was tasked with pressing a button to open a gate, retrieving a baby dinosaur (doll), and optionally herding other dinosaurs into a cage — all while meeting strict mechanical and electrical constraints.

<div align="center">
  <img src="images/CompleteFrontView.jpg" alt="Jurassic Rescue Robot Front View" width="500"/>
</div>

---

## 🏆 Awards
- 🥇 People's Choice Award – *MREN 303: Tronic Park 2024*

---

## 🚀 Features

- 🎮 **Dual Operation Modes**
  - Autonomous mode to navigate, locate, and press gate-opening button
  - Manual control using a gamepad for precise retrieval of the dinosaur

- 🔩 **Custom Mechanism Design**
  - Vertical clamp & plow mechanism for reliable object capture and movement
  - Laser-cut chassis, custom servos, and minimal degrees of freedom

- 📐 **Design Constraints**
  - Max 3 servos
  - Raspberry Pi Pico microcontroller
  - No prefabricated chassis or wheels allowed
  - Lightweight design with recycled + custom-cut materials

---

## 🛠 Tech Stack

- Raspberry Pi Pico (MicroPython & C++)
- Servo Motors (limited to 3)
- Ultrasonic Sensors (for distance detection)
- Gamepad via UDP (for remote control)
- Laser-cut MDF & acrylic parts
- Hand-soldered circuits + wiring

---

## 📂 File Structure

```
jurassic-rescue-robot/
├── code/
│   ├── Completed_Code.ino
│   ├── auto.ino
│   ├── line_following.ino
│   ├── ultrasound_test.ino
│   ├── Motor_driver.ino
│   ├── PicoUDPGamepadRead_BatteryRead.ino
│   └── PicoUDPGamepadReadGameModes.ino
├── images/
│   ├── CompleteFrontView.jpg
│   ├── CompleteBackView.jpg
│   └── CompleteIsoView.jpg
├── README.md
└── .gitignore
```

---

## 🖼️ Gallery

| Front View | Back View | Isometric View |
|------------|-----------|----------------|
| ![](images/CompleteFrontView.jpg) | ![](images/CompleteBackView.jpg) | ![](images/CompleteIsoView.jpg) |

---

## 🙌 Credits

Team Members:
- Mousa Pirzada – App development, mechanism control, code integration
- [Add collaborators if any]

