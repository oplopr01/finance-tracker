import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({});
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

    const handleAdd = async (e) => {
        e.preventDefault();
        await API.post("/transactions", form);
        fetchData();
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-500 text-white p-4 rounded">Income: {summary.income}</div>
                    <div className="bg-red-500 text-white p-4 rounded">Expense: {summary.expense}</div>
                    <div className="bg-blue-500 text-white p-4 rounded">Balance: {summary.balance}</div>
                </div>

                <form
                    onSubmit={handleAdd}
                    className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3 md:flex-row md:items-center"
                >
                    <input
                        className="border p-2 flex-1 w-full"
                        placeholder="Amount"
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />

                    <select
                        className="border p-2 w-full md:w-auto"
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <input
                        className="border p-2 flex-1 w-full"
                        placeholder="Category"
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />

                    <button className="bg-blue-500 text-white px-4 py-2 w-full md:w-auto">
                        Add
                    </button>
                </form>
                {/* Transactions */}
                <div className="bg-white rounded shadow">
                    {transactions.map((t) => (
                        <div key={t._id} className="flex justify-between p-3 border-b">
                            <span>{t.category} - ₹{t.amount}</span>
                            <button
                                onClick={() => API.delete(`/transactions/${t._id}`).then(fetchData)}
                                className="text-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Dashboard;