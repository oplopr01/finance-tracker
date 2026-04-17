import { useMemo, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MonthlyChart({ transactions }) {

  // ✅ Memoized data calculation (BIG optimization)
  const data = useMemo(() => {
    const monthlyMap = {};

    transactions.forEach((t) => {
      const date = new Date(t.createdAt); // ✅ FIX (use createdAt)
      const monthIndex = date.getMonth();
      const monthName = date.toLocaleString("default", {
        month: "short",
      });

      if (!monthlyMap[monthIndex]) {
        monthlyMap[monthIndex] = {
          month: monthName,
          income: 0,
          expense: 0,
          index: monthIndex, // for sorting
        };
      }

      if (t.type === "income") {
        monthlyMap[monthIndex].income += t.amount;
      } else {
        monthlyMap[monthIndex].expense += t.amount;
      }
    });

    // ✅ Sort months properly (Jan → Dec)
    return Object.values(monthlyMap).sort(
      (a, b) => a.index - b.index
    );

  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow mb-6 text-center text-gray-500">
        No monthly data
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={10}>
          <XAxis dataKey="month" />
          <YAxis />

          {/* ✅ Improved tooltip */}
          <Tooltip
            formatter={(value) => `₹${value}`}
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#1f2937",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />

          <Bar
            dataKey="income"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
            animationDuration={400} // faster animation
          />

          <Bar
            dataKey="expense"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            animationDuration={400}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ✅ Prevent unnecessary re-renders
export default memo(MonthlyChart);