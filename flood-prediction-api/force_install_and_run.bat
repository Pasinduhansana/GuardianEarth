@echo off
echo 🚀 Force Installing sklearn and Starting Flood Prediction API...
echo 🌊 Guardian Earth - AI Flood Risk Assessment
echo ==================================================

cd /d "%~dp0"

echo 📦 Force reinstalling scikit-learn...
pip uninstall scikit-learn -y
pip install scikit-learn==1.3.0

if %errorlevel% neq 0 (
    echo ❌ Failed to install scikit-learn
    echo 🔄 Trying alternative installation...
    python -m pip install --upgrade --force-reinstall scikit-learn
)

echo 📦 Ensuring all dependencies are installed...
pip install -r requirements.txt

echo 🤖 Recreating model...
if exist "flood_model.pkl" del "flood_model.pkl"
python flood_model.py

if not exist "flood_model.pkl" (
    echo ❌ Model creation failed
    pause
    exit /b 1
)

echo 🔍 Testing sklearn import...
python -c "import sklearn; print('sklearn version:', sklearn.__version__)"
if %errorlevel% neq 0 (
    echo ❌ sklearn still not working
    echo 💡 Try running as administrator or check Python environment
    pause
    exit /b 1
)

echo 🌐 Starting server...
echo Model will fallback to rule-based prediction if ML model fails to load
python flood_model_server.py
