import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import EditTransactionModal from "../components/EditTransactionModal";
import DashboardSkeleton from "../components/DashboardSkeleton";
const CategoryChart = lazy(() => import("../components/CategoryChart"));
import { lazy, Suspense } from "react";
function Dashboard() {
  
  const [transactions, setTransactions] = useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);

      const t = await API.get("/transactions");
setTransactions(t.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 const summary = useMemo(() => {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
}, [transactions]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: "",
    note: "",
  });

 
  // ✅ Memoized sorting (BIG optimization)
  const sortedTransactions = useMemo(() => {
    return [
      ...transactions.filter((t) => t.isPinned),
      ...transactions.filter((t) => !t.isPinned),
    ];
  }, [transactions]);

  // ✅ Memoized spending velocity
  const spendingVelocity = useMemo(() => {
    const now = new Date();

    const last7Days = transactions.filter((t) => {
      const d = new Date(t.createdAt);
      return (
        t.type === "expense" &&
        (now - d) / (1000 * 60 * 60 * 24) <= 7
      );
    });

    const total = last7Days.reduce((sum, t) => sum + t.amount, 0);

    return Math.round(total / 7);
  }, [transactions]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // ✅ ADD / EDIT (optimized)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.type) {
      return toast.error("Amount and type required");
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (editData) {
        const res = await API.put(
          `/transactions/${editData._id}`,
          payload
        );

        setTransactions((prev) =>
          prev.map((t) =>
            t._id === editData._id ? res.data : t
          )
        );

        toast.success("Updated");
        setEditData(null);

        fetchData(); // keep for accuracy
      } else {
        const res = await API.post("/transactions", payload);

        setTransactions((prev) => [res.data, ...prev]);

        toast.success("Added");
      }
    } catch {
      toast.error("Failed");
    }

    setForm({ amount: "", type: "income", category: "", note: "" });
  };

  // ✅ DELETE (optimized)
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);

      setTransactions((prev) =>
        prev.filter((t) => t._id !== id)
      );

      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ PIN (optimized — no refetch)
  const handlePin = async (id) => {
    try {
      const res = await API.patch(`/transactions/${id}/pin`);

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id ? res.data : t
        )
      );
    } catch {
      toast.error("Pin failed");
    }
  };
  const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow h-[300px] animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="h-full bg-gray-200 rounded"></div>
  </div>
);

  const useCountUp = (value) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 300;
    const stepTime = 10;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return display;
};

const incomeAnim = useCountUp(summary.income);
const expenseAnim = useCountUp(summary.expense);
const balanceAnim = useCountUp(summary.balance);
  return (
    <div className="animate-fadeIn bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500 text-white p-4 rounded transform hover:scale-105 transition duration-200">
                Income: ₹{incomeAnim}
              </div>
              <div className="bg-red-500 text-white p-4 rounded transform hover:scale-105 transition duration-200">
                Expense: ₹{expenseAnim}
              </div>
              <div className="bg-blue-500 text-white p-4 rounded transform hover:scale-105 transition duration-200">
                Balance:  ₹{balanceAnim}
              </div>
            </div>

            {/* Velocity */}
            <div className="bg-white p-4 rounded shadow mb-6">
              <p className="text-gray-500 text-sm">
                Spending Velocity (7 days)
              </p>
              <p className="text-xl font-bold text-red-500">
                ₹{spendingVelocity} / day
              </p>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Suspense fallback={<ChartSkeleton />}>
    <CategoryChart transactions={transactions} />
  </Suspense>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3 md:flex-row"
            >
              <input
                value={form.amount}
                className="border p-2 flex-1"
                placeholder="Amount"
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />

              <select
                value={form.type}
                className="border p-2"
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="income">Credit</option>
                <option value="expense">Debit</option>
              </select>

              <select
                value={form.category}
                className="border p-2"
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
                className="border p-2 flex-1"
                placeholder="Note"
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />

              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 active:scale-95 transition">
                Add
              </button>
            </form>

            {/* Transactions */}
            <div className="bg-white rounded shadow">
              {sortedTransactions.length === 0 && (
                <p className="text-center p-4 text-gray-500">
                  No transactions yet
                </p>
              )}

              {sortedTransactions.map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition"
                >
                  <button
                    onClick={() => handlePin(t._id)}
                    className="text-yellow-500"
                  >
                    {t.isPinned ? "★" : "☆"}
                  </button>

                  <div>
                    <p className="font-semibold">
                      {t.type === "income" ? "Credit" : "Debit"} • {t.category}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.note || "--"} •{" "}
                      <span className="text-xs text-gray-400">
                        {formatDate(t.createdAt)}
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

                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => setEditData(t)}
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
          </>
        )}
      </div>

      <EditTransactionModal
        editData={editData}
        setEditData={setEditData}
        setTransactions={setTransactions}
      />
    </div>
  );
}

export default Dashboard;