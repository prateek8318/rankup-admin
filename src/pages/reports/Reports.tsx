const Reports = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">View detailed reports and analytics for your platform</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">User Reports</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">User Registration Report</h3>
                <p className="text-sm text-gray-600">Monthly user registration trends</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">User Activity Report</h3>
                <p className="text-sm text-gray-600">Daily active users and engagement</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
          </div>
        </div>
        
        {/* Financial Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Financial Reports</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Revenue Report</h3>
                <p className="text-sm text-gray-600">Monthly revenue and subscriptions</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Payment Analytics</h3>
                <p className="text-sm text-gray-600">Payment methods and success rates</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
          </div>
        </div>
        
        {/* Exam Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Exam Reports</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Exam Performance</h3>
                <p className="text-sm text-gray-600">Student performance and pass rates</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Question Analysis</h3>
                <p className="text-sm text-gray-600">Difficulty analysis and feedback</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
          </div>
        </div>
        
        {/* System Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">System Reports</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Server Performance</h3>
                <p className="text-sm text-gray-600">CPU, memory, and response times</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">Error Logs</h3>
                <p className="text-sm text-gray-600">System errors and exceptions</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
