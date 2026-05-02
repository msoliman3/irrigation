import { useState } from 'react'
import axios from 'axios'



const defaultForm = {
  Soil_Type: "",
  Soil_pH: "",
  Soil_Moisture: "",
  Organic_Carbon: "",
  Electrical_Conductivity: "",
  Temperature_C: "",
  Humidity: "",
  Rainfall_mm: "",
  Sunlight_Hours: "",
  Wind_Speed_kmh: "",
  Crop_Type: "",
  Crop_Growth_Stage: "",
  Season: "",
  Irrigation_Type: "",
  Water_Source: "",
  Field_Area_hectare: "",
  Mulching_Used: "",
  Previous_Irrigation_mm: "",
  Region: "",
}


const stringFields = [
  "Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season",
  "Irrigation_Type", "Water_Source", "Mulching_Used", "Region"
]

export default function App() {
  const [formData, setFormData] = useState (defaultForm) // form field values 
  const [result, setResult] = useState (null) // prediction result 
  const [loading, setLoading] = useState (false) //loading spinner state
  const [error, setError] = useState (null) //error message 


  const handleChange = (e) => {
    const {name, value} = e.target 
    setFormData({ ...formData, [name]: value })

  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
        const payload = {}
    for (const [key, value] of Object.entries(formData)) {
      payload[key] = stringFields.includes(key) ? value : parseFloat(value)
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", payload)
      setResult(response.data)
    }catch (err) {
      setError(err.response?.data?.detail || "smth went wrong")
    }finally {
      setLoading(false)
    }
  }

    // Everything inside return() is what gets rendered on screen
  // Parentheses allow multi-line HTML
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Irrigation Predictor</h1>

      {/* This is a comment in JSX */}

      {/* .map() is like a list comprehension — loops over fields and renders an input for each */}
      {/* equivalent to: [render_input(field) for field in defaultForm.keys()] */}
      {Object.keys(defaultForm).map((field) => (
        <div key={field} style={{ marginBottom: 12 }}>
          {/* key={field} is required by React when rendering lists — like a unique ID */}
          <label style={{ display: "block", marginBottom: 4 }}>{field}</label>
          <input
            name={field}           // identifies which field changed in handleChange
            value={formData[field]}  // controlled input — value is always from state
            onChange={handleChange}  // called on every keystroke
            placeholder={field}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}  // grey out button while loading
        style={{ padding: "10px 24px", marginTop: 8 }}
      >
        {/* Ternary operator — like: "Predicting..." if loading else "Predict" */}
        {loading ? "Predicting..." : "Predict"}
      </button>

      {/* Conditional rendering — like: if result: show this */}
      {/* && is short-circuit evaluation, same as Python */}
      {result && (
        <div style={{ marginTop: 24, padding: 16, background: "#e6ffe6" }}>
          <h2>Result: {result.label}</h2>
          <p>Class: {result.predicted_class}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 24, padding: 16, background: "#ffe6e6" }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  )
}