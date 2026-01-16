import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { MapPin, Loader2 } from "lucide-react";

const PostForm = ({ initialData, isEdit, onPostCreated, onUpdateSuccess }) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Disaster",
    location: "",
    disasterDate: "",
    imageUrl: "",
    isUpcoming: false,
  });

  const createPost = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }
      onPostCreated();
      onUpdateSuccess();
      toast.success("Post Created successfully");
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const updatePost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }
      toast.success("Post updated successfully");
      onUpdateSuccess();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        disasterDate: initialData.disasterDate ? new Date(initialData.disasterDate).toISOString().split("T")[0] : "",
      });
    }
  }, [initialData]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    maxFiles: 1,
    noClick: true,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
          // Send image to your backend to upload to Cloudinary
          const response = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          if (data.url) {
            setFormData((prev) => ({
              ...prev,
              imageUrl: data.url, // Save Cloudinary URL
            }));
          } else {
            toast.error("Failed to upload image");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
        }
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (isEdit) {
      await updatePost(); // Make sure the update happens only once.
    } else {
      await createPost();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updatedValue = type === "checkbox" ? checked : value;

      // Handle the logic for disasterDate to automatically check "Mark as upcoming" for future dates
      if (name === "disasterDate") {
        const futureDate = new Date(value) > new Date();
        updatedValue = value;

        return {
          ...prev,
          [name]: updatedValue,
          isUpcoming: futureDate, // Automatically check if the date is in the future
        };
      }

      return { ...prev, [name]: updatedValue };
    });
  };

  const handleClear = () => {
    setFormData({
      title: "",
      description: "",
      category: "Disaster",
      location: "",
      disasterDate: "",
      imageUrl: "",
      isUpcoming: false,
    });
    setCoordinates({ lat: null, lon: null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Two Column Layout: Fields on Left, Image on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Form Fields */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full h-9 px-3 text-sm ring-0 outline-none rounded-lg border border-gray-200 focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 text-sm ring-0 outline-none rounded-lg border border-gray-200 focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter post description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-9 px-3 accent-green-300 appearance-none ring-0 outline-none text-sm rounded-lg border border-gray-200 focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
              >
                {["Floods", "Earthquakes", "Landslides", "Tornadoes", "Wildfires", "Hurricanes", "Tsunamis"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full h-9 px-3 ring-0 outline-none text-sm rounded-lg border border-gray-200 focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          {formData.category && (
            <div>
              <label htmlFor="disasterDate" className="block text-sm font-medium text-gray-700 mb-1">
                Disaster Date
              </label>
              <input
                type="date"
                id="disasterDate"
                name="disasterDate"
                value={formData.disasterDate ? new Date(formData.disasterDate).toISOString().split("T")[0] : ""}
                onChange={handleInputChange}
                className="w-full h-9 px-3 text-sm rounded-lg border ring-0 outline-none focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              id="isUpcoming"
              name="isUpcoming"
              type="checkbox"
              checked={formData.isUpcoming}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 accent-green-500 focus:ring-green-500 border-gray-300 rounded transition-colors"
            />
            <label htmlFor="isUpcoming" className="ml-2 block text-sm text-gray-900">
              Mark as upcoming
            </label>
          </div>
        </div>

        {/* Right Side: Image Upload */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
          <div
            {...getRootProps()}
            className={`h-full flex justify-center items-center px-6 border-2 ${
              isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
            } border-dashed rounded-lg transition-colors cursor-pointer hover:border-green-400`}
          >
            <div className="space-y-3 text-center w-full">
              {formData.imageUrl ? (
                <div className="relative w-full h-full">
                  <img src={formData.imageUrl} alt="Preview" className="mx-auto max-h-[450px] w-full object-contain rounded-lg" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, imageUrl: "" }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 h-8 w-8 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <FaImage className="mx-auto h-16 w-16 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <input {...getInputProps()} />
                    <p className="text-gray-500">
                      <span
                        onClick={open}
                        className="text-green-600 font-semibold cursor-pointer hover:text-green-700 hover:underline transition-colors"
                      >
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 pt-5 border-t border-gray-200 justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="w-32 h-9 px-4 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none transition-all duration-200"
        >
          Clear All
        </button>
        <button
          type="submit"
          className="w-40 h-9 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-600 focus:outline-none transition-all duration-200 shadow-lg hover:shadow-green-500/25"
        >
          {isEdit ? "Update Post" : "Add Post"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
