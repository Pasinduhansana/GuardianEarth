import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaBolt } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import { Droplet, Flame, Earth, Wind } from "lucide-react";
import world_globe from "../../../assets/world_globe.png";
import EmergencyResponseSection from "./EmergencyResponseSection";
import disasterimg1 from "../../../assets/disasternobg1.png";
import AIprediction from "../../../assets/AIprediction.png";
import droneimage from "../../../assets/droneimage.png";
import mobileCommandimage from "../../../assets/mobileCommandimage.png";
import { ArrowRight } from "lucide-react";
import { Quote, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AlertTriangle, MapPin, TrendingUp, ShieldCheck, AlertCircle, NotebookPen, Calendar, Users, Clock } from "lucide-react";
import StatsSection from "./StatSection";
import Footer from "./footer";
import FloodPredictor from "../prediction-model/FloodPredictor";
import { use } from "react";
import axios from "axios";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [latestDisasters, setLatestDisasters] = useState([]);
  const [loadingDisasters, setLoadingDisasters] = useState(true);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    const navigate = useNavigate();
  };
  const handleClick = () => {
    navigate("/flood-predictor");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchLatestDisasters = async () => {
      try {
        setLoadingDisasters(true);
        const response = await axios.get("http://localhost:5000/api/disaster");
        console.log("API response:", response.data);

        const disastersArray = Array.isArray(response.data) ? response.data : response.data.disasters || [];

        console.log("Disasters array:", disastersArray);

        // Filter approved disasters and get the latest 3
        const approvedDisasters = disastersArray
          .filter((disaster) => disaster.status === "Approved")
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        console.log("Approved disasters:", approvedDisasters);

        setLatestDisasters(approvedDisasters);
      } catch (error) {
        console.error("Error fetching disasters:", error);
      } finally {
        setLoadingDisasters(false);
      }
    };

    fetchLatestDisasters();
  }, []);

  const emergencyTypes = [
    {
      id: "flood",
      name: "Flood",
      icon: Droplet,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      id: "fire",
      name: "Fire",
      icon: Flame,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      id: "earthquake",
      name: "Earthquake",
      icon: Earth,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      id: "hurricane",
      name: "Hurricane",
      icon: Wind,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  const stats = [
    { value: "98%", label: "Accuracy Rate" },
    { value: "15min", label: "Average Response Time" },
    { value: "500+", label: "Disasters Managed" },
    { value: "24/7", label: "Monitoring & Support" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <div className="min-h-screen bg-white relative ">
        {/* Grid Background */}
        <div className="absolute inset-0 z-10 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
      linear-gradient(to left, #22c55e 1px, transparent 1px), 
      linear-gradient(to top, #22c55e 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              WebkitMaskImage: "linear-gradient(to left, black 10%, transparent 100%)",
              maskImage: "linear-gradient(to left, black 10%, transparent 90%)",
            }}
          ></div>
        </div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex text-left items-center pt-20 pb-4 px-10">
          <div className="container mx-auto px-4 z-10 -mt-16 flex flex-col md:flex-row items-center select-none">
            <div className="w-full md:w-1/2 text-gray-900 mb-10 md:mb-0">
              <div className="relative mb-6">
                <span className="absolute -top-8 left-0 bg-green-100 text-green-500 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  Next-Gen Technology
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                  Disaster{" "}
                  <span className="text-green-500">
                    <br />
                    Management{" "}
                  </span>
                  <br />
                  Solutions
                </h1>
              </div>
              <p className="text-sm md:text-[16px] text-gray-600 max-w-xl mb-10 leading-relaxed">
                Advanced 3D technology and real-time monitoring systems to predict, prepare for, and respond to natural disasters with unprecedented
                efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleClick}
                  className="bg-green-500 hover:bg-green-600 z-10 w-[200px] h-[38px]  justify-center text-white px-2 py-3 rounded-md transition-all duration-300 text-[15px] font-normal !rounded-button whitespace-nowrap cursor-pointer shadow-md flex items-center"
                >
                  <FaBolt className="mr-2" /> Disaster Early Warning
                </button>
                <button className="bg-white hover:bg-gray-50 w-[160px] h-[38px] gap-2 flex flex-row justify-center text-gray-800 border border-gray-200 px-[14px] py-3 rounded-md transition-all duration-300 text-[15px] font-normal !rounded-button whitespace-nowrap cursor-pointer shadow-md  items-center group">
                  <span>View Resources</span>
                  <FaArrowRight className=" transition-transform group-hover:translate-x-[2px] duration-100 mt-[0.5px] mx-[5px]" />
                </button>
              </div>
            </div>

            <img
              src={world_globe}
              alt="3D Disaster Monitoring System"
              className="absolute w-32 h-32  right-[10%] top-[20%] blur-[6px] opacity-75 -mt-14 object-cover animate-spin-slow"
            />

            <img
              src={world_globe}
              alt="3D Disaster Monitoring System"
              className="absolute w-40 h-40  right-[38%] bottom-[20%] blur-[10px] opacity-85 -mt-14 object-cover animate-spin-slow"
            />

            <img
              src={world_globe}
              alt="3D Disaster Monitoring System"
              className="absolute w-32 h-32  right-[10%] bottom-[20%] blur-[30px] opacity-100 -mt-14 object-cover animate-spin-slow"
            />

            <img
              src={world_globe}
              alt="3D Disaster Monitoring System"
              className="absolute w-32 h-32  left-[0%] bottom-[30%] z-0 blur-[30px] opacity-100 -mt-14 object-cover animate-spin-slow"
            />

            <img
              src={world_globe}
              alt="3D Disaster Monitoring System"
              className="absolute w-16 h-16  left-[18%] top-[18%] z-0 blur-[10px] opacity-40 -mt-14 object-cover animate-spin-slow"
            />

            <div className="absolute top-[25%] right-[5%] z-30">
              <div
                className="flex items-center gap-4 h-[60px]  px-2 py-4 bg-white/20 backdrop-blur-[10px] 
                        rounded-[12px] shadow-xl border border-white/10 text-white w-[200px]"
              >
                {/* Icon Container */}
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 animate-bounce mt-2" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <div className="text-2xl font-bold text-green-400 leading-none">98%</div>
                  <p className="text-sm text-gray-700 mt-1">Accuracy Rate</p>
                </div>
              </div>
            </div>

            <div
              className="absolute flex items-center gap-4 p-4 bg-white/20 backdrop-blur-[10px] 
                        rounded-[12px] shadow-xl border border-white/10 bottom-[18%] right-[10%] z-30 
                         w-[250px] h-[70px]"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-red-100/30 rounded-full shadow-md animate-ping">
                <AlertTriangle className="text-red-500 w-6 h-6" />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center">
                <div className="text-lg font-semibold text-red-600">Disaster Alert</div>
                <p className="text-sm text-gray-700">High Risk Zone</p>
              </div>
            </div>

            <div className="absolute top-[35%] right-[35%] z-30">
              <div className="flex items-center gap-4 h-[70px] px-4 py-4 bg-white/20 backdrop-blur-[10px] rounded-[12px] shadow-xl border border-white/10 text-black w-auto">
                {/* Icon Container */}
                <div className="flex items-center justify-center w-11 h-11 bg-yellow-500/20 rounded-full shadow-md animate-pulse">
                  <AlertCircle className="text-yellow-500 w-8 h-8" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <div className="text-[18px] font-semibold text-yellow-400">Warning</div>
                  <p className="text-sm text-gray-800 mt-1">High Risk Zone</p>
                </div>
              </div>
            </div>

            <div className="absolute top-[15%] right-[30%] z-30 animate-bounce">
              <div className="flex items-center bg-white/20 backdrop-blur-[10px] rounded-full shadow-xl border border-white/10 text-black ">
                {/* Icon Container */}
                <div className="flex items-center justify-center w-11 h-11 bg-blue-500/10 rounded-full shadow-md">
                  <AlertCircle className="text-blue-500 w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-[25%] right-[40%] z-30 animate-bounce">
              <div className="flex items-center bg-white/20 backdrop-blur-[10px] rounded-full shadow-xl border border-white/10 text-black ">
                {/* Icon Container */}
                <div className="flex items-center justify-center w-11 h-11 bg-green-500/10 rounded-full shadow-md">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-auto h-full max-w-[800px] max-h-[800px] relative">
                  <img src={world_globe} alt="3D Disaster Monitoring System" className="w-full h-Auto -mt-14 object-cover animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[90%] h-[90%] border-2 border-green-200 rounded-full animate-pulse opacity-50"></div>
                    <div className="absolute w-[70%] h-[70%] border border-green-300 rounded-full animate-ping opacity-30"></div>
                  </div>
                </div>
              </div>
              <style jsx>{`
                @keyframes spin-slow {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
                .animate-spin-slow {
                  animation: spin-slow 80s linear infinite;
                }
              `}</style>
            </div>
          </div>

          <div className="absolute md:w-1/2 bottom-10 left-10 h-auto flex items-center px-4 max-w-md">
            <div className="flex -space-x-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-white shadow-sm">
                <FaUserShield className="text-blue-500 text-xs" />
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-white shadow-sm">
                <FaUserShield className="text-green-500 text-xs" />
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center border border-white shadow-sm">
                <FaUserShield className="text-yellow-500 text-xs" />
              </div>
            </div>
            <span className="ml-3 text-[13px] text-gray-400 line-clamp-2">Trusted by 200+ emergency response teams worldwide</span>
          </div>
        </section>

        {/* Emergency Types Section */}
        <section className="py-8 bg-white relative overflow-hidden px-10">
          <EmergencyResponseSection emergencyTypes={emergencyTypes} activeEmergency={activeEmergency} setActiveEmergency={setActiveEmergency} />
        </section>

        {/* 3D Visualization Section */}
        <section className="py-[68px] h-auto  relative overflow-hidden px-10">
          <div className="container mx-auto h-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-[24px] font-bold text-gray-900 mb-4 text-left">Advanced 3D Visualization</h2>
                <p className="text-[15px] text-gray-600 mb-6 text-left">
                  Our cutting-edge 3D modeling technology allows emergency responders to visualize disaster scenarios in real-time, improving
                  decision-making and resource allocation.
                </p>
                <div className="space-y-8 text-left mt-12">
                  <div className="flex items-center ">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-5">
                      <MapPin className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Real-time Mapping</h3>
                      <p className="text-gray-600 text-sm">Accurate geographical representation of affected areas with live updates.</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-5">
                      <TrendingUp className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Predictive Analytics</h3>
                      <p className="text-gray-600 text-sm">AI-powered predictions to anticipate disaster progression and impact.</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-5">
                      <NotebookPen className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Evacuation Planning</h3>
                      <p className="text-gray-600 text-sm">Optimized evacuation routes based on real-time conditions and infrastructure status.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full md:w-1/2 relative ">
                <div className="absolute inset-0 flex justify-center items-center ">
                  <div className="rounded-lg overflow-hidden">
                    <img src={disasterimg1} alt="3D Visualization System" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flood Prediction Section */}
        <section className="py-16 bg-white relative overflow-hidden z-50 px-10 mt-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Flood Prediction</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
                Use our advanced machine learning model to predict flood probability based on monsoon intensity, urbanization, and drainage systems.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <FloodPredictor />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <StatsSection className="z-50 px-10" />

        {/* Technology Showcase */}
        <section className="py-8 bg-white px-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Cutting-Edge Technology</h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Our disaster management platform integrates the latest technologies to provide comprehensive emergency response solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg flex flex-col justify-between items-center overflow-hidden shadow-sm  hover:shadow-md transition-all duration-300 z-30 border border-gray-100 group bg-white">
                <div>
                  <div className="h-56 overflow-hidden w-full">
                    <img
                      src={AIprediction}
                      alt="AI Prediction Systems"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Prediction Systems</h3>
                    <p className="text-gray-600 text-sm ">
                      Machine learning algorithms that analyze historical data and environmental factors to predict disaster occurrences and severity.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFeature("ai");
                    setIsOpen(true);
                  }}
                  className="text-green-500 hover:text-green-600 my-3 duration-300 font-normal inline-flex items-center text-sm"
                >
                  Learn more <ArrowRight className="ml-2 w-4 h-4" />
                </button>{" "}
              </div>
              <div className="rounded-lg flex flex-col justify-between items-center overflow-hidden shadow-sm border  hover:shadow-md transition-all duration-300 z-30 border-gray-100 group bg-white">
                <div>
                  <div className="h-56 overflow-hidden w-full">
                    <img
                      src={droneimage}
                      alt="Drone & Satellite Network"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drone & Satellite Network</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Comprehensive aerial monitoring system that provides real-time imagery and data from disaster-affected areas.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFeature("drone");
                    setIsOpen(true);
                  }}
                  className="text-green-500 hover:text-green-600 my-3 duration-300 font-normal inline-flex items-center text-sm"
                >
                  Learn more <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
              <div className="rounded-lg flex flex-col justify-between items-center overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 z-30 border border-gray-100 group bg-white ">
                <div>
                  <div className="h-56 overflow-hidden w-full ">
                    <img
                      src={mobileCommandimage}
                      alt="Mobile Command Centers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Command Centers</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Deployable units equipped with advanced communication systems and technology for on-site disaster management.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFeature("mobile");
                    setIsOpen(true);
                  }}
                  className="text-green-500 hover:text-green-600 my-3 duration-300 font-normal inline-flex items-center text-sm"
                >
                  Learn more <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Disasters Section */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Disasters</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real-time updates on recent disaster events and emergency situations being monitored
              </p>
            </div>

            {/* Disasters Grid */}
            {loadingDisasters ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : latestDisasters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {latestDisasters.map((disaster) => (
                  <div
                    key={disaster._id}
                    className="relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-md hover:shadow-2xl transition-all duration-500 h-[480px] group cursor-pointer"
                    style={{
                      backgroundImage: disaster.images && disaster.images.length > 0 ? `url(${disaster.images[0]})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Show placeholder if no image */}
                    {(!disaster.images || disaster.images.length === 0) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <AlertTriangle className="w-20 h-20 text-gray-400" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-2xl"></div>

                    {/* Blur Overlay with Mask */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[55%] backdrop-blur-lg rounded-2xl"
                      style={{
                        maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 100%)",
                      }}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Bottom Content Area */}
                      <div className="px-6 pb-6 space-y-4">
                        {/* Title and Severity Badge */}
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-bold text-2xl text-white leading-tight">{disaster.disasterType}</h3>
                          <div className="flex-shrink-0 h-7 px-4 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/25 border border-white/40 shadow-lg">
                            <span
                              className={`text-xs font-bold ${
                                disaster.severity === "High"
                                  ? "text-red-400"
                                  : disaster.severity === "Medium"
                                    ? "text-yellow-400"
                                    : disaster.severity === "Low"
                                      ? "text-green-400"
                                      : "text-gray-300"
                              }`}
                            >
                              {disaster.severity}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-white/95 gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">{disaster.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-white/85 line-clamp-2 leading-relaxed">{disaster.description}</p>

                        {/* Divider */}
                        <div className="border-t border-white/25 pt-3"></div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between text-xs text-white/90">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(disaster.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>{disaster.peopleAffected || 0} affected</span>
                          </div>
                        </div>

                        {/* Reporter Info */}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{disaster.reporterName || "Anonymous"}</p>
                            <p className="text-xs text-white/70">Reporter</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No disasters reported yet</p>
              </div>
            )}

            {/* View All Button */}
            {latestDisasters.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => navigate("/Disaster", { state: { fromHome: true, activeTab: "disasters" } })}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-all duration-300 text-sm font-medium shadow-md inline-flex items-center group"
                >
                  View All Disasters
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="relative z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          {/* Top Wave */}
          <div className="mt-0">
            <svg className="w-full h-[80px] text-white" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path
                fill="currentColor"
                d="M0,192L60,181.3C120,171,240,149,360,138.7C480,128,600,128,720,144C840,160,960,192,1080,186.7C1200,181,1320,139,1380,117.3L1440,96V0H0Z"
              />
            </svg>
          </div>

          {/* Main Content */}
          <div className="relative z-50 py-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center bg-white/5 p-10 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md z-50">
                <Quote className="text-4xl text-green-400 mb-6 mx-auto" />
                <p className="text-lg text-slate-100 font-normal mb-8 leading-relaxed">
                  "Disaster 3D visualization technology has revolutionized how we respond to emergencies. The predictive capabilities and real-time
                  monitoring have saved countless lives during recent natural disasters."
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center">
                    <User className="text-green-400 w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white text-lg">Dr. Michael Chen</h4>
                    <p className="text-sm text-slate-300">Director, National Emergency Response Center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="">
            <svg className="w-full h-[80px] text-white" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path
                fill="currentColor"
                d="M0,160L60,144C120,128,240,96,360,117.3C480,139,600,213,720,224C840,235,960,181,1080,154.7C1200,128,1320,128,1380,117.3L1440,107V320H0Z"
              />
            </svg>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white relative overflow-hidden border-t border-gray-100 px-10">
          {/* Grid Background */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(to right, #4ade80 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-10 relative z-10">
            <div className="max-w-6xl mx-auto bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Text */}
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Ready to enhance your disaster response?</h2>
                  <p className="text-sm text-slate-300 max-w-xl">
                    Join global organizations using our 3D disaster management platform for faster, smarter response and planning.
                  </p>
                </div>

                {/* Button */}
                <div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-all duration-300 text-sm font-medium shadow-md whitespace-nowrap">
                    Visit Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="z-50 relative border-t border-gray-100 bottom-0 w-full">
          <Footer />
        </section>
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-3xl p-6 shadow-lg relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              ✕
            </button>
            {selectedFeature === "ai" && (
              <>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <img src={AIprediction} alt="AI Prediction" className="w-72 h-72 object-cover rounded-md" />
                    {/* Verticle Seperater */}
                    <div className="w-1 h-72 bg-gray-300 mx-4"></div>

                    <div className="flex-col flex gap-6">
                      <h2 className="text-xl font-bold text-gray-900 text-left">AI Prediction Systems</h2>
                      <p className="text-sm text-left text-gray-700 mb-2">
                        Machine learning algorithms that analyze historical and environmental data to predict disasters before they happen. These
                        systems help in issuing early warnings and making better preparedness plans. <br />
                        <br />
                        By leveraging vast datasets, our AI models can identify patterns and trends that human analysis might miss, enabling more
                        accurate and timely predictions.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedFeature === "drone" && (
              <>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <img src={droneimage} alt="Drone & Satellite Network" className="w-72 h-72 object-cover rounded-md" />
                    {/* Vertical Separator */}
                    <div className="w-1 h-72 bg-gray-300 mx-4"></div>

                    <div className="flex-col flex gap-6">
                      <h2 className="text-xl font-bold text-gray-900 text-left">Drone & Satellite Network</h2>
                      <p className="text-sm text-left text-gray-700 mb-2">
                        Our aerial systems provide real-time imagery and situational updates from affected zones, improving situational awareness and
                        coordination. <br />
                        <br />
                        With advanced drone and satellite technology, we deliver continuous surveillance capabilities that enable emergency responders
                        to make informed decisions quickly and effectively during critical situations.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedFeature === "mobile" && (
              <>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <img src={mobileCommandimage} alt="Mobile Command Centers" className="w-72 h-72 object-cover rounded-md" />
                    {/* Vertical Separator */}
                    <div className="w-1 h-72 bg-gray-300 mx-4"></div>

                    <div className="flex-col flex gap-6">
                      <h2 className="text-xl font-bold text-gray-900 text-left">Mobile Command Centers</h2>
                      <p className="text-sm text-left text-gray-700 mb-2">
                        Fully equipped mobile units that serve as operational hubs during emergencies. They include advanced communication,
                        coordination, and surveillance tools. <br />
                        <br />
                        These deployable command centers bring critical infrastructure directly to disaster zones, enabling field teams to coordinate
                        response efforts efficiently and maintain real-time communication with central operations.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Home;
