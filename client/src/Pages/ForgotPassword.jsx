import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ShieldQuestion, ShieldCheck } from "lucide-react";
import { BackgroundBeams } from "../Components/ui/background-beams";
import axios from "axios";
import toast from "react-hot-toast";
import bgimage from "../assets/bg2.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      // Show success message if needed
      console.log("Success:", response.data.message);
      setSuccess(true);
    } catch (error) {
      console.error("Error sending password reset email:", error.response?.data?.message || error.message);
      toast.error("Error sending password reset email:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className=" min-h-screen relative overflow-hidden bg-gray-900">
      <img src={bgimage} alt="" className="absolute w-full h-full object-cover blur-md " />
      <BackgroundBeams className="hidden" />

      {/* Diagonal divider */}
      <div
        className="absolute inset-0 hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 40%)",
          background: "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,50,0,0.3) 100%)",
        }}
      />

      <div className="flex flex-row items-stretch w-full h-full p-10 min-h-screen  gap-0 max-h-screen rounded-[20px]  overflow-hidden relative">
        <div className="rounded-[10px_0_0_10px] overflow-hidden drop-shadow-2xl border-[3px] border-white/10 ">
          <div className="absolute inset-0 m-10 max-w-lg p-8 rounded-[10px] bg-black/30 text-left space-y-8 flex flex-col justify-between">
            {/* Animated Title and description */}
            <div className="flex flex-col space-y-4">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center"
              >
                <ShieldCheck className="text-green-500 w-5 h-5 mr-2" />
                <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  Guardian Earth
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-proxima font-extrabold text-[3.2rem] leading-tight tracking-tight hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
                animate-none duration-200 text-white/90 drop-shadow-lg"
              >
                Secure Access.
                <br />
                Reset Instantly.
              </motion.h1>

              {/* Animated Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="font-poppins text-white/85 pt-4 text-xl font-medium leading-relaxed drop-shadow-md"
              >
                Don’t worry — we’ll help you get back into your account quickly and securely{" "}
              </motion.p>
            </div>

            {/* Scrolling labels */}
            <div className="overflow-hidden w-full relative mt-6">
              <div className="flex animate-scroll whitespace-nowrap space-x-4">
                {["Flood", "Earthquake", "Fire", "Storm", "Landslide", "Evacuation", "Emergency Alert", "Tsunami", "Wildfire", "Cyclone"].map(
                  (label, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-4 py-2 rounded-[4px] text-white text-sm font-semibold bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors duration-300 cursor-pointer shadow-sm"
                    >
                      {label}
                    </span>
                  )
                )}
                {/* Duplicate for smooth continuous scroll */}
                {["Flood", "Earthquake", "Fire", "Storm", "Landslide", "Evacuation", "Emergency Alert", "Tsunami", "Wildfire", "Cyclone"].map(
                  (label, idx) => (
                    <span
                      key={"dup-" + idx}
                      className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer shadow-sm"
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          <img src={bgimage} alt="" className=" h-auto object-cover " />
        </div>

        {/* Content container */}
        <div className="flex items-center justify-end w-full relative min-w-[450px] max-w-4/12 shadow-lg border-[3px] border-white/10">
          <div className="w-full h-full  max-w-3xl ">
            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-sm rounded-[0_10px_10px_0] h-full flex flex-col justify-center  shadow-2xl p-8 relative"
            >
              <div className="text-center max-w-lg mx-auto">
                <ShieldQuestion className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset Password</h2>
                <p className="mt-2 text-sm text-gray-600">Enter your email to receive reset instructions</p>
              </div>

              {!submitted ? (
                <form className="mt-8 space-y-8 w-full max-w-96 mx-auto" onSubmit={handleSubmit}>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border h-[38px] text-[14px] border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Email address"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-normal text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Send Reset Instructions
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                  <div className="bg-green-50 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">Check your email</h3>
                  <p className="text-gray-600">We've sent password reset instructions to {email}</p>
                </motion.div>
              )}

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center -mt-4 py-2 px-4 border border-transparent rounded-lg shadow-sm text-[14px] font-normal text-green-600 border-green-100 outline-none ring-0 bg-white hover:border-green-300  transition-colors"
                >
                  Back to Sign in
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
