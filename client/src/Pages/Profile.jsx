import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Camera, User, Mail, MapPin, Calendar, Lock, Eye, EyeOff, Shield, Settings, Bell, Bookmark, HelpCircle } from "lucide-react";
import default_profile from "../assets/profile.png";
import { ProfileSkeleton } from "../Components/ui/LoadingSkeleton";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setPageLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUser(data);
      setPreviewImage(data.profile_img);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setPageLoading(false);
    }
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          setPreviewImage(data.url);
          setUser({ ...user, profile_img: data.url });
          toast.success("Profile picture uploaded successfully!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload profile picture");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Reset errors
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validate fields
    let hasError = false;
    if (!passwords.currentPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required",
      }));
      hasError = true;
    }

    if (!passwords.newPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      hasError = true;
    } else if (!validatePassword(passwords.newPassword)) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      }));
      hasError = true;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  // Tab navigation
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];

  if (pageLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 justify-center">
            {/* Profile Image */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm bg-white">
                <img src={previewImage || user.profile_img || default_profile} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                htmlFor="profile-image"
                className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 rounded-lg shadow-md cursor-pointer hover:bg-emerald-700 transition-colors group"
              >
                <Camera className="w-4 h-4 text-white" />
                <input type="file" id="profile-image" className="hidden" accept="image/*" onChange={handleImageChange} disabled={loading} />
              </motion.label>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-bold text-gray-800 mb-1">
                {user.name || "Your Name"}
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-sm mb-3"
              >
                {user.email || "your.email@example.com"}
              </motion.p>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 justify-center md:justify-start"
              >
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {user.role || "Member"}
                </span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Page Content - All Sections Visible */}
      <div className="max-w-[1800px] mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info & Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                    <p className="text-gray-500 text-xs">Update your personal details</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name || ""}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email || ""}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ""}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      Country
                    </label>
                    <input
                      type="text"
                      value={user.Country || ""}
                      onChange={(e) => setUser({ ...user, Country: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Change Password Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                    <p className="text-gray-500 text-xs">Update your password to keep your account secure</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handlePasswordChange} className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-sm text-left font-medium text-gray-700 mb-1.5 block">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>}
                  </div>

                  <div className="relative">
                    <label className="text-sm text-left font-medium text-gray-700 mb-1.5 block">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
                  </div>

                  <div className="relative">
                    <label className="text-sm text-left font-medium text-gray-700 mb-1.5 block">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                    <p className="text-gray-500 text-xs">Manage how you receive notifications</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[
                    { title: "Disaster Alerts", description: "Get notified about new disasters in your area", enabled: true },
                    { title: "Community Updates", description: "Updates from community members and organizations", enabled: true },
                    { title: "Resource Alerts", description: "Get notified about new resources and support", enabled: false },
                    { title: "Volunteer Opportunities", description: "Notifications about ways to help", enabled: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                    >
                      <div>
                        <p className="text-sm text-left font-medium text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar Cards */}
          <div className="space-y-4">
            {/* Account Status Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 text-left">Account Status</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs font-medium text-left text-gray-700">Account Type</p>
                    <p className="text-[10px] text-left text-gray-500 mt-0.5">Current plan</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">
                    {user.role || "Standard"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs font-medium text-left text-gray-700">Member Since</p>
                    <p className="text-[10px] text-left text-gray-500 mt-0.5">Join date</p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs font-medium text-left text-gray-700">Last Login</p>
                    <p className="text-[10px] text-left text-gray-500 mt-0.5">Recent activity</p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Today</span>
                </div>
              </div>
            </motion.div>

            {/* Security Status Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 text-left">Security</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs font-medium text-left text-gray-700">Password Strength</p>
                    <p className="text-[10px] text-left text-gray-500 mt-0.5">Security level</p>
                  </div>
                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-md text-xs font-semibold">Medium</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs font-medium text-left text-gray-700">Two-Factor Auth</p>
                    <p className="text-[10px] text-left text-gray-500 mt-0.5">Extra protection</p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-md text-xs font-semibold">Disabled</span>
                </div>
              </div>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                <HelpCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1.5 text-left">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-3 text-left">Our support team is here to assist you with any questions or concerns.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all"
              >
                Contact Support
              </motion.button>
            </motion.div>

            {/* Saved Items Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Bookmark className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 text-left">Saved Items</h2>
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Bookmark className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-xs text-gray-500 mb-3">No saved items yet. Save posts and resources to access them quickly.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
                >
                  Browse Resources
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
