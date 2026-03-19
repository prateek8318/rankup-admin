import React from 'react';

interface ReportItemProps {
  title: string;
  description: string;
  onDownload?: () => void;
}

export const ReportItem: React.FC<ReportItemProps> = ({ title, description, onDownload }) => {
  return (
    <div className="flex justify-between items-center p-3 border rounded-lg">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button 
        onClick={onDownload}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Download
      </button>
    </div>
  );
};
