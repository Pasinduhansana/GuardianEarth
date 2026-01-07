#!/usr/bin/env python3
"""
Flood Prediction API Server Starter
This script starts the Flask server for flood prediction
"""

import os
import sys

def main():
    print("🚀 Starting Flood Prediction API Server...")
    print("🌊 Guardian Earth - AI Flood Risk Assessment")
    print("=" * 50)

    # Check if required packages are installed
    required_packages = ['flask', 'pandas', 'sklearn', 'joblib', 'matplotlib', 'flask_cors']
    missing_packages = []

    for package in required_packages:
        try:
            if package == 'sklearn':
                import sklearn
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)

    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Please run: pip install -r requirements.txt")
        sys.exit(1)

    # Check if model file exists
    if not os.path.exists('flood_model.pkl'):
        print("❌ flood_model.pkl not found!")
        print("Please run: python flood_model.py")
        sys.exit(1)

    print("✅ All dependencies verified")
    print("✅ Model file found")
    print("🌐 Starting server on http://localhost:5001")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)

    # Import and run the server
    from flood_model_server import app
    app.run(debug=True, port=5001, host='0.0.0.0')

if __name__ == "__main__":
    main()
