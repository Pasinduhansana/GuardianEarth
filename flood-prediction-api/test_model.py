#!/usr/bin/env python3
"""
Test script for flood prediction model
"""

import joblib
import pandas as pd
import numpy as np

def test_model():
    try:
        print("🔍 Testing Flood Prediction Model...")
        print("=" * 40)

        # Test sklearn import
        print("📦 Testing sklearn import...")
        import sklearn
        print(f"✅ sklearn version: {sklearn.__version__}")

        # Test joblib import
        print("📦 Testing joblib import...")
        import joblib
        print("✅ joblib imported successfully"

        # Load model
        print("🤖 Loading model...")
        model = joblib.load("flood_model.pkl")
        print("✅ Model loaded successfully!")

        # Test prediction
        print("🔮 Testing prediction...")
        test_data = pd.DataFrame([{
            'MonsoonIntensity': 7.5,
            'Urbanization': 6.2,
            'DrainageSystems': 4.1
        }])

        prediction = model.predict(test_data)[0] * 100
        result = round(prediction, 2)

        print(f"✅ Prediction successful!")
        print(f"📊 Input: Monsoon=7.5, Urbanization=6.2, Drainage=4.1")
        print(f"🎯 Predicted flood probability: {result}%")

        # Risk assessment
        if result < 30:
            risk = "🟢 LOW RISK"
        elif result < 60:
            risk = "🟡 MODERATE RISK"
        else:
            risk = "🔴 HIGH RISK"

        print(f"⚠️  Risk Level: {risk}")

        print("=" * 40)
        print("🎉 All tests passed! Model is ready to use.")
        return True

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_model()
