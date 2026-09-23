---
title: "Flip Clock Screensaver"
description: "A lightweight, elegant cross-platform flip-clock screensaver inspired by classic retro mechanical split-flap clocks and Fliqlo, built natively for Windows (C# / GDI+) and macOS (Swift / AppKit)."
image: "/flip-clock.png"
tags: ["C#", ".NET", "Swift", "macOS", "WinForms", "GDI+", "Screensaver", "Windows"]
github: "https://github.com/LuC-9/flip-clock-screensaver"
featured: true
order: 2
---

![Flip Clock Screensaver Preview](/flip-clock.png)

A lightweight, elegant flip-clock screensaver inspired by classic retro mechanical split-flap clocks and Fliqlo. Available natively on both **Windows** (pure C# / Windows Forms / GDI+) and **macOS** (native Swift / AppKit `ScreenSaver.framework`), it requires zero external runtimes or heavy Chromium wrappers, running smoothly at 60 FPS on any modern machine.

## ✨ Features

- **Mechanical Split-Flap Animation:** Real-time 60 FPS 3D perspective folding flap physics with dynamic light-falloff gradient shading and soft drop shadows on resting lower flaps.
- **Authentic Hardware Details:** Crisp horizontal divider groove, subtle top-edge bevel highlight, and axle hinge notches on card borders.
- **Hours, Minutes & Seconds Display:** Standard Hours and Minutes cards plus an optional retro compact Seconds card anchored to the bottom baseline.
- **High-DPI / Retina Razor-Sharp Typography:** Rendered with native system vector outlines using Per-Monitor DPI awareness on Windows (`SetProcessDpiAwareness`) and CoreGraphics/CoreText on macOS for crisp fidelity on 1080p, 1440p, 4K Retina, 5K, and Apple XDR displays.
- **Customizable Formats:** Seamlessly toggle between 12-Hour (with subtle AM/PM indicator) and 24-Hour modes, customize the clock scale (0.5x - 2.0x), or toggle the seconds card.
- **Native OS Screensaver Integration:**
  - **Windows (`.scr`):** Full support for standard command-line switches: `/s` (fullscreen screensaver), `/c` (settings modal), `/p` (preview in Screen Saver Settings), and `/w` (standalone windowed mode), with safe mouse dismissal grace period.
  - **macOS (`.saver`):** Universal 2 binary bundle (`arm64` for Apple Silicon M1/M2/M3/M4 & `x86_64` for Intel) with native AppKit configuration sheet embedded directly in System Settings.

## 🛠️ Tech Stack

- **Languages:** C# 5, Swift 5.5+
- **Platforms:** Windows 10/11, macOS 11.0+ (Big Sur through Sequoia)
- **Frameworks & Graphics:** 
  - *Windows:* .NET Framework 4.0 / 4.8, Windows Forms, GDI+ (`System.Drawing`), Win32 P/Invoke
  - *macOS:* AppKit, `ScreenSaver.framework`, CoreGraphics, CoreText
- **Persistence:** Windows Registry (`HKCU\Software\FliqloClockCS`), macOS `ScreenSaverDefaults`
- **CI / CD:** GitHub Actions matrix workflow automating Windows and macOS universal binary release builds

## 🚀 Installation & Usage

### 🍎 macOS Installation (`.saver`)
1. Download `FliqloClock-macOS.saver.zip` from [Releases](https://github.com/LuC-9/flip-clock-screensaver/releases).
2. Unzip and double-click `FliqloClock.saver` to install into your macOS Screen Savers (or move to `~/Library/Screen Savers/`).
3. Open macOS **System Settings** > **Wallpaper / Screen Saver**, select **FliqloClock**, and adjust your preferences via **Options**.

### 🪟 Windows Installation (`.scr`)
1. Download or build `FliqloClock.scr`.
2. Right-click `FliqloClock.scr` and choose **Install**, or copy to `C:\Windows\System32\`.
3. Open Windows **Screen Saver Settings**, select **FliqloClock**, and adjust your preferences.

### Standalone Mode (Windows)
You can also run it directly without installing:

```powershell
# Fullscreen screensaver
.\FliqloClock.scr /s

# Standalone windowed mode
.\FliqloClock.scr /w

# Configuration dialog
.\FliqloClock.scr /c
```