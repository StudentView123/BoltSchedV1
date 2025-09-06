import React from 'react';
import { BarChart, AlignJustify } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500">View staffing analytics and scheduling reports</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <BarChart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Reports Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">
          This feature is under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default Reports;