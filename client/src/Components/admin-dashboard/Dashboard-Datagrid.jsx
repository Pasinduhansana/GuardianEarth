import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const Dashboard_grid = ({ recodes, loading, fetchdata, onSync, onLoadDataset }) => {
  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <span>Are you sure you want to delete this record?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${API_BASE_URL}/api/Dashboard/${id}`);
                  fetchdata();
                  toast.dismiss(t.id);
                  toast.success("Recode deleted successfully!");
                } catch (error) {
                  toast.dismiss(t.id);
                  toast.error("Failed to delete record.");
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" },
    );
  };

  return (
    <>
      <div className="w-full">
        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-[120px]">Recode ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-[140px]">Recode Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Recode Remark</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-[120px]">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-[280px]">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-sm text-gray-500">
                    Loading recodes...
                  </td>
                </tr>
              ) : recodes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-sm text-gray-500">
                    No Recodes found.
                  </td>
                </tr>
              ) : (
                recodes.map((recode, index) => (
                  <tr key={recode.Id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-left text-gray-800 font-medium align-middle">
                      {recode.id ? recode.id.slice(-5) : recode.Id ? recode.Id.slice(-5) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-600 align-middle">
                      {recode.date ? recode.date.slice(-5) : recode.date ? recode.date.slice(-5) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-600 align-middle">
                      <span className="line-clamp-2">{recode.remark}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Saved
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 transition-colors duration-150 font-medium rounded-md text-xs"
                          onClick={() => onSync && onSync(recode._id || recode.Id)}
                          title="Sync record"
                        >
                          Sync
                        </button>
                        <button
                          onClick={() => handleDelete(recode._id)}
                          className="px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-colors duration-150 font-medium rounded-md text-xs"
                          title="Delete record"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => onLoadDataset && onLoadDataset(recode)}
                          className="px-3 py-1.5 bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 transition-colors duration-150 font-medium rounded-md text-xs whitespace-nowrap"
                          title="Load dataset"
                        >
                          Load Dataset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default Dashboard_grid;
