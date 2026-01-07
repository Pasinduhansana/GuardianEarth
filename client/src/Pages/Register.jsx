import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { BackgroundBeams } from "../Components/ui/background-beams";
import axios from "axios";
import toast from "react-hot-toast";
import bgimage from "../assets/login.jpg";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        password,
      });

      toast.success("Registration successful!");
      // Redirect after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // Show error toast
      const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMsg);

      // Reset only password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    }
  };

  return (
    <div className=" min-h-screen relative overflow-hidden bg-gray-900">
      <img src={bgimage} alt="" className="absolute w-full h-full object-cover blur-md " />
      <BackgroundBeams className="z-20 bg-white hidden" />
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
                Be Resilient.
                <br />
                Stay Prepared.
              </motion.h1>

              {/* Animated Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="font-poppins text-white/85 pt-4 text-xl font-medium leading-relaxed drop-shadow-md"
              >
                Create your account to receive early alerts, stay informed, and help protect your community in times of disaster.
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
              <div className="text-centertext-center max-w-lg mx-auto">
                <ShieldCheck className="mx-auto h-12 w-12 text-green-600 -my-3" />
                <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-1 text-sm text-gray-600">Join the Disaster Response Network</p>
              </div>
              <form className="mt-8 space-y-8 w-full max-w-96 mx-auto" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 w-full px-3 py-2 h-[38px] text-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border h-[38px] text-[14px]  border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Email address"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute  z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border h-[38px] text-[14px]  border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Phone Number"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute  z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border h-[38px] text-[14px]  border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showPassword1 ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10 w-full px-3 py-2 border h-[38px] text-[14px]  border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword1((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {!showPassword1 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full  flex justify-center py-2 px-4  border border-transparent rounded-lg shadow-sm text-sm font-normal text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Create Account
                </button>

                <p className="text-center text-sm text-gray-600 ">
                  Already have an account?{" "}
                  <Link to="/login" className="font-normal text-green-600 hover:text-green-500 transition-colors ">
                    Sign in
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

export default Register;
