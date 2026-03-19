import React from 'react';
import { ReportSection } from './components/ReportSection';

export const ReportsContent: React.FC = () => {
  const reportSections = [
    {
      title: "User Reports",
      reports: [
        { title: "User Registration Report", description: "Monthly user registration trends" },
        { title: "User Activity Report", description: "Daily active users and engagement" }
      ]
    },
    {
      title: "Financial Reports",
      reports: [
        { title: "Revenue Report", description: "Monthly revenue and subscriptions" },
        { title: "Payment Analytics", description: "Payment methods and success rates" }
      ]
    },
    {
      title: "Exam Reports",
      reports: [
        { title: "Exam Performance", description: "Student performance and pass rates" },
        { title: "Question Analysis", description: "Difficulty analysis and feedback" }
      ]
    },
    {
      title: "System Reports",
      reports: [
        { title: "Server Performance", description: "CPU, memory, and response times" },
        { title: "Error Logs", description: "System errors and exceptions" }
      ]
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">View detailed reports and analytics for your platform</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportSections.map((section, index) => (
          <ReportSection 
            key={index}
            title={section.title}
            reports={section.reports}
          />
        ))}
      </div>
    </div>
  );
};
