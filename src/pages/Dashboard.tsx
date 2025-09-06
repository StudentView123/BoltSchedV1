import React from 'react';
import DateSelector from '../components/schedule/DateSelector';
import StaffingSummary from '../components/dashboard/StaffingSummary';
import RequirementsSummary from '../components/dashboard/RequirementsSummary';

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your schedule and staffing</p>
      </div>
      
      <DateSelector />
      
      <div className="mb-6">
        <RequirementsSummary />
      </div>
      
      <div>
        <StaffingSummary />
      </div>
    </div>
  );
};

export default Dashboard;