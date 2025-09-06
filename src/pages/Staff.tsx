import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import { useLocation } from '../context/LocationContext';
import { Role, Staff as StaffType } from '../types';
import { ROLES } from '../utils/mockData';

const Staff: React.FC = () => {
  const { staff, addStaff, updateStaff, removeStaff } = useSchedule();
  const { locations } = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);

  const handleAddStaff = () => {
    const newStaff: StaffType = {
      id: `s${Date.now()}`,
      name: '',
      roles: [],
    };
    
    setEditingStaff(newStaff);
    setIsEditing(true);
  };

  const handleEditStaff = (staffMember: StaffType) => {
    setEditingStaff({ ...staffMember });
    setIsEditing(true);
  };

  const handleRemoveStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      removeStaff(staffId);
    }
  };

  const handleSaveStaff = () => {
    if (editingStaff && editingStaff.name && editingStaff.roles.length > 0) {
      if (staff.some(s => s.id === editingStaff.id)) {
        updateStaff(editingStaff);
      } else {
        addStaff(editingStaff);
      }
      setIsEditing(false);
      setEditingStaff(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingStaff(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingStaff) {
      setEditingStaff({ ...editingStaff, name: e.target.value });
    }
  };

  const handleRoleToggle = (role: Role) => {
    if (editingStaff) {
      const hasRole = editingStaff.roles.includes(role);
      let updatedRoles;
      
      if (hasRole) {
        updatedRoles = editingStaff.roles.filter(r => r !== role);
      } else {
        updatedRoles = [...editingStaff.roles, role];
      }
      
      setEditingStaff({
        ...editingStaff,
        roles: updatedRoles,
      });
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editingStaff) {
      const location = e.target.value === '' ? undefined : e.target.value;
      setEditingStaff({
        ...editingStaff,
        preferredLocation: location as any,
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

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'technician':
        return 'bg-blue-100 text-blue-800';
      case 'tester':
        return 'bg-green-100 text-green-800';
      case 'scribe':
        return 'bg-purple-100 text-purple-800';
      case 'frontDesk':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-500">Manage staff members and their roles</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddStaff}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingStaff?.id.startsWith('s') && editingStaff.name === '' ? 'Add Staff Member' : 'Edit Staff Member'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Staff Name
              </label>
              <input
                type="text"
                id="name"
                value={editingStaff?.name || ''}
                onChange={handleNameChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter staff name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles (select at least one)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ROLES.map(role => (
                  <div key={role} className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`role-${role}`}
                        type="checkbox"
                        checked={editingStaff?.roles.includes(role) || false}
                        onChange={() => handleRoleToggle(role)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={`role-${role}`} className="font-medium text-gray-700">
                        {getRoleDisplayName(role)}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Location (optional)
              </label>
              <select
                id="location"
                value={editingStaff?.preferredLocation || ''}
                onChange={handleLocationChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">No preference</option>
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
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStaff}
              disabled={!editingStaff?.name || editingStaff.roles.length === 0}
              className={`px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white ${
                editingStaff?.name && editingStaff.roles.length > 0 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {staff.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No staff added yet. Click the "Add Staff\" button to get started.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map(staffMember => (
                  <tr key={staffMember.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {staffMember.roles.map(role => (
                          <span
                            key={role}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                          >
                            {getRoleDisplayName(role)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {staffMember.preferredLocation || 'No preference'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditStaff(staffMember)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveStaff(staffMember.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Staff;