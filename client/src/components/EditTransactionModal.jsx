import toast from "react-hot-toast";
import API from "../services/api";

function EditTransactionModal({ editData, setEditData, fetchData }) {
  if (!editData) return null;

  const handleUpdate = async () => {
    try {
      await API.put(`/transactions/${editData._id}`, {
        ...editData,
        amount: Number(editData.amount),
      });

      toast.success("Updated successfully");
      setEditData(null);
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>

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
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTransactionModal;