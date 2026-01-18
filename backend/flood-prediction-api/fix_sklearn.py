#!/usr/bin/env python3
"""
Script to diagnose and fix sklearn installation issues
"""

import sys
import subprocess
import os

def run_command(cmd):
    """Run a command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return -1, "", str(e)

def main():
    print("🔧 Diagnosing sklearn installation issues...")
    print("=" * 50)

    # Check Python version
    print("🐍 Python Version:")
    code, out, err = run_command("python --version")
    if code == 0:
        print(out.strip())
    else:
        print(f"❌ Error: {err}")

    # Check pip version
    print("\n📦 Pip Version:")
    code, out, err = run_command("pip --version")
    if code == 0:
        print(out.strip())
    else:
        print(f"❌ Error: {err}")

    # Check if sklearn is installed
    print("\n🔍 Checking sklearn installation...")
    try:
        import sklearn
        print(f"✅ sklearn {sklearn.__version__} is available")
    except ImportError as e:
        print(f"❌ sklearn not found: {e}")

        print("\n📥 Installing sklearn...")
        # Try different installation methods
        methods = [
            "pip install scikit-learn",
            "python -m pip install scikit-learn",
            "pip install --user scikit-learn",
            "python -m pip install --upgrade pip",
            "pip install scikit-learn==1.3.0"
        ]

        for method in methods:
            print(f"Trying: {method}")
            code, out, err = run_command(method)
            if code == 0:
                print("✅ Installation successful!")
                try:
                    import sklearn
                    print(f"✅ sklearn {sklearn.__version__} is now available")
                    break
                except ImportError:
                    print("❌ Still not available, trying next method...")
            else:
                print(f"❌ Failed: {err}")

    # Test joblib and model loading
    print("\n🤖 Testing model loading...")
    try:
        import joblib
        print("✅ joblib imported successfully")

        if os.path.exists("flood_model.pkl"):
            model = joblib.load("flood_model.pkl")
            print("✅ Model loaded successfully!")
        else:
            print("❌ flood_model.pkl not found")

    except Exception as e:
        print(f"❌ Model loading failed: {e}")

    # Test basic prediction
    print("\n🔮 Testing prediction...")
    try:
        import pandas as pd
        import numpy as np
        from sklearn.ensemble import RandomForestRegressor

        # Create test data
        test_data = pd.DataFrame([{
            'MonsoonIntensity': 7.5,
            'Urbanization': 6.2,
            'DrainageSystems': 4.1
        }])

        # Test with a fresh model
        model = RandomForestRegressor(n_estimators=10, random_state=42)
        model.fit(np.random.rand(100, 3), np.random.rand(100))
        prediction = model.predict(test_data)[0]
        print(f"✅ Prediction test successful: {prediction:.4f}")

    except Exception as e:
        print(f"❌ Prediction test failed: {e}")

    print("\n" + "=" * 50)
    print("🎯 Diagnosis complete. If sklearn is still not working,")
    print("   try running this script with administrator privileges")
    print("   or check your Python environment.")

if __name__ == "__main__":
    main()
