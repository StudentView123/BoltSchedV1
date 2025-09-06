import React, { useState } from 'react';
import { MoreVertical, X, UserPlus, Zap } from 'lucide-react';
import { Location, Provider, ProviderSchedule, Role, Staff } from '../../types';
import { useSchedule } from '../../context/ScheduleContext';
import { formatTime } from '../../utils/mockData';

interface ProviderScheduleCardProps {
  date: string;
  provider: Provider;
  providerSchedule: ProviderSchedule;
}

const ProviderScheduleCard: React.FC<ProviderScheduleCardProps> = ({ date, provider, providerSchedule }) => {
  const { staff, assignStaffToProvider, removeStaffFromProvider, removeProviderFromDate, autoAssignStaffToProvider } = useSchedule();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<Role>('technician');

  // Count assigned staff by role
  const assignedByRole: Record<Role, string[]> = {
    technician: [],
    tester: [],
    scribe: [],
    frontDesk: [],
  };

  providerSchedule.assignedStaff.forEach(assignment => {
    assignedByRole[assignment.assignedRole].push(assignment.staffId);
  });

  // Get available staff who can perform the selected role
  const availableStaff = staff.filter(s => 
    s.roles.includes(selectedRole) && 
    !providerSchedule.assignedStaff.some(assignment => assignment.staffId === s.id)
  );

  const handleAddStaff = () => {
    if (selectedStaff && selectedRole) {
      assignStaffToProvider(date, provider.id, selectedStaff, selectedRole);
      setSelectedStaff('');
      setIsAddingStaff(false);
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    removeStaffFromProvider(date, provider.id, staffId);
  };

  const handleRemoveProvider = () => {
    removeProviderFromDate(date, provider.id);
  };

  const handleAutoAssign = () => {
    autoAssignStaffToProvider(date, provider.id);
  };

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Unknown';
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

  // Check if any roles are unfulfilled
  const hasUnfulfilledRoles = (Object.keys(provider.requirements) as Role[]).some(role => {
    const required = provider.requirements[role];
    const assigned = assignedByRole[role].length;
    return required > 0 && assigned < required;
  });

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
          <p className="text-sm text-gray-500">
            Location: {providerSchedule.location}
            <span className="mx-2">•</span>
            {formatTime(providerSchedule.timeSlot.startTime)} - {formatTime(providerSchedule.timeSlot.endTime)}
          </p>
        </div>
        <div className="flex space-x-1">
          {hasUnfulfilledRoles && (
            <button
              onClick={handleAutoAssign}
              className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
              title="Auto-assign staff"
            >
              <Zap className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleRemoveProvider}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Requirements and assigned staff */}
        {(Object.keys(provider.requirements) as Role[]).map(role => {
          const required = provider.requirements[role];
          const assigned = assignedByRole[role].length;
          
          if (required === 0) return null;
          
          return (
            <div key={role} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                    {role === 'frontDesk' ? 'Front Desk' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${assigned >= required ? 'text-green-600' : 'text-red-600'}`}>
                    {assigned}/{required}
                  </span>
                </div>
              </div>
              
              {/* Assigned staff list */}
              <div className="space-y-1 pl-2">
                {assignedByRole[role].length > 0 ? (
                  assignedByRole[role].map(staffId => (
                    <div key={staffId} className="flex justify-between items-center text-sm text-gray-600 py-1">
                      <span>{getStaffName(staffId)}</span>
                      <button
                        onClick={() => handleRemoveStaff(staffId)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No staff assigned</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Add staff form */}
        {isAddingStaff ? (
          <div className="mt-4 border-t pt-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {(Object.keys(provider.requirements) as Role[])
                    .filter(role => provider.requirements[role] > 0)
                    .map(role => (
                      <option key={role} value={role}>
                        {role === 'frontDesk' ? 'Front Desk' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Member
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select staff member</option>
                  {availableStaff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsAddingStaff(false)}
                  className="px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  disabled={!selectedStaff}
                  className={`px-3 py-1.5 shadow-sm text-sm font-medium rounded-md text-white ${
                    selectedStaff ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddingStaff(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              Add Staff
            </button>
            {hasUnfulfilledRoles && (
              <button
                onClick={handleAutoAssign}
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Zap className="mr-1 h-4 w-4" />
                Auto Assign
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderScheduleCard;