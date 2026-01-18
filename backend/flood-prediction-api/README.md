# 🌊 Flood Prediction API

AI-powered flood risk assessment API for the Guardian Earth disaster management system.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Windows
python setup_and_run.py

# Or use the batch file
force_install_and_run.bat
```

### Option 2: Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# If sklearn fails to install, try:
pip install scikit-learn==1.3.0

# Create/train the model
python flood_model.py

# Start the server
python flood_model_server.py
```

### Troubleshooting sklearn Issues

If you encounter sklearn import errors:

```bash
# Force reinstall sklearn
pip uninstall scikit-learn -y
pip install scikit-learn==1.3.0

# Or use the automated setup
python setup_and_run.py
```

The API will be available at: `http://localhost:5001`

## 📡 API Endpoints

### POST `/predict`

Predict flood probability based on environmental factors.

**Request Body:**

```json
{
  "MonsoonIntensity": 7.5,
  "Urbanization": 6.2,
  "DrainageSystems": 4.1
}
```

**Response:**

```json
{
  "floodProbability": 68.45,
  "graphUrl": "http://localhost:5001/static/graphs/flood_probability_graph.png"
}
```

### GET `/static/graphs/<filename>`

Serve generated prediction graphs.

## 🔧 Dependencies

- **Flask** - Web framework
- **Flask-CORS** - Cross-origin support
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning
- **Joblib** - Model serialization
- **Matplotlib** - Chart generation

## 🏗️ Architecture

- **flood_model.py** - Model training and evaluation
- **flood_model_server.py** - Flask API server
- **flood_model.pkl** - Trained RandomForest model
- **start_server.py** - Convenient server launcher

## 📊 Model Features

The AI model uses **RandomForestRegressor** to predict flood probability based on:

- **MonsoonIntensity** (0-10): Rainfall intensity factor
- **Urbanization** (0-10): City development impact
- **DrainageSystems** (0-10): Infrastructure quality factor

## 🧪 Testing

Test the API with curl:

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"MonsoonIntensity": 7.5, "Urbanization": 6.2, "DrainageSystems": 4.1}'
```

## 🐳 Docker Support

Build and run with Docker:

```bash
docker build -t flood-prediction-api .
docker run -p 5001:5001 flood-prediction-api
```
