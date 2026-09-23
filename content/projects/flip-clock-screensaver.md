---
title: "Flip Clock Screensaver"
description: "A lightweight, elegant Windows flip-clock screensaver inspired by classic retro mechanical split-flap clocks and Fliqlo, built in pure C# with WinForms, GDI+, and Per-Monitor High-DPI awareness."
image: "/flip-clock.png"
tags: ["C#", ".NET", "WinForms", "GDI+", "Screensaver", "Windows"]
github: "https://github.com/LuC-9/flip-clock-screensaver"
featured: true
order: 2
---

![Flip Clock Screensaver Preview](/flip-clock.png)

A lightweight, elegant Windows flip-clock screensaver inspired by classic retro mechanical split-flap clocks and Fliqlo. Built in pure C# with Windows Forms and GDI+, it requires zero external runtimes or heavy Chromium wrappers, running natively and smoothly at 60 FPS on any modern Windows system.

## ✨ Features

- **Mechanical Split-Flap Animation:** Real-time 60 FPS 3D perspective folding flap physics with dynamic light-falloff gradient shading and soft drop shadows on resting lower flaps.
- **Authentic Hardware Details:** Crisp horizontal divider groove, subtle top-edge bevel highlight, and axle hinge notches on card borders.
- **Hours, Minutes & Seconds Display:** Standard Hours and Minutes cards plus an optional retro compact Seconds card anchored to the bottom baseline.
- **High-DPI Razor-Sharp Typography:** Rendered with native system vector outlines (`GraphicsPath`) using Per-Monitor DPI awareness (`SetProcessDpiAwareness`) for razor-sharp fidelity on 1080p, 1440p, and 4K+ displays.
- **Customizable Formats:** Seamlessly toggle between 12-Hour (with subtle AM/PM indicator) and 24-Hour modes, customize the clock scale (0.5x - 2.0x), or toggle the seconds card.
- **Windows Screensaver Integration:** Full support for standard Windows command-line switches: `/s` (fullscreen screensaver), `/c` (settings modal), `/p` (preview in Screen Saver Settings), and `/w` (standalone windowed mode).
- **Safe Mouse Dismissal:** 1,500ms startup grace period and a 60px movement threshold to prevent accidental exits from desk vibration.

## 🛠️ Tech Stack

- **Language:** C# 5
- **Framework:** .NET Framework 4.0 / 4.8
- **Graphics & Rendering:** Windows Forms, GDI+ (`System.Drawing`), `GraphicsPath` vector outline rendering
- **APIs:** Win32 P/Invoke (`SHCore.dll`, `user32.dll`) for Per-Monitor High-DPI awareness
- **Persistence:** Windows Registry (`HKCU\Software\FliqloClockCS`)

## 🚀 Installation & Usage

### Install as Windows Screensaver
1. Download or build `FliqloClock.scr`.
2. Right-click `FliqloClock.scr` and choose **Install**, or copy to `C:\Windows\System32\`.
3. Open Windows **Screen Saver Settings**, select **FliqloClock**, and adjust your preferences.

### Standalone Mode
You can also run it directly without installing:

```powershell
# Fullscreen screensaver
.\FliqloClock.scr /s

# Standalone windowed mode
.\FliqloClock.scr /w

# Configuration dialog
.\FliqloClock.scr /c
```
