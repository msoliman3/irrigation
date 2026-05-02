from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

BASE_DIR = Path("/Users/mohamed/irrigation/app")

model = joblib.load(BASE_DIR / "model.joblib")
pipeline = joblib.load(BASE_DIR / "pipeline.joblib")
scaler = joblib.load(BASE_DIR / "scaler.joblib")
columns = joblib.load(BASE_DIR / "columns.joblib")
class_names = np.array(["Low Irrigation", "Medium Irrigation", "High Irrigation"])

# Define exactly what fields you expect
class IrrigationInput(BaseModel):
    Soil_Type: str
    Soil_pH: float
    Soil_Moisture: float
    Organic_Carbon: float
    Electrical_Conductivity: float
    Temperature_C: float
    Humidity: float
    Rainfall_mm: float
    Sunlight_Hours: float
    Wind_Speed_kmh: float
    Crop_Type: str
    Crop_Growth_Stage: str
    Season: str
    Irrigation_Type: str
    Water_Source: str
    Field_Area_hectare: float
    Mulching_Used: int 
    Previous_Irrigation_mm: float
    Region: str

app = FastAPI()

@app.get("/")
def read_root():
    return "Welcome to the Irrigation ML API"

@app.post("/predict")
def predict(input: IrrigationInput):
    try:
        # Convert to DataFrame (pipeline expects this)
        df = pd.DataFrame([input.model_dump()])
        df["id"] = 0  # Add dummy id column if needed by pipeline
        df_transformed = pipeline.transform(df)
        df_transformed = df_transformed.drop("Irrigation_Need", axis=1, errors="ignore")
        # Reorder columns to match training
        df_transformed = df_transformed[columns] 
        df_scaled = scaler.transform(df_transformed)
        
        prediction = model.predict(df_scaled)
        label = class_names[prediction[0]]
        
        return {"predicted_class": int(prediction[0]), "label": label}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))