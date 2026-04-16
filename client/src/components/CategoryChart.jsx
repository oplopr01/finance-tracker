import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function CategoryChart({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#8b5cf6"];

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
        No expense data
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Expense Distribution
      </h2>

      <div className="relative h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  opacity={activeIndex === index ? 1 : 0.5}
                />
              ))}
            </Pie>

            {/* ✅ Tooltip added */}
            <Tooltip
              formatter={(value, name, props) => {
                const percent = ((value / total) * 100).toFixed(1);
                return [`₹${value} (${percent}%)`, name];
              }}
              contentStyle={{
                borderRadius: "10px",
                border: "none",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">₹{total}</p>
        </div>
      </div>

      {/* ✅ Custom Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryChart;