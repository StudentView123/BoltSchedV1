import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Location, Provider } from '../../types';
import { useSchedule } from '../../context/ScheduleContext';
import { useLocation } from '../../context/LocationContext';

interface AddProviderModalProps {
  date: string;
  onClose: () => void;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({ date, onClose }) => {
  const { providers, assignProviderToDate } = useSchedule();
  const { locations } = useLocation();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);

  const availableProviders = providers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProvider) {
      assignProviderToDate(date, selectedProvider, selectedLocation);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">Add Provider</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                id="provider"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select provider</option>
                {availableProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as Location)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedProvider}
              className={`px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white ${
                selectedProvider ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProviderModal;