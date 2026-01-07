#!/usr/bin/env python3
"""
Setup script for flood prediction API
Handles sklearn installation and server startup
"""

import sys
import subprocess
import os
import importlib

def install_package(package_name, version=None):
    """Install a Python package"""
    try:
        if version:
            subprocess.check_call([sys.executable, "-m", "pip", "install", f"{package_name}=={version}"])
        else:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package_name}: {e}")
        return False

def check_and_install_sklearn():
    """Check sklearn installation and install if needed"""
    print("🔍 Checking sklearn installation...")

    try:
        import sklearn
        print(f"✅ sklearn {sklearn.__version__} is already installed")
        return True
    except ImportError:
        print("❌ sklearn not found, installing...")

        # Try different installation methods
        methods = [
            ("scikit-learn", "1.3.0"),
            ("scikit-learn", None),  # Latest version
        ]

        for package, version in methods:
            print(f"📦 Installing {package}" + (f" version {version}" if version else ""))
            if install_package(package, version):
                try:
                    import sklearn
                    print(f"✅ sklearn {sklearn.__version__} installed successfully")
                    return True
                except ImportError:
                    print("❌ sklearn import still failing, trying next method...")
            else:
                print("❌ Installation failed, trying next method...")

        return False

def main():
    print("🚀 Setting up Flood Prediction API...")
    print("🌊 Guardian Earth - AI Flood Risk Assessment")
    print("=" * 50)

    # Check Python version
    print(f"🐍 Python version: {sys.version}")

    # Install sklearn if needed
    if not check_and_install_sklearn():
        print("❌ Failed to install sklearn. Please try:")
        print("   1. Run as administrator: right-click and 'Run as administrator'")
        print("   2. Install manually: pip install scikit-learn")
        print("   3. Check Python environment: python --version")
        sys.exit(1)

    # Install other dependencies
    print("\n📦 Installing other dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Some dependencies might have failed: {e}")

    # Check if model exists, recreate if needed
    print("\n🤖 Checking model file...")
    if not os.path.exists("flood_model.pkl"):
        print("📊 Creating new model...")
        try:
            subprocess.check_call([sys.executable, "flood_model.py"])
            print("✅ Model created successfully")
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Model creation failed: {e}")
            print("🔄 Will use fallback model instead")

    # Test imports
    print("\n🔍 Testing imports...")
    required_modules = ['flask', 'pandas', 'matplotlib', 'flask_cors', 'sklearn']
    failed_imports = []

    for module in required_modules:
        try:
            importlib.import_module(module)
            print(f"✅ {module}")
        except ImportError:
            print(f"❌ {module}")
            failed_imports.append(module)

    if failed_imports:
        print(f"\n⚠️ Some modules failed to import: {', '.join(failed_imports)}")
        print("The server will try to run with available modules")

    print("\n🌐 Starting Flood Prediction API Server...")
    print("Server will be available at: http://localhost:5001")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)

    # Start the server
    try:
        from flood_model_server import app
        app.run(debug=True, port=5001, host='0.0.0.0')
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        print("💡 Try running: python flood_model_server.py")
        sys.exit(1)

if __name__ == "__main__":
    main()
