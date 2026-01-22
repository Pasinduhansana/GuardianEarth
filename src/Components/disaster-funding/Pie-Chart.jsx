import React, { useRef, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const COLOR_GRADIENTS = [
  ["#10b981", "#34d399"], // Emerald gradient - matches website theme
  ["#059669", "#6ee7b7"], // Dark emerald gradient
  ["#047857", "#a7f3d0"], // Forest green gradient
  ["#065f46", "#d1fae5"], // Deep green gradient
  ["#14b8a6", "#5eead4"], // Teal gradient
  ["#0d9488", "#99f6e4"], // Dark teal gradient
  ["#0f766e", "#ccfbf1"], // Deep teal gradient
  ["#115e59", "#f0fdfa"], // Darkest teal gradient
];

const DisasterPieChart = ({ data }) => {
  const chartRef = useRef();
  const [bgGradients, setBgGradients] = useState([]);

  // Create gradients after chart is rendered
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradients = (data || []).map((_, i) => {
      const [start, end] = COLOR_GRADIENTS[i % COLOR_GRADIENTS.length];
      const gradient = ctx.createRadialGradient(90, 90, 30, 90, 90, 120);
      gradient.addColorStop(0, end);
      gradient.addColorStop(1, start);
      return gradient;
    });
    setBgGradients(gradients);
    // eslint-disable-next-line
  }, [data]);

  const disasterData = {
    labels: data && data.length > 0 ? data.map((d) => d.type) : [],
    datasets: [
      {
        data: data && data.length > 0 ? data.map((d) => d.count) : [],
        backgroundColor: bgGradients.length ? bgGradients : COLOR_GRADIENTS.map((g) => g[0]),
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 20,
        hoverBorderWidth: 4,
        cutout: "70%", // Creates modern donut chart
        spacing: 3,
        borderRadius: 8,
      },
    ],
  };

  // Modern donut chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "Inter, sans-serif",
            size: 13,
            weight: "500",
          },
          color: "#059669",
          padding: 16,
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#10b981",
        bodyColor: "#059669",
        borderColor: "#10b981",
        borderWidth: 2,
        padding: 16,
        cornerRadius: 12,
        titleFont: { weight: "600", size: 15 },
        bodyFont: { size: 14, weight: "500" },
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed} (${((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`,
        },
      },
      title: {
        display: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="relative">
      <Pie ref={chartRef} data={disasterData} options={options} />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        style={{ marginTop: "-20px" }}
      >
        <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Total</p>
        <p className="text-3xl font-bold text-emerald-700">{data && data.length > 0 ? data.reduce((sum, d) => sum + d.count, 0) : 0}</p>
        <p className="text-xs text-gray-400 mt-1">Disasters</p>
      </div>
    </div>
  );
};

export default DisasterPieChart;
