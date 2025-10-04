import cv2
import os
import threading
from flask_cors import CORS
from flask import Flask, request, jsonify
from ultralytics import YOLO
import time

# ---------------------------
# 1️⃣ Flask app
# ---------------------------
app = Flask(__name__)
CORS(app)

# This dictionary will hold live YOLO detections
live_data = {}

# ---------------------------
# 2️⃣ YOLO configuration
# ---------------------------
model_path = model_path = "C:/Users/Trisha/Desktop/FalconEDU/Hackathon2_scripts/Hackathon2_scripts/runs/detect/train2/weights/best.pt"
model = YOLO(model_path)

# Choose dataset type
dataset_type = "images"  # "images" or "video"
dataset_path = "C:/Users/Trisha/Desktop/FalconEDU/Hackathon2_scripts/Hackathon2_scripts/predictions/images"

# ---------------------------
# 3️⃣ YOLO processing thread
# ---------------------------
def run_yolo():
    global live_data
    if dataset_type == "images":
        image_files = sorted(os.listdir(dataset_path))
        for img_file in image_files:
            img_path = os.path.join(dataset_path, img_file)
            frame = cv2.imread(img_path)
            if frame is None:
                continue

            results = model(frame)
            result = results[0]

            # Update live_data dictionary
            for obj in result.boxes:
                label = model.names[int(obj.cls)]
                x1, y1, x2, y2 = obj.xyxy[0]
                cx = (x1 + x2)/2
                cy = (y1 + y2)/2

                live_data[label] = {
                    "x": float(cx),
                    "y": float(cy),
                    "z": 0.0,
                    "buffer": {"x":0.5,"y":0.5,"z":0.2},
                    "confidence": float(obj.conf[0])
                }

            # Optional: show annotated frame
            annotated_frame = result.plot()
            cv2.imshow("YOLO Live Feed", annotated_frame)
            if cv2.waitKey(100) & 0xFF == ord('q'):
                break

    elif dataset_type == "video":
        cap = cv2.VideoCapture(dataset_path)
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)
            result = results[0]

            for obj in result.boxes:
                label = model.names[int(obj.cls)]
                x1, y1, x2, y2 = obj.xyxy[0]
                cx = (x1 + x2)/2
                cy = (y1 + y2)/2

                live_data[label] = {
                    "x": float(cx),
                    "y": float(cy),
                    "z": 0.0,
                    "buffer": {"x":0.5,"y":0.5,"z":0.2},
                    "confidence": float(obj.conf[0])
                }

            annotated_frame = result.plot()
            cv2.imshow("YOLO Live Feed", annotated_frame)
            if cv2.waitKey(30) & 0xFF == ord('q'):
                break

        cap.release()

    cv2.destroyAllWindows()

# ---------------------------
# 4️⃣ Flask endpoint
# ---------------------------
@app.route('/query', methods=['GET'])
def query_object():
    obj_name = request.args.get('object')
    if not obj_name:
        return jsonify({"error": "Please provide 'object' parameter"}), 400

    obj_info = live_data.get(obj_name)
    if obj_info:
        return jsonify({"object": obj_name, "position": obj_info})
    else:
        return jsonify({"error": f"Object '{obj_name}' not detected"}), 404

# ---------------------------
# 5️⃣ Start YOLO thread and Flask
# ---------------------------
if __name__ == "__main__":
    yolo_thread = threading.Thread(target=run_yolo)
    yolo_thread.daemon = True  # thread will close when main program exits
    yolo_thread.start()

    # Start Flask server
    app.run(host="0.0.0.0", port=5001, debug=True)
