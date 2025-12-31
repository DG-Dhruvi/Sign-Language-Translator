# Sign Language to Speech Converter

A **real-time Sign Language to Speech web application** that uses **Computer Vision and Machine Learning** to recognize hand gestures and convert them into **spoken sentences**.

Built using **TensorFlow.js**, **Google Teachable Machine**, and the **Web Speech API** — fully browser-based, no backend required.

---

##  Features

- 🎥 Real-time webcam-based sign recognition  
- 🧠 Optimized auto-add logic (no repeated letters)  
- 📊 Sliding window voting for stable predictions  
- ⏱ Cooldown system to avoid double detection  
- 🔊 Text-to-Speech output  
- ⏸ Pause / Resume auto detection  
- ⚙ Adjustable confidence threshold & hold time  
- 💻 Runs completely in the browser  

---

##  Tech Stack

- HTML5  
- CSS3  
- JavaScript  
- TensorFlow.js  
- Google Teachable Machine  
- Web Speech API  

---

## Project Structure


---

##  How It Works

1. Webcam captures live video frames  
2. Frames are passed to a Teachable Machine image model  
3. Predictions are filtered using:
   - Confidence threshold  
   - Sliding window voting  
   - Cooldown logic  
4. Stable gestures are automatically added to a sentence  
5. Sentence is converted into speech using Text-to-Speech  

---

## Auto-Add Optimization Logic

To prevent noise and repeated letters, the system uses:

- **Sliding Window Voting**  
  A gesture must appear in at least 75% of recent frames  

- **Cooldown Mechanism**  
  Prevents the same sign from being added repeatedly  

- **Confidence Threshold**  
  Ignores low-confidence predictions  

This makes detection smooth, stable, and user-friendly.

---

## How to Run

### Method 1: Simple (Recommended)
1. Download or clone this repository  
2. Open `index.html` in **Google Chrome**  
3. Click **Start Camera**  
4. Show hand signs clearly  
5. Click **Speak** to hear the output  

### Method 2: Using a Local Server (Optional)
```bash
python -m http.server
