import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

function EditTransactionModal({ editData, setEditData, setTransactions }) {
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") setEditData(null);
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, [setEditData]);

if (!editData) return null;
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await API.put(`/transactions/${editData._id}`, {
        ...editData,
        amount: Number(editData.amount),
      });

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === editData._id ? res.data : t
        )
      );

      toast.success("Updated successfully");
      setEditData(null);

    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setEditData(null)} 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing inside click
        className="bg-white p-6 rounded-xl w-96 shadow-lg transform transition scale-100"
      >
        <h2 className="text-lg font-semibold mb-4">
          Edit Transaction
        </h2>

        <input
          className="border p-2 w-full mb-3"
          value={editData.amount}
          onChange={(e) =>
            setEditData({ ...editData, amount: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-3"
          value={editData.type}
          onChange={(e) =>
            setEditData({ ...editData, type: e.target.value })
          }
        >
          <option value="income">Credit</option>
          <option value="expense">Debit</option>
        </select>

        <select
          className="border p-2 w-full mb-3"
          value={editData.category}
          onChange={(e) =>
            setEditData({ ...editData, category: e.target.value })
          }
        >
          <option value="Salary">Salary</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
        </select>

        <input
          className="border p-2 w-full mb-4"
          value={editData.note}
          onChange={(e) =>
            setEditData({ ...editData, note: e.target.value })
          }
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditData(null)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:scale-105 transition"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 active:scale-95 transition"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTransactionModal;