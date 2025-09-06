import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { Location } from '../../types';

const LocationSettings: React.FC = () => {
  const { locations, addLocation, removeLocation, updateLocation } = useLocation();
  const [newLocation, setNewLocation] = useState('');
  const [editingLocation, setEditingLocation] = useState<{ old: Location; new: Location } | null>(null);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocation && !locations.includes(newLocation as Location)) {
      addLocation(newLocation as Location);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location: Location) => {
    if (window.confirm('Are you sure you want to remove this location? This may affect existing schedules.')) {
      removeLocation(location);
    }
  };

  const handleStartEdit = (location: Location) => {
    setEditingLocation({ old: location, new: location });
  };

  const handleSaveEdit = () => {
    if (editingLocation && editingLocation.old !== editingLocation.new) {
      updateLocation(editingLocation.old, editingLocation.new);
    }
    setEditingLocation(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Locations</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage practice locations
        </p>
      </div>

      <div className="p-4">
        {/* Add new location form */}
        <form onSubmit={handleAddLocation} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter new location name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!newLocation}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </button>
          </div>
        </form>

        {/* Locations list */}
        <div className="space-y-2">
          {locations.map((location) => (
            <div
              key={location}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              {editingLocation?.old === location ? (
                <input
                  type="text"
                  value={editingLocation.new}
                  onChange={(e) => setEditingLocation({ ...editingLocation, new: e.target.value as Location })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mr-2"
                />
              ) : (
                <span className="text-gray-900">{location}</span>
              )}
              
              <div className="flex items-center space-x-2">
                {editingLocation?.old === location ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLocation(null)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(location)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveLocation(location)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;