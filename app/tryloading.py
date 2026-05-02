
import joblib
from pathlib import Path
from transformers import FeatureEncoder, FeatureDropper

BASE_DIR = Path("/Users/mohamed/irrigation/app")

model = joblib.load(BASE_DIR / "model.joblib")
pipeline = joblib.load(BASE_DIR / "pipeline.joblib")
scaler = joblib.load(BASE_DIR / "scaler.joblib")

print("All loaded successfully!")