import axios from "axios";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CiExport } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Brain, Database, TrendingUp, CheckCircle2 } from "lucide-react";
import { FLOOD_API_URL } from "../../../config/api";

function FloodPredictor() {
  const [inputs, setInputs] = useState({
    MonsoonIntensity: "",
    Urbanization: "",
    DrainageSystems: "",
  });

  const [result, setResult] = useState(null);
  const [graphUrl, setGraphUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const resultRef = useRef();

  const processingSteps = [
    { icon: Database, text: "Collecting environmental data parameters", color: "text-blue-500" },
    { icon: Brain, text: "Analyzing historical flood patterns", color: "text-purple-500" },
    { icon: TrendingUp, text: "Computing risk probability vectors", color: "text-orange-500" },
    { icon: CheckCircle2, text: "Refining prediction thresholds", color: "text-green-500" },
  ];

  useEffect(() => {
    let interval;
    if (isProcessing && currentStep < processingSteps.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < processingSteps.length - 1) {
            return prev + 1;
          }
          return prev; // Stop at the last step
        });
      }, 2500); // 10 seconds / 4 steps = 2.5 seconds per step
    }
    return () => clearInterval(interval);
  }, [isProcessing, currentStep]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    setGraphUrl(null);
    setCurrentStep(0);

    try {
      const res = await axios.post(`${FLOOD_API_URL}/predict`, inputs);

      // Delay showing result by 5 seconds
      setTimeout(() => {
        setResult(res.data.floodProbability);
        setGraphUrl(res.data.graphUrl);
        setIsProcessing(false);
      }, 10000);
    } catch (err) {
      setIsProcessing(false);
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

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Define margins
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Calculate image dimensions with margins
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add decorative header background
    pdf.setFillColor(34, 197, 94); // Green color
    pdf.rect(0, 0, pageWidth, 35, "F");

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFont("helvetica", "bold");
    pdf.text("Guardian Earth", pageWidth / 2, 15, { align: "center" });

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Flood Risk Prediction Report", pageWidth / 2, 25, { align: "center" });

    // Date and metadata
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    pdf.text(`Generated: ${dateStr}`, margin, 45);

    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 50, pageWidth - margin, 50);

    // Prediction Details Section
    let yPosition = 60;

    pdf.setFontSize(12);
    pdf.setTextColor(34, 197, 94);
    pdf.setFont("helvetica", "bold");
    pdf.text("Input Parameters", margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Monsoon Intensity: ${inputs.MonsoonIntensity}/10`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Urbanization Level: ${inputs.Urbanization}/10`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Drainage Effectiveness: ${inputs.DrainageSystems}/10`, margin + 5, yPosition);

    yPosition += 12;

    // Risk Assessment Box
    pdf.setFillColor(240, 253, 244); // Light green background
    pdf.setDrawColor(34, 197, 94);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, yPosition, contentWidth, 20, 3, 3, "FD");

    pdf.setFontSize(12);
    pdf.setTextColor(34, 197, 94);
    pdf.setFont("helvetica", "bold");
    pdf.text("Flood Risk Probability", margin + 5, yPosition + 8);

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    const riskColor = result < 30 ? [34, 197, 94] : result < 60 ? [234, 179, 8] : result < 80 ? [249, 115, 22] : [239, 68, 68];
    pdf.setTextColor(...riskColor);
    pdf.text(`${result}%`, pageWidth - margin - 5, yPosition + 13, { align: "right" });

    yPosition += 25;

    // Risk Level Description
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.setFont("helvetica", "italic");
    const riskDesc =
      result < 30
        ? "Low Risk - Generally safe conditions"
        : result < 60
          ? "Moderate Risk - Monitor weather closely"
          : result < 80
            ? "High Risk - Prepare emergency measures"
            : "Critical Risk - Immediate evacuation recommended";
    pdf.text(riskDesc, pageWidth / 2, yPosition, { align: "center" });

    yPosition += 12;

    // Analysis Chart Section
    if (imgHeight > 0) {
      // Check if content fits on current page
      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(12);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont("helvetica", "bold");
      pdf.text("Visual Analysis", margin, yPosition);

      yPosition += 8;

      // Add image with proper margins and scaling
      const maxImageHeight = pageHeight - yPosition - margin - 20; // Reserve space for footer
      let finalImgHeight = imgHeight;
      let finalImgWidth = imgWidth;

      if (imgHeight > maxImageHeight) {
        finalImgHeight = maxImageHeight;
        finalImgWidth = (canvas.width * finalImgHeight) / canvas.height;
      }

      // Center the image if it's smaller than content width
      const imgXPosition = margin + (contentWidth - finalImgWidth) / 2;

      pdf.addImage(imgData, "PNG", imgXPosition, yPosition, finalImgWidth, finalImgHeight);
      yPosition += finalImgHeight + 10;
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont("helvetica", "normal");
    pdf.text("Guardian Earth - Disaster Management System", margin, footerY);
    pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, pageWidth - margin, footerY, { align: "right" });

    // Divider above footer
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    const blobUrl = pdf.output("bloburl");
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top row with export button */}
      <div className="flex flex-row justify-between w-full items-center ">
        <div className="text-left ">
          <h2 className="text-lg font-semibold text-left text-gray-900 mb-1">Flood Risk Assessment</h2>
          <p className="text-gray-600 text-left text-base">Enter environmental factors to predict flood probability using our AI model</p>
        </div>

        <button
          type="button"
          onClick={downloadPDF}
          disabled={result === null}
          className={`px-4 bg-white border h-[30px] font-normal rounded-md text-[13px] transition-all duration-300 ${
            result !== null
              ? "border-green-500 text-green-600 hover:bg-green-50 cursor-pointer"
              : "border-gray-300 text-gray-400 hover:bg-gray-50 cursor-not-allowed opacity-60"
          }`}
        >
          <div className="flex flex-row items-center gap-2">
            <CiExport className={`w-4 h-4 ${result !== null ? "text-green-600" : "text-gray-400"}`} />
            <p>Export Report</p>
          </div>
        </button>
      </div>

      {/* horizontal seperator */}
      <hr className="my-4 border-gray-200" />

      <div className="flex flex-row w-full mt-6 gap-10 min-h-[370px]">
        <form onSubmit={handleSubmit} className="space-y-6 w-[30%] flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-left">
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
                className="w-full px-4 py-3 h-9 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
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
                className="w-full px-4 py-3 h-9 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
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
                className="w-full px-4 py-3 h-9 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                min="1"
                max="10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 z-10 w-full h-[38px]  justify-center text-white px-2 py-3 rounded-md transition-all duration-300 text-[15px] font-normal !rounded-button whitespace-nowrap cursor-pointer shadow-md flex items-center"
          >
            Predict Flood Risk
          </button>
        </form>

        {/* Verticle Seperator */}
        <div className="w-px bg-gray-200 " />

        <div className=" rounded-md w-[70%]" ref={resultRef}>
          <AnimatePresence mode="wait">
            {/* Processing State */}
            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6"
              >
                {/* Animated Loader */}
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Brain className="w-8 h-8 text-green-500" />
                  </motion.div>
                </div>

                {/* Processing Steps */}
                <div className="space-y-3 w-full max-w-md">
                  <AnimatePresence mode="wait">
                    {processingSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: currentStep === index ? 1 : 0.3,
                          x: 0,
                          scale: currentStep === index ? 1 : 0.95,
                        }}
                        transition={{ duration: 2 }}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          currentStep === index ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <step.icon className={`w-5 h-5 ${currentStep === index ? step.color : "text-gray-400"}`} />
                        <p className={`text-sm font-medium ${currentStep === index ? "text-gray-900" : "text-gray-500"}`}>{step.text}</p>
                        {currentStep === index && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                            <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-sm text-gray-500">
                  AI model processing your request...
                </motion.p>
              </motion.div>
            )}

            {/* Initial State */}
            {!isProcessing && result === null && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full min-h-[300px]"
              >
                <p className="text-gray-500 italic text-base">Prediction results will be displayed here after submission.</p>
              </motion.div>
            )}

            {/* Result State */}
            {!isProcessing && result !== null && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-row-reverse justify-between items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`inline-flex items-center justify-center w-24 h-8 shadow-sm rounded-full mb-1 ${
                      result < 30 ? "bg-green-100" : result < 60 ? "bg-yellow-100" : result < 80 ? "bg-orange-100" : "bg-red-100"
                    }`}
                  >
                    <span
                      className={`text-md font-bold ${
                        result < 30 ? "text-green-500" : result < 60 ? "text-yellow-600" : result < 80 ? "text-orange-600" : "text-red-600"
                      }`}
                    >
                      {result}%
                    </span>
                  </motion.div>

                  <div className="flex flex-col text-left">
                    <h3 className="text-lg font-semibold text-gray-900 ">Flood Risk Probability</h3>
                    <p className="text-gray-600 text-base">
                      {result < 30
                        ? "Low Risk - Generally safe conditions"
                        : result < 60
                          ? "Moderate Risk - Monitor weather closely"
                          : result < 80
                            ? "High Risk - Prepare emergency measures"
                            : "Critical Risk - Immediate evacuation recommended"}
                    </p>
                  </div>
                </motion.div>

                {graphUrl && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <img
                        src={graphUrl}
                        alt="Flood Probability Graph"
                        className="w-full h-auto rounded-lg"
                        style={{ maxHeight: "250px", objectFit: "contain" }}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default FloodPredictor;
