import React from 'react';
import { ReportItem } from './ReportItem';

interface ReportData {
  title: string;
  description: string;
  onDownload?: () => void;
}

interface ReportSectionProps {
  title: string;
  reports: ReportData[];
}

export const ReportSection: React.FC<ReportSectionProps> = ({ title, reports }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {reports.map((report, index) => (
          <ReportItem 
            key={index}
            title={report.title}
            description={report.description}
            onDownload={report.onDownload}
          />
        ))}
      </div>
    </div>
  );
};
