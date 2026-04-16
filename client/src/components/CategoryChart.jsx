import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center text-gray-500">
        No expense data
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow relative">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
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
                  opacity={activeIndex === index ? 1 : 0.5} // 🔥 hover effect
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 🔥 Center Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total
          </p>
          <p className="text-xl font-bold dark:text-white">
            ₹{total}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoryChart;