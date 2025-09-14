export default function ExpensesPage() {
  return (
    <div>
      <h1 className="mb-6">Expenses</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2>Recent Expenses</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Add Expense
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            No expenses recorded yet. Add your first expense to get started!
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-4">Summary</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-semibold">$0.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Balance</p>
              <p className="text-2xl font-semibold">$0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}