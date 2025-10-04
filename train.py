import argparse
from ultralytics import YOLO
import os

# ==========================
# Hyperparameters
# ==========================
EPOCHS = 10
MOSAIC = 0.4
MIXUP = 0.3        # new: mixup augmentation
OPTIMIZER = 'AdamW'
MOMENTUM = 0.9
LR0 = 0.0001
LRF = 0.0001
SINGLE_CLS = False

# ==========================
# Argument parser
# ==========================
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--epochs', type=int, default=EPOCHS, help='Number of epochs')
    parser.add_argument('--mosaic', type=float, default=MOSAIC, help='Mosaic augmentation')
    parser.add_argument('--mixup', type=float, default=MIXUP, help='Mixup augmentation')
    parser.add_argument('--optimizer', type=str, default=OPTIMIZER, help='Optimizer')
    parser.add_argument('--momentum', type=float, default=MOMENTUM, help='Momentum')
    parser.add_argument('--lr0', type=float, default=LR0, help='Initial learning rate')
    parser.add_argument('--lrf', type=float, default=LRF, help='Final learning rate')
    parser.add_argument('--single_cls', type=bool, default=SINGLE_CLS, help='Single class training')
    args = parser.parse_args()

    this_dir = os.path.dirname(__file__)
    os.chdir(this_dir)

    # ==========================
    # Load YOLOv8 model
    # ==========================
    model = YOLO(os.path.join(this_dir, "yolov8s.pt"))

    # ==========================
    # Train with full augmentation
    # ==========================
    results = model.train(
        data=os.path.join(this_dir, "yolo_params.yaml"),
        epochs=args.epochs,
        device=0,               # or 'cpu' if no GPU
        single_cls=args.single_cls,
        mosaic=args.mosaic,     # existing mosaic
        mixup=args.mixup,       # new: mixup
        augment=True,           # enables flips, rotations, brightness/contrast, noise
        optimizer=args.optimizer,
        lr0=args.lr0,
        lrf=args.lrf,
        momentum=args.momentum
    )

    print("Training complete! Check 'runs/train/' for results.")
