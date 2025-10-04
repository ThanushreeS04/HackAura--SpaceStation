# 🦅 YOLO Object Detection – Hackathon Project

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Framework](https://img.shields.io/badge/Framework-PyTorch-orange.svg)
![YOLO](https://img.shields.io/badge/Model-YOLOv5/YOLOv8-green.svg)
![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)

Real-time **object detection** using the YOLO (You Only Look Once) model, built as part of a hackathon challenge.
The project supports **custom datasets**, **training**, **evaluation**, and **inference on real-world images/videos**.

---

## 📂 Repository Structure

```
Hackathon2_scripts/
│── check.py                 # Quick test script
│── hackathon2_train_3/      # Training dataset
│── hackathon2_test3/        # Testing dataset
│── models/                  # YOLO weights & configs
│── results/                 # Outputs & predictions
│── requirements.txt         # Dependencies
│── README.md                # Documentation
```

---

## ⚙️ Installation

1. Clone this repository:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. (Optional) If using CUDA:

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

---

## 📊 Dataset

* **Training data**: `hackathon2_train_3/`
* **Testing data**: `hackathon2_test3/`

⚠️ Large datasets are **not stored directly in GitHub**. Please download from the provided links:

* 🔗 [Google Drive](#)
* 🔗 [Kaggle](#)

After downloading, extract datasets into the project root.

---

## 🏋️ Training

To train the model on the custom dataset:

```bash
python train.py --data data.yaml --weights yolov5s.pt --epochs 50 --img 640
```

---

## 🔎 Inference / Testing

Run object detection on the test dataset:

```bash
python detect.py --weights runs/train/exp/weights/best.pt --source hackathon2_test3/
```

Outputs will be stored in the `results/` folder.

---

## 📈 Results

| Metric        | Value |
| ------------- | ----- |
| mAP@50        | XX%   |
| Precision     | XX%   |
| Recall        | XX%   |
| Inference FPS | XX    |

## ✨ Features

* ✅ Train YOLO on a custom dataset
* ✅ Run inference on images/videos
* ✅ Save detection outputs with bounding boxes
* ✅ Ready for real-time object detection


# 🚀 StarCommand Space Station

An interactive astronaut space station dashboard with an intelligent voice assistant.

## ✨ Features

- **Voice Assistant**: Click the microphone button and speak commands
- **Speech Recognition**: Understands natural language commands
- **Text-to-Speech**: Assistant responds with voice
- **Real-time Dashboard**: Monitor oxygen, power, temperature
- **Task Management**: Track mission tasks and procedures
- **Emergency Protocols**: Quick access to safety procedures

## 🎤 Voice Commands

### Navigation
- "Dashboard" / "Home" / "Main screen"
- "System status" / "Check systems"
- "Tasks" / "Task manager" / "To do"
- "Procedures" / "Protocols"
- "Assessment" / "Status report"

### System Information
- "Oxygen" / "O2" / "Air quality"
- "Power" / "Battery" / "Energy"
- "Temperature" / "Climate"
- "Pressure" / "Atmospheric"
- "Communication" / "Comms" / "Signal"
- "Navigation" / "Position" / "Location"
- "All systems" / "Full status"
- "Crew health" / "Medical"
- "Warnings" / "Alerts" / "Problems"

### Time & Date
- "What time is it?"
- "What's the date?" / "What day is today?"

### Actions
- "Emergency" / "Alert" / "Mayday"
- "Lights on" / "Turn on lights"
- "Lights off" / "Turn off lights"
- "Lock" / "Secure station"
- "Unlock" / "Unsecure"

### Information
- "Mission" / "Objective"
- "Weather" / "External conditions"
- "Fuel" / "Propellant"

### Social & Fun
- "Hello" / "Hi" / "Hey"
- "Good morning" / "Good night"
- "How are you?" / "Who are you?"
- "Thank you" / "Thanks"
- "Tell me a joke"
- "Help" / "What can you do?"
- "Repeat" / "Say that again"

### Space & Environment
- "Where am I?" / "Where are we?"
- "How fast?" / "Speed"
- "How high?" / "Altitude"
- "How long?" / "Mission duration"
- "Earth" / "See Earth" / "View"
- "Stars" / "See stars"
- "Moon" / "See moon"
- "Sun" / "Solar activity"
- "Radiation" / "Exposure"
- "Orbit" / "Trajectory"
- "Gravity" / "Microgravity"

### Life Support & Resources
- "Water" / "H2O"
- "Food" / "Supplies"
- "Sleep" / "Rest"
- "Exercise" / "Workout"
- "Shower" / "Hygiene"
- "Toilet" / "Bathroom"

### Activities & Operations
- "Experiment" / "Research" / "Science"
- "Contact" / "Call" / "Message"
- "Spacewalk" / "EVA"
- "Docking" / "Arrival"
- "Music" / "Play music"
- "Movie" / "Video"

### Emotional Support
- "Family" / "Home"
- "Scared" / "Afraid" / "Worried"
- "Lonely" / "Alone"
- "Beautiful" / "Amazing" / "Incredible"

### AI & Object Detection System
- "Detect" / "Detection" / "Scan"
- "Oxygen tank" / "O2 tank"
- "Nitrogen tank" / "N2 tank"
- "First aid" / "Medical kit"
- "Fire alarm" / "Smoke detector"
- "Safety panel" / "Control panel"
- "Emergency phone" / "Intercom"
- "Fire extinguisher"
- "Safety objects" / "Safety equipment"
- "Camera" / "Vision" / "Visual system"
- "AI system" / "Artificial intelligence"
- "Anomaly" / "Unusual" / "Strange"
- "Hidden objects" / "Obscured"
- "Lighting" / "Brightness" / "Visibility"
- "Tracking" / "Monitor objects"
- "Safety check" / "Safety inspection"
- "Missing" / "Lost" / "Cannot find"
- "Floating" / "Loose objects"
- "Hazard" / "Danger" / "Risk"

## 🚀 Getting Started

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
