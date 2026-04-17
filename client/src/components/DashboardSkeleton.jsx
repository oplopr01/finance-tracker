function DashboardSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="h-20 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>

      {/* Chart */}
      <div className="h-64 bg-gray-300 rounded mb-6"></div>

      {/* Form */}
      <div className="h-20 bg-gray-300 rounded mb-6"></div>

      {/* Transactions List */}
      <div className="bg-white rounded shadow">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default DashboardSkeleton;