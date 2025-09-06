import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { Provider, Role } from '../types';
import { ROLES } from '../utils/mockData';
import ProviderScheduleEditor from '../components/providers/ProviderScheduleEditor';

const Providers: React.FC = () => {
  const { providers, addProvider, updateProvider, removeProvider } = useSchedule();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const handleAddProvider = () => {
    const newProvider: Provider = {
      id: `p${Date.now()}`,
      name: '',
      requirements: {
        technician: 0,
        tester: 0,
        scribe: 0,
        frontDesk: 0,
      },
      recurringSchedule: []
    };
    
    setEditingProvider(newProvider);
    setIsEditing(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider({ ...provider });
    setIsEditing(true);
  };

  const handleRemoveProvider = (providerId: string) => {
    if (window.confirm('Are you sure you want to remove this provider?')) {
      removeProvider(providerId);
    }
  };

  const handleSaveProvider = () => {
    if (editingProvider) {
      if (providers.some(p => p.id === editingProvider.id)) {
        updateProvider(editingProvider);
      } else {
        addProvider(editingProvider);
      }
      setIsEditing(false);
      setEditingProvider(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProvider(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProvider) {
      setEditingProvider({ ...editingProvider, name: e.target.value });
    }
  };

  const handleRequirementChange = (role: Role, value: number) => {
    if (editingProvider) {
      setEditingProvider({
        ...editingProvider,
        requirements: {
          ...editingProvider.requirements,
          [role]: Math.max(0, value),
        },
      });
    }
  };

  const handleScheduleChange = (recurringSchedule: Provider['recurringSchedule']) => {
    if (editingProvider) {
      setEditingProvider({
        ...editingProvider,
        recurringSchedule
      });
    }
  };

  const getRoleDisplayName = (role: Role): string => {
    switch (role) {
      case 'frontDesk':
        return 'Front Desk';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <p className="text-gray-500">Manage providers and their staffing requirements</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddProvider}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingProvider?.id.startsWith('p') && editingProvider.name === '' ? 'Add Provider' : 'Edit Provider'}
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Provider Name
              </label>
              <input
                type="text"
                id="name"
                value={editingProvider?.name || ''}
                onChange={handleNameChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter provider name"
                required
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Staffing Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROLES.map(role => (
                  <div key={role} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`requirement-${role}`} className="block text-sm font-medium text-gray-700">
                        {getRoleDisplayName(role)}
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleRequirementChange(role, (editingProvider?.requirements[role] || 0) - 1)}
                          className="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                          <span className="text-xl font-bold">-</span>
                        </button>
                        <input
                          type="number"
                          id={`requirement-${role}`}
                          value={editingProvider?.requirements[role] || 0}
                          onChange={(e) => handleRequirementChange(role, parseInt(e.target.value, 10))}
                          className="block w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mx-1"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => handleRequirementChange(role, (editingProvider?.requirements[role] || 0) + 1)}
                          className="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                          <span className="text-xl font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {editingProvider && (
              <ProviderScheduleEditor
                provider={editingProvider}
                onScheduleChange={handleScheduleChange}
              />
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProvider}
              disabled={!editingProvider?.name}
              className={`px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white ${
                editingProvider?.name ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {providers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No providers added yet. Click the "Add Provider\" button to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    {ROLES.map(role => (
                      <th key={role} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {getRoleDisplayName(role)}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {providers.map(provider => (
                    <tr key={provider.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      </td>
                      {ROLES.map(role => (
                        <td key={role} className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-500">{provider.requirements[role]}</div>
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-500">
                          {provider.recurringSchedule.length} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProvider(provider)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveProvider(provider.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Providers;