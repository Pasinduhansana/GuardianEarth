import axios from "axios";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function FloodPredictor() {
  const [inputs, setInputs] = useState({
    MonsoonIntensity: "",
    Urbanization: "",
    DrainageSystems: "",
  });

  const [result, setResult] = useState(null);
  const [graphUrl, setGraphUrl] = useState(null);
  const resultRef = useRef();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/predict", inputs);
      setResult(res.data.floodProbability);
      setGraphUrl(res.data.graphUrl);
    } catch (err) {
      alert("Prediction failed: " + (err.response?.data?.error || err.message));
    }
  };

  const downloadPDF = async () => {
    const element = resultRef.current;

    // Ensure the image is fully loaded before generating the PDF
    const img = element.querySelector("img");
    if (img && !img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true }); // Higher resolution
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Header
    pdf.setFontSize(18);
    pdf.setTextColor("#333");
    pdf.setFont("helvetica", "bold");
    pdf.text("Guardian Earth Flood Prediction Result ", pdfWidth / 2, 15, { align: "center" });

    pdf.setFontSize(10);
    pdf.setTextColor("#555");
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, 22, {
      align: "center",
    });

    pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);

    const footerY = pdfHeight + 40;
    pdf.setFontSize(10);
    pdf.setTextColor("#999");
    pdf.text("Flood Prediction System • Page 1", pdfWidth / 2, footerY, {
      align: "center",
    });

    const blobUrl = pdf.output("bloburl");
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Flood Risk Assessment</h2>
        <p className="text-gray-600">Enter environmental factors to predict flood probability using our AI model</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="MonsoonIntensity" className="block text-sm font-medium text-gray-700">
              Monsoon Intensity
            </label>
            <input
              type="number"
              name="MonsoonIntensity"
              placeholder="1-10"
              onChange={handleChange}
              value={inputs.MonsoonIntensity}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              min="1"
              max="10"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="Urbanization" className="block text-sm font-medium text-gray-700">
              Urbanization Level
            </label>
            <input
              type="number"
              name="Urbanization"
              placeholder="1-10"
              onChange={handleChange}
              value={inputs.Urbanization}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              min="1"
              max="10"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="DrainageSystems" className="block text-sm font-medium text-gray-700">
              Drainage Effectiveness
            </label>
            <input
              type="number"
              name="DrainageSystems"
              placeholder="1-10"
              onChange={handleChange}
              value={inputs.DrainageSystems}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              min="1"
              max="10"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Predict Flood Risk
        </button>
      </form>

      {result !== null && (
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6" ref={resultRef}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-green-600">{result}%</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flood Risk Probability</h3>
              <p className="text-gray-600">
                {result < 30
                  ? "Low Risk - Generally safe conditions"
                  : result < 60
                    ? "Moderate Risk - Monitor weather closely"
                    : result < 80
                      ? "High Risk - Prepare emergency measures"
                      : "Critical Risk - Immediate evacuation recommended"}
              </p>
            </div>

            {graphUrl && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4 text-center">Risk Analysis Chart</h4>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <img
                    src={graphUrl}
                    alt="Flood Probability Graph"
                    className="w-full h-auto rounded-lg"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={downloadPDF}
            className="w-full bg-white border-2 border-green-500 text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            📄 Download Detailed Report
          </button>
        </div>
      )}
    </div>
  );
}

export default FloodPredictor;
