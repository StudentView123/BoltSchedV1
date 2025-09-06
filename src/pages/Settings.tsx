import React from 'react';
import LocationSettings from '../components/settings/LocationSettings';

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure application preferences</p>
      </div>
      
      <div className="space-y-6">
        <LocationSettings />
      </div>
    </div>
  );
};

export default Settings