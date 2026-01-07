@echo off
echo 🚀 Starting Flood Prediction API Server...
echo 🌊 Guardian Earth - AI Flood Risk Assessment
echo ==================================================

cd /d "%~dp0"

echo 📦 Checking Python environment...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.7+
    pause
    exit /b 1
)

echo 📦 Installing/updating dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🤖 Checking model file...
if not exist "flood_model.pkl" (
    echo ❌ flood_model.pkl not found. Creating model...
    python flood_model.py
    if %errorlevel% neq 0 (
        echo ❌ Failed to create model
        pause
        exit /b 1
    )
)

echo 🔍 Testing model loading...
python -c "import joblib; import sklearn; model = joblib.load('flood_model.pkl'); print('✅ Model loaded successfully!')"
if %errorlevel% neq 0 (
    echo ❌ Model loading failed
    pause
    exit /b 1
)

echo 🌐 Starting Flask server on http://localhost:5001
echo Press Ctrl+C to stop the server
echo ==================================================
python flood_model_server.py
