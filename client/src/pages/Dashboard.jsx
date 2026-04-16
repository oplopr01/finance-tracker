import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await API.put(`/transactions/${editingId}`, form);
      setEditingId(null);
    } else {
      await API.post("/transactions", form);
    }

    setForm({ amount: "", type: "income", category: "", note: "" });
    fetchData();
  };

  const handleEdit = (t) => {
    setForm({
      amount: t.amount,
      type: t.type,
      category: t.category,
      note: t.note,
    });
    setEditingId(t._id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchData();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">

        {/* Summary Cards */}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3 md:flex-row md:items-center"
        >
          <input
            value={form.amount}
            className="border p-2 flex-1 w-full"
            placeholder="Amount"
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <select
            value={form.type}
            className="border p-2 w-full md:w-auto"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            value={form.category}
            className="border p-2 flex-1 w-full"
            placeholder="Category"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* Transactions */}
        <div className="bg-white rounded shadow">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center p-3 border-b"
            >
              <div>
                <p className="font-semibold">{t.category}</p>
                <p className="text-sm text-gray-500">{t.note}</p>
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
    </div>
  );
}

export default Dashboard;