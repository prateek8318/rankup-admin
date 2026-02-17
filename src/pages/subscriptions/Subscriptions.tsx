const Subscriptions = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Subscription Management</h1>
        <p className="text-gray-600">Manage subscription plans and user subscriptions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Plans */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription Plans</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Basic Plan</h3>
                  <p className="text-2xl font-bold text-blue-600">₹99/month</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-3">
                <li>• Access to basic exams</li>
                <li>• Limited questions per day</li>
                <li>• Email support</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Plan
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Subscriptions</h2>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-600">Basic Plan</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Expires: 2024-03-15</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
