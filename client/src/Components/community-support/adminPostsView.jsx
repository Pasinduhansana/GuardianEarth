import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaPlus, FaImage, FaMapMarkerAlt, FaCalendarAlt, FaTags, FaTable, FaTh, FaSearch } from "react-icons/fa";
import { Image, Plus, LayoutGrid, List } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { format } from "date-fns";
import { Toaster, toast } from "react-hot-toast";
import Modal from "../main-components/Model";
import { useModal } from "../main-components/ModalContext";

import PostForm from "./PostForm";

const adminPostView = () => {
  const [imageModalUrl, setImageModalUrl] = useState(null);
  const [imageModalTitle, setImageModalTitle] = useState("");
  const [imageModalDescription, setImageModalDescription] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isModalOpen, setIsModalOpen } = useModal();
  const [pendingPosts, setPendingPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const deleteToastRef = useRef(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Disaster");
  const [location, setLocation] = useState("");
  const [disasterDate, setDisasterDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [dateError, setDateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/posts");
      const data = await response.json();
      const filtered = Array.isArray(data)
        ? data
            .filter((post) => (statusFilter === "All" ? true : post.status === statusFilter))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setPosts(filtered);
    } catch (error) {
      toast.error("Error fetching posts: " + error.message);
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFocusSearch) {
      searchInputRef.current?.focus();
      setShouldFocusSearch(false);
    }

    fetch("/api/posts/status?status=pending")
      .then((res) => res.json())
      .then(setPendingPosts);

    fetch("/api/posts/status?status=approved")
      .then((res) => res.json())
      .then(setApprovedPosts);

    fetchPosts();
  }, [shouldFocusSearch, statusFilter]);

  const approvePost = async (postId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/approve`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to approve post");
      toast.success("Post approved successfully");
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectPost = async (postId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/reject`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to reject post");
      toast.success("Post rejected");
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const filteredPosts = posts.filter((post) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm) ||
      post.location.toLowerCase().includes(searchTerm)
    );
  });

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setCategory(post.category);
    setLocation(post.location);
    setDisasterDate(post.disasterDate || "");
    setImageUrl(post.imageUrl);
    setIsUpcoming(post.isUpcoming);
    setIsEditModalOpen(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (postId) => {
    if (deleteToastRef.current) {
      return;
    }
    toast.dismiss();
    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <p>Are you sure you want to delete this post?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  // Send DELETE request to backend
                  const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                    method: "DELETE",
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.message || "Failed to delete post");
                  }

                  // Remove from local state
                  setPosts((prev) => prev.filter((post) => post._id !== postId));
                  toast.dismiss(t.id);
                  toast.success("Post deleted successfully");
                } catch (error) {
                  toast.dismiss(t.id);
                  toast.error("Error deleting post: " + error.message);
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Disaster");
    setLocation("");
    setDisasterDate("");
    setImageUrl("");
    setIsUpcoming(false);
    setDateError("");
    setSuccessMessage("");
    setEditingPost(null);
  };

  const TableView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Post Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.map((post, index) => (
              <tr
                key={post._id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-emerald-50/50 transition-all duration-200 group`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{post.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">{post.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-left">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-700 text-left">{post.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === "approved"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : post.status === "rejected"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          post.status === "approved" ? "bg-green-500" : post.status === "rejected" ? "bg-red-500" : "bg-yellow-500"
                        }`}
                      ></span>
                      {post.status || "Pending"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {post.status === "pending" && (
                      <>
                        <button
                          onClick={() => approvePost(post._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => rejectPost(post._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setImageModalUrl(post.imageUrl);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Preview"
                    >
                      <Image className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-left">
      {filteredPosts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
        >
          {/* Image Section */}
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  post.status === "approved"
                    ? "bg-green-500/90 text-white"
                    : post.status === "rejected"
                      ? "bg-red-500/90 text-white"
                      : "bg-yellow-500/90 text-white"
                }`}
              >
                {post.status || "Pending"}
              </span>
            </div>
            {/* Category Badge */}
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content Section - Flex grow to push buttons down */}
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-emerald-600 transition-colors">{post.title}</h2>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{post.description}</p>

            {/* Info Grid */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center text-xs text-gray-500">
                <FaMapMarkerAlt className="mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{post.location}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <FaCalendarAlt className="mr-1.5 text-gray-400 flex-shrink-0" />
                <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
              </div>
              {post.category === "Disaster" && post.disasterDate && (
                <div className="flex items-center text-xs font-medium text-red-600">
                  <span className="mr-1.5">🚨</span>
                  <span>{format(new Date(post.disasterDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="font-medium">{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="font-medium">{post.comments?.length || 0}</span>
              </div>
            </div>

            {/* Spacer to push buttons to bottom */}
            <div className="flex-grow"></div>

            {/* Action Buttons Section - Pushed to bottom */}
            <div className="pt-3 border-t border-gray-100 mt-auto">
              {/* Approve/Reject Buttons Row */}
              {post.status === "pending" && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    onClick={() => approvePost(post._id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectPost(post._id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Bottom Row - Preview, Edit and Delete */}
              <div className="flex justify-between items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setImageModalUrl(post.imageUrl);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-600 border border-gray-200 rounded-md transition-all duration-200 shadow-sm hover:shadow"
                  title="Preview"
                >
                  <Image className="h-3 w-3" />
                  <span>Preview</span>
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEdit(post)}
                    className="inline-flex items-center justify-center w-7 h-7 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="inline-flex items-center justify-center w-7 h-7 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SearchBar = () => {
    const searchInputRef = useRef(null);

    return (
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400 z-50" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm h-[36px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 outline-none focus:ring-green-500 focus:border-transparent transition-all duration-200 text-[13px]"
          placeholder="Search posts..."
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setShouldFocusSearch(true);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">✕</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Toaster />
      <header className="bg-gray-50 shadow-sm sticky top-0 z-40">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-left">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Management</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar />
              {/* Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                }}
                className="border text-[13px] border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="flex flex-row  gap-2">
                <div className="inline-flex items-center rounded-lg z-20 border border-gray-200 bg-white p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    type="button"
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "grid" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 mr-1 " />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    type="button"
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "list" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <List className="w-4 h-4 mr-1" />
                    Table
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                  setIsModalOpen(true);
                }}
                className=" hover:border-green-300 active:bg-green-100 z-10 w-[145px] h-[38px] mt-[1px] border border-gray-200 bg-white p-1 justify-center text-[#626262] hover:text-green-600 px-2 py-3 rounded-md transition-all duration-300 text-[14px] font-medium !rounded-button whitespace-nowrap cursor-pointer shadow-sm flex items-center"
              >
                <Plus className="mr-2" /> Add Post
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Statistics */}
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Main Stats Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Overview</h3>
              </div>

              <div className="p-5 space-y-3">
                {/* Total Posts */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase block mb-1">Total Posts</span>
                      <span className="text-3xl font-bold text-gray-900">{posts.length}</span>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Pending</div>
                    <div className="text-xl font-bold text-yellow-600">{posts.filter((p) => p.status === "pending").length}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Approved</div>
                    <div className="text-xl font-bold text-green-600">{posts.filter((p) => p.status === "approved").length}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Rejected</div>
                    <div className="text-xl font-bold text-red-600">{posts.filter((p) => p.status === "rejected").length}</div>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-3">Engagement</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Likes</span>
                      <span className="text-sm font-semibold text-gray-900">{posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Comments</span>
                      <span className="text-sm font-semibold text-gray-900">{posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Engagement</span>
                        <span className="text-lg font-bold text-emerald-600">
                          {posts.reduce((acc, p) => acc + (p.likes?.length || 0) + (p.comments?.length || 0), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Categories</h4>
                  <div className="space-y-2">
                    {Array.from(new Set(posts.map((p) => p.category))).map((cat) => (
                      <div key={cat} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700 font-medium">{cat}</span>
                        <span className="text-sm font-bold text-gray-900 bg-white px-2.5 py-1 rounded shadow-sm">
                          {posts.filter((p) => p.category === cat).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {error && <div className="mb-6 p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>}
            {loading ? (
              <div className="text-center text-gray-500 text-[15px] py-10">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center text-gray-400 text-[16px] py-10">No records found.</div>
            ) : viewMode === "grid" ? (
              <GridView />
            ) : (
              <TableView />
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
          handleModalClose();
          setIsModalOpen(false);
        }}
        title="Create New Post"
      >
        <PostForm
          onSubmit={(formData) => {
            setPosts([
              ...posts,
              {
                ...formData,
                _id: Date.now().toString(),
                createdAt: new Date().toISOString(),
              },
            ]);
            setIsAddModalOpen(false);
            setIsModalOpen(false);
            resetForm();
          }}
          onPostCreated={handleModalClose}
          onUpdateSuccess={fetchPosts}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsModalOpen(true);
          resetForm();
        }}
        title="Edit Post"
      >
        <PostForm
          initialData={editingPost}
          isEdit={true}
          onSubmit={(formData) => {
            setPosts(posts.map((post) => (post._id === editingPost._id ? { ...post, ...formData } : post)));
            setIsEditModalOpen(false);
            setIsModalOpen(true);
            resetForm();
          }}
          onPostCreated={handleModalClose}
          onUpdateSuccess={fetchPosts}
        />
      </Modal>
      <Modal
        isOpen={!!imageModalUrl}
        onClose={() => {
          setImageModalUrl(null);
          setSelectedPost(null);
        }}
        title=""
        maxWidth="sm:max-w-6xl"
      >
        {selectedPost && (
          <div className="-mx-6 -mt-6 ">
            <div className="flex flex-col lg:flex-row min-h-[700px] ">
              {/* Left Side - Image */}
              <div className="w-full lg:w-[650px] lg:min-h-[700px] flex-shrink-0 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="h-full flex items-center justify-center">
                  <img
                    src={imageModalUrl}
                    alt="Preview"
                    className="w-full h-full max-h-[650px] object-contain rounded-2xl shadow-2xl border border-gray-200"
                  />
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              {/* Right Side - Content */}
              <div className="flex-1 flex flex-col min-h-[700px] ">
                {/* Header Section */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-200">
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{selectedPost.title}</h2>

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <FaMapMarkerAlt className="text-emerald-600" />
                      <span className="font-medium">{selectedPost.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <FaCalendarAlt className="text-emerald-600" />
                      <span className="font-medium">{format(new Date(selectedPost.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Badge */}
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <FaTags className="text-emerald-600" />
                      {selectedPost.category}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border ${
                        selectedPost.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : selectedPost.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {selectedPost.status === "approved" ? "✓ " : selectedPost.status === "rejected" ? "✗ " : "⏳ "}
                      {selectedPost.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-emerald-600 rounded-full"></span>
                        Description
                      </h3>
                      <p className="text-base text-gray-700 leading-relaxed pl-3">{selectedPost.description}</p>
                    </div>

                    {/* Disaster Date if applicable */}
                    {selectedPost.category === "Disaster" && selectedPost.disasterDate && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">🚨</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-red-900 mb-1">Disaster Date</p>
                            <p className="text-base font-bold text-red-700">{format(new Date(selectedPost.disasterDate), "MMMM d, yyyy")}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Engagement Stats - Bottom Section */}
                <div className="border-t border-gray-200 px-8 py-5 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      {/* Likes */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Likes</p>
                          <p className="text-lg font-bold text-gray-900">{selectedPost.likes?.length || 0}</p>
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Comments</p>
                          <p className="text-lg font-bold text-gray-900">{selectedPost.comments?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Engagement */}
                    <div className="text-right bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-200">
                      <p className="text-xs text-emerald-700 font-semibold mb-1">Total Engagement</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {(selectedPost.likes?.length || 0) + (selectedPost.comments?.length || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default adminPostView;
