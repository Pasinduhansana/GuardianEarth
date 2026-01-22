import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { BackgroundBeams } from "../Components/ui/background-beams";
import axios from "axios";
import toast from "react-hot-toast";
import bgimage from "../assets/bg7.jpg";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token to localStorage or context
      localStorage.setItem("token", res.data.token);
      const { token, user } = res.data;
      login(token, user);
      // Redirect or show success

      toast.success("Login successful", res.data);
      if (user.role === "admin") {
        navigate("/admin/Dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className=" min-h-screen relative overflow-hidden bg-gray-900">
      <motion.img
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        duration={1.5}
        src={bgimage}
        alt=""
        className="absolute w-full h-full object-cover blur-md "
      />

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
        <div className="rounded-[10px_0_0_10px] grow overflow-hidden drop-shadow-2xl border-[3px] border-r-0 border-white/10 ">
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
                animate-none duration-200 text-white/90 drop-shadow-lg select-none"
              >
                Learn Today.
                <br />
                Survive Tomorrow.
              </motion.h1>

              {/* Animated Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="font-poppins text-white/85 pt-4 text-xl font-medium leading-relaxed drop-shadow-md"
              >
                Early alerts, coordinated response, and real-time insights to reduce risk and save lives.
              </motion.p>
            </div>

            {/* Scrolling labels */}
            <div className="overflow-hidden w-full relative mt-6">
              <div className="flex animate-scroll whitespace-nowrap space-x-4">
                {["Flood", "Earthquake", "Fire", "Storm", "Landslide", "Evacuation", "Emergency Alert", "Tsunami", "Wildfire", "Cyclone"].map(
                  (label, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-4 py-2 rounded-[4px] text-white text-sm font-semibold bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer shadow-sm"
                    >
                      {label}
                    </span>
                  ),
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
                  ),
                )}
              </div>
            </div>
          </div>
          <img src={bgimage} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Content container */}
        <div className="flex items-center max-w-md justify-end w-full relative min-w-[450px] max-w-4/12 shadow-lg border-[3px] border-l-0 border-white/10">
          <div className="w-full h-full ">
            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white backdrop-blur-sm rounded-[0_10px_10px_0] h-full flex flex-col justify-center  shadow-2xl p-8 relative"
            >
              <div className="text-center max-w-lg mx-auto">
                <ShieldCheck className="mx-auto h-16 w-16 text-green-600 -my-3" />
                <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
              </div>
              <form className="mt-8 space-y-8 w-full max-w-96 mx-auto" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="email"
                        name="username"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full border h-[38px] text-[14px] border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Email or Username"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute z-10  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 w-full px-3 py-2 border h-[38px] text-[14px] border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>{" "}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 relative">
                    {/* Hidden Checkbox */}
                    <input id="remember-me" name="remember-me" type="checkbox" className="peer  hidden" />
                    {/* Custom Checkbox UI */}
                    <label
                      htmlFor="remember-me"
                      className="w-5 h-5 inline-flex items-center justify-center rounded-md border border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors duration-200 cursor-pointer"
                    >
                      <Check className="w-4 h-4 z-10 text-white  peer-checked:block" />
                    </label>

                    {/* Label Text */}
                    <span className="text-sm text-gray-900">Remember me</span>
                  </div>

                  <Link to="/forgot-password" className="text-[14px]  font-normal text-green-600 hover:text-green-500 transition-colors">
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Sign in
                </button>

                <p className="mt-2 text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-normal text-green-600 hover:text-green-500 transition-colors">
                    Register here
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
