import React, { useRef } from "react";
import { useState } from "react";
import { IoDocumentOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
const Payment_Grid = ({ payments, loading, filterText_pros, sortOrder__pros, fetchPayments, onViewDetails }) => {
  const deleteToastRef = useRef(null);
  // Filter payments based on transaction ID
  const filteredPayments = payments.filter(
    (payment) =>
      payment.transactionId?.toLowerCase().includes(filterText_pros.toLowerCase()) ||
      payment.user?.toLowerCase().includes(filterText_pros.toLowerCase()) ||
      payment.createdAt?.toLowerCase().includes(filterText_pros.toLowerCase()) ||
      payment.status?.toLowerCase().includes(filterText_pros.toLowerCase()) ||
      payment.currency?.toLowerCase().includes(filterText_pros.toLowerCase())
  );

  // Sort payments based on selected option
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortOrder__pros) {
      case "amount-asc":
        return a.amount - b.amount;
      case "amount-desc":
        return b.amount - a.amount;
      case "date-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const approvePayment = async (id, action_status) => {
    console.log(id);
    try {
      await axios.put(`http://localhost:5000/api/payment/${id}`, {
        status: action_status, // Ensure backend updates status
      });
      fetchPayments(); // Refresh the list after approval
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };

  const deletePaymentRecode = async (id) => {
    if (deleteToastRef.current) {
      return;
    }

    // Dismiss all existing toasts before showing confirmation
    toast.dismiss();

    deleteToastRef.current = toast(
      (t) => (
        <div className="flex items-center gap-4">
          <p>Are you sure you want to delete this payment?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  // Dismiss confirmation toast immediately
                  toast.dismiss(t.id);
                  deleteToastRef.current = null;

                  console.log("Deleting payment with ID:", id);
                  await axios.delete(`http://localhost:5000/api/payment/delete/${id}`);
                  fetchPayments(); // Refresh the list after deletion

                  // Show success message only once
                  toast.success("Payment deleted successfully", { duration: 3000 });
                } catch (error) {
                  console.error("Error deleting payment:", error);
                  toast.error("Error deleting payment: " + error.message);
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                deleteToastRef.current = null;
              }}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  return (
    <div className="w-[70vw] mx-auto">
      {/* Payment Grid */}
      <div className="grid grid-cols-6 text-center gap-y-2">
        {/* Table Headers */}
        {["Invoice ID", "Invoice Name", "Invoice Date", "Invoice Amount", "Status", "Action"].map((header) => (
          <span key={header} className="text-[13px] text-left font-semibold text-text-secondary">
            {header}
          </span>
        ))}

        {/* Separator */}
        <div className="col-span-6 mt-2 border-[1px] border-border-border1"></div>

        {/* Table Body */}
        {loading ? (
          <p className="col-span-6 text-[13px] font-semibold text-text-secondary">Loading payments...</p>
        ) : sortedPayments.length === 0 ? (
          <p className="col-span-6 text-[13px] font-semibold text-text-secondary">No payments found.</p>
        ) : (
          sortedPayments.map((payment) => (
            <React.Fragment key={payment.Id}>
              <span className="text-[13px] text-left font-normal text-text-secondary">
                {payment.transactionId ? payment.transactionId.slice(-5) : "N/A"}
              </span>
              <span className="text-[13px] text-left font-normal text-text-secondary">{payment.user}</span>
              <span className="text-[13px] text-left font-normal text-text-secondary">
                {payment.createdAt ? payment.createdAt.slice(0, 10) : "N/A"}
              </span>
              <span className="text-[13px] text-left font-normal text-text-secondary">
                {payment.currency} {payment.amount}
              </span>
              {/* Status Badge */}
              <div className="flex justify-start items-center">
                <div
                  className={`text-[13px] flex max-w-fit px-2 items-center justify-center rounded-[20px] h-[22px] font-normal text-text-secondary ${
                    payment.status === "Successful" ? "bg-[#c8fbd9]" : payment.status === "Failed" ? "bg-[#f9dee5]" : "bg-[#f6efc2]"
                  }`}
                >
                  <div className="flex flex-row items-center">
                    <div
                      className={`w-[5px] h-[5px] rounded-2xl mt-0 mr-2 ${
                        payment.status === "Successful" ? "bg-primary-light" : payment.status === "Failed" ? "bg-primary-red" : "bg-primary-yellow"
                      }`}
                    ></div>
                    <span
                      className={`text-[12px] font-semibold ${
                        payment.status === "Successful"
                          ? "text-primary-light"
                          : payment.status === "Failed"
                            ? "text-primary-red"
                            : "text-primary-yellow"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-start gap-2">
                {payment.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => approvePayment(payment._id, "Successful")}
                      className="px-2 py-0 bg-white border border-primary-light h-[26px] w-[70px] text-primary-light hover:bg-green-100 transition-all duration-200 font-normal rounded-[4px] text-[13px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => approvePayment(payment._id, "Failed")}
                      className="px-2 py-0 bg-white border border-primary-red h-[26px] w-[70px] text-primary-red hover:bg-red-100 transition-all duration-200 font-normal rounded-[4px] text-[13px]"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex flex-row justify-center items-center gap-[5px]">
                    <button
                      onClick={() => onViewDetails && onViewDetails(payment)}
                      className="px-2 py-0 bg-white border border-border-default h-[26px] w-[115px] flex items-center justify-around text-text-secondary hover:bg-gray-100 transition-all duration-200 font-normal rounded-[4px] text-[13px]"
                    >
                      <IoDocumentOutline className="text-[14px]" />
                      View Details
                    </button>
                    <button
                      onClick={() => deletePaymentRecode(payment._id)}
                      title="Delete Payment Record"
                      className="px-2 py-0 bg-white border border-red-500 h-[26px] w-[70px] flex items-center justify-center text-red-600 hover:bg-red-50 transition-all duration-200 font-medium rounded-[4px] text-[13px]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {/* Separator */}
              <div className="col-span-6 h-[0.5px] bg-border-default opacity-30"></div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default Payment_Grid;
