export default function ProfilePage() {
  return (
    <div>
      <h1 className="mb-6">Profile</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-4">Your Account</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</p>
                <p className="font-mono text-sm">Not Connected</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="font-mono text-sm">Not Set</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Network</p>
                <p className="font-mono text-sm">Not Connected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-4">Your Activity</h2>
          <div className="grid gap-4">
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Meetups Attended</p>
                <p className="font-semibold">0</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="font-semibold">$0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}