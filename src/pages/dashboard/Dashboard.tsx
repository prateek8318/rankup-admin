import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] text-gray-800">

      {/* Top filters bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Filter by date</button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Select Exam</button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">All Users</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">Apply</button>
          <button className="px-4 py-2 text-gray-600 text-sm underline">Reset</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2">
            ↑ Export
          </button>
        </div>
      </div>

      <div className="flex">

        {/* Sidebar - simplified for now */}
        <div className="w-64 bg-white border-r min-h-screen p-4 hidden lg:block">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="font-bold text-xl text-blue-700">ranknup</span>
            </div>
            <nav className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg text-blue-700 font-medium">
                <span>📊</span> Dashboard
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>👥</span> Users
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>📝</span> Exams Management
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>👑</span> Subscriptions
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>🎟️</span> Coupon
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>🎥</span> Daily Motivational Video
              </div>
              <hr className="my-4" />
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>🎧</span> Support
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>📈</span> Reports
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>⚙️</span> Settings
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                <span>📄</span> CMS
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-8">
                <span>→</span> Logout
              </div>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">

          <h2 className="text-xl font-semibold mb-1">Overview of registered users, subscriptions, exam & revenue</h2>
          <p className="text-gray-500 mb-6">Overview of registered users, subscriptions, exam & revenue</p>

          {/* Stat cards with wave bg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { num: "12.5k", label: "Total Registered Users", icon: "👤", color: "bg-cyan-50" },
              { num: "8,402", label: "Total Subscribers", icon: "👑", color: "bg-blue-50" },
              { num: "156", label: "Active Subscribers", icon: "✅", color: "bg-green-50" },
              { num: "283", label: "Subscriptions Expiring Soon", icon: "⏰", color: "bg-orange-50" }
            ].map((item, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl p-6 shadow-sm ${item.color}`}
              >
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/30 rounded-full blur-xl"></div>
                <div className="relative">
                  <div className="text-4xl font-bold mb-1">{item.num}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Earnings chart area */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Earnings</h3>
                <button className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  This Year ▼
                </button>
              </div>
              <div className="h-72 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                [ Earnings bar chart – 2023 gray vs 2024 blue ]
              </div>
            </div>

            {/* Right side small cards */}
            <div className="space-y-5">

              <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-6 shadow-md">
                <div className="text-4xl font-bold mb-1">23</div>
                <div className="flex items-center gap-2">
                  <span>🎫</span>
                  <span>Open Support Tickets</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-md">
                <div className="text-4xl font-bold mb-1">300</div>
                <div className="flex items-center gap-2">
                  <span>💸</span>
                  <span>Today's Transactions</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl p-6 shadow-md">
                <div className="text-4xl font-bold mb-1">4,100</div>
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span>Total Questions</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md">
                <div className="text-4xl font-bold mb-1">566</div>
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>Total Exams</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;