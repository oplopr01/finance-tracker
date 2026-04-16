import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import CategoryChart from "../components/CategoryChart";
// import MonthlyChart from "../components/MonthlyChart";
import toast from "react-hot-toast";
import EditTransactionModal from "../components/EditTransactionModal";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: "",
    note: "",
  });

  const fetchData = async () => {
    const t = await API.get("/transactions");
    const s = await API.get("/transactions/summary");

    setTransactions(t.data);
    setSummary(s.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!form.amount || !form.type) {
      return alert("Amount and type required");
    }

    const payload = {
      ...form,
      amount: Number(form.amount), // ✅ ensure number
    };

    try {
      if (editingId) {
        await API.put(`/transactions/${editingId}`, payload);
        toast.success("Transaction updated");
      } else {
        await API.post("/transactions", payload);
        toast.success("Transaction added");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setForm({ amount: "", type: "income", category: "", note: "" });
    fetchData();
  };

  const handleEdit = (t) => {
    setEditData(t);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handlePin = async (id) => {
  await API.patch(`/transactions/${id}/pin`);
  fetchData();
};
const sortedTransactions = [
  ...transactions.filter(t => t.isPinned),
  ...transactions.filter(t => !t.isPinned)
];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500 text-white p-4 rounded">
            Income: {summary.income}
          </div>
          <div className="bg-red-500 text-white p-4 rounded">
            Expense: {summary.expense}
          </div>
          <div className="bg-blue-500 text-white p-4 rounded">
            Balance: {summary.balance}
          </div>
        </div>



        <div className="grid md:grid-cols-2 gap-6">
          <CategoryChart transactions={transactions} />
          {/* <MonthlyChart transactions={transactions} /> */}

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3 md:flex-row md:items-center"
        >
          <input
            value={form.amount}
            className="border p-2 flex-1 w-full"
            placeholder="Amount"
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            value={form.type}
            className="border p-2 w-full md:w-auto"
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="income">Credit</option>
            <option value="expense">Debit</option>
          </select>

          <select
            value={form.category}
            className="border p-2 w-full md:w-auto"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Category</option>
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
          </select>

          <input
            value={form.note}
            className="border p-2 flex-1 w-full"
            placeholder="Note"
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Add"}
          </button>

          {/* ✅ Cancel Button */}
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  amount: "",
                  type: "income",
                  category: "",
                  note: "",
                });
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Transactions */}
        <div className="bg-white rounded shadow">

          {/* ✅ Empty State */}
          {sortedTransactions.length === 0 && (
            <p className="text-center p-4 text-gray-500">
              No transactions yet
            </p>
          )}

          {sortedTransactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center p-3 border-b"
            >
              <button
  onClick={() => handlePin(t._id)}
  className="text-yellow-500"
>
  {t.isPinned ? "★" : "☆"}
</button>
              <div>
                {/* ✅ Type + Category */}
                <p className="font-semibold">
                  {t.type === "income" ? "Credit" : "Debit"} • {t.category}
                </p>

                <p className="text-sm text-gray-500">
                  {t.note || "--"} <span className="text-xs text-gray-400">
                    • {formatDate(t.createdAt)}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p
                  className={
                    t.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  ₹{t.amount}
                </p>

                <div className="flex gap-2 justify-end text-sm">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <EditTransactionModal
        editData={editData}
        setEditData={setEditData}
        fetchData={fetchData}
      />
    </div>
  );
}

export default Dashboard;