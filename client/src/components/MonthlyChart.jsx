import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MonthlyChart({ transactions }) {
  const monthlyMap = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short" });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyMap[month].income += t.amount;
    } else {
      monthlyMap[month].expense += t.amount;
    }
  });

  const data = Object.values(monthlyMap);

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
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
            }}
          />

          <Bar
            dataKey="income"
            fill="#22c55e"
            radius={[6, 6, 0, 0]} // rounded bars
            animationDuration={600}
          />

          <Bar
            dataKey="expense"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;