# server.py
import base64
import io
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from pathlib import Path
from typing import Optional
import re
import time


# ------------- CONFIG -------------
MODEL_PATH = r"C:\Users\Trisha\Desktop\FalconEDU\Hackathon2_scripts\Hackathon2_scripts\runs\detect\train2\weights\best.pt"
# If you have an RTSP or USB camera, set that here. Example: 0 for default camera, or "rtsp://..."
CAMERA_SOURCE = 0
CONF_THRESH = 0.45

# class names (must match your model)
OBJECT_NAMES = ["OxygenTank","NitrogenTank","FirstAidBox","FireAlarm",
                "SafetySwitchPanel","EmergencyPhone","FireExtinguisher"]

# ------------- API & model init -------------
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

if not Path(MODEL_PATH).exists():
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
model = YOLO(MODEL_PATH)  # load model (warm-up may happen on first call)

# ------------- request model -------------
class Query(BaseModel):
    command: str

# ------------- helpers -------------
def capture_frame():
    """Grab a single frame from CAMERA_SOURCE and return BGR numpy.array."""
    cap = cv2.VideoCapture(CAMERA_SOURCE)
    if not cap.isOpened():
        raise RuntimeError("Could not open camera source")
    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise RuntimeError("Could not read frame from camera")
    return frame  # BGR np.ndarray

def run_detection_on_frame(frame):
    """Run YOLO predict on an OpenCV frame (BGR). Returns the ultralytics Result object."""
    # YOLO accepts image arrays; set imgsz to control runtime size
    results = model.predict(frame, conf=CONF_THRESH, imgsz=640)
    return results[0]

def annotate_result(result):
    """Return JPEG bytes of the plotted image (with boxes)"""
    img = result.plot()  # returns RGB or BGR depending on version (safe to re-encode)
    # convert to BGR if needed (cv2.imencode expects BGR)
    if img.shape[2] == 3:
        img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    else:
        img_bgr = img
    _, jpg = cv2.imencode('.jpg', img_bgr, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    return jpg.tobytes()

def result_to_list(result):
    """Convert result.boxes into serializable detections list"""
    dets = []
    for box in result.boxes:
        # box.cls, box.conf, box.xyxy, box.xywhn
        cls_idx = int(box.cls.cpu().numpy()) if hasattr(box.cls, "cpu") else int(box.cls)
        name = model.names[cls_idx]
        conf = float(box.conf.cpu().numpy()) if hasattr(box.conf, "cpu") else float(box.conf)
        xyxy = [float(x) for x in (box.xyxy[0].cpu().numpy() if hasattr(box.xyxy[0], "cpu") else box.xyxy[0])]
        xywhn = [float(x) for x in (box.xywhn[0].cpu().numpy() if hasattr(box.xywhn[0], "cpu") else box.xywhn[0])]
        dets.append({
            "class": name,
            "class_id": cls_idx,
            "conf": conf,
            "xyxy": xyxy,   # absolute pixels [x1,y1,x2,y2]
            "xywhn": xywhn  # normalized center/width/height
        })
    return dets

def normalize_text(s: str):
    return re.sub(r'[^a-z0-9]', '', s.lower())

def find_requested_object(command: str) -> Optional[str]:
    """Find which object the user is asking about (simple match)."""
    cmd = command.lower()
    for obj in OBJECT_NAMES:
        if obj.lower() in cmd:
            return obj
        # allow variations like 'nitrogen tank' -> 'nitrogentank'
        if normalize_text(obj) in normalize_text(cmd):
            return obj
    return None

# ------------- main endpoint -------------
@app.post("/api/query")
async def api_query(q: Query):
    start = time.time()
    cmd = q.command.strip()
    if not cmd:
        raise HTTPException(status_code=400, detail="Empty command")

    # capture a frame (live), you can instead load a saved latest image if needed
    try:
        frame = capture_frame()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Camera/frame error: {e}")

    # run detection
    try:
        result = run_detection_on_frame(frame)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection error: {e}")

    detections = result_to_list(result)

    # Interpret command
    cmd_lower = cmd.lower()
    reply = ""
    requested = find_requested_object(cmd)
    if "check" in cmd_lower and "equipment" in cmd_lower:
        # comprehensive equipment check
        present = {d["class"] for d in detections}
        statuses = []
        for obj in OBJECT_NAMES:
            statuses.append(f"{obj}: {'present' if obj in present else 'missing'}")
        reply = " ; ".join(statuses)
    elif requested:
        # locate requested object — return highest confidence detection first
        matches = [d for d in detections if d["class"] == requested]
        if not matches:
            reply = f"{requested} not detected in view."
        else:
            best = max(matches, key=lambda x: x["conf"])
            x_center_norm, y_center_norm, w_norm, h_norm = best["xywhn"]
            reply = (f"{requested} detected (conf {best['conf']:.2f}) at "
                     f"normalized x:{x_center_norm:.2f}, y:{y_center_norm:.2f}.")
    else:
        reply = "I didn't understand the request. Try: 'Where is NitrogenTank?' or 'Check emergency equipment'."

    # annotate image and send back (base64)
    img_bytes = annotate_result(result)
    img_b64 = base64.b64encode(img_bytes).decode('ascii')

    elapsed = time.time() - start
    return {
        "reply": reply,
        "detections": detections,
        "image_base64": img_b64,
        "elapsed_s": round(elapsed, 3)
    }

# ------------- health endpoint -------------
@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "Falcon Voice Assistant API is running 🚀"}

# Input model
class QueryRequest(BaseModel):
    question: str

# Example: live data placeholders (replace with your actual data sources)
live_data = {
    "nitrogen_tank": {"location": "Zone B, next to the compressor"},
    "rover_3": {"battery": "78%", "location": "Sector 5"},
    "active_zone": "Zone C"
}

@app.post("/query")
async def query_endpoint(request: QueryRequest):
    question = request.question.lower()

    if "nitrogen tank" in question:
        location = live_data["nitrogen_tank"]["location"]
        return {"answer": f"The Nitrogen Tank is currently at {location}"}

    elif "rover 3 battery" in question or "rover 3 status" in question:
        battery = live_data["rover_3"]["battery"]
        location = live_data["rover_3"]["location"]
        return {"answer": f"Rover 3 is at {location} with {battery} battery remaining."}

    elif "active zone" in question:
        zone = live_data["active_zone"]
        return {"answer": f"The currently active zone is {zone}."}

    return {"answer": "Sorry, I don't have information on that yet."}

# Optional: function to update live data from sensors or database
def update_live_data(sensor_data: dict):
    live_data.update(sensor_data)
