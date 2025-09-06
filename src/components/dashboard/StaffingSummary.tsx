import React, { useMemo } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { formatDate } from '../../utils/mockData';
import { Role } from '../../types';

const StaffingSummary: React.FC = () => {
  const { schedule, providers, staff, selectedDate } = useSchedule();

  const todaySchedule = useMemo(() => {
    return schedule.find(day => day.date === selectedDate) || { date: selectedDate, providers: [] };
  }, [schedule, selectedDate]);

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Unknown';
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : 'Unknown';
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
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Staff Assignments for {formatDate(selectedDate)}</h2>
      </div>
      <div className="p-4">
        {todaySchedule.providers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No providers scheduled for this date.</p>
        ) : (
          <div className="space-y-6">
            {todaySchedule.providers.map((providerSchedule) => {
              const provider = providers.find(p => p.id === providerSchedule.providerId);
              
              if (!provider) return null;
              
              const roleRequirements: Record<Role, { required: number; assigned: string[] }> = {
                technician: { required: provider.requirements.technician, assigned: [] },
                tester: { required: provider.requirements.tester, assigned: [] },
                scribe: { required: provider.requirements.scribe, assigned: [] },
                frontDesk: { required: provider.requirements.frontDesk, assigned: [] },
              };
              
              // Count assigned staff by role
              providerSchedule.assignedStaff.forEach(assignment => {
                const role = assignment.assignedRole;
                roleRequirements[role].assigned.push(assignment.staffId);
              });
              
              return (
                <div key={providerSchedule.providerId} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">{getProviderName(providerSchedule.providerId)}</h3>
                      <p className="text-sm text-gray-500">Location: {providerSchedule.location}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.keys(roleRequirements) as Role[]).map(role => {
                      const { required, assigned } = roleRequirements[role];
                      const isFulfilled = assigned.length >= required;
                      
                      return (
                        <div key={role} className="border rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                                {role === 'frontDesk' ? 'Front Desk' : role.charAt(0).toUpperCase() + role.slice(1)}
                              </span>
                            </div>
                            <span className={`text-sm font-medium ${isFulfilled ? 'text-green-600' : 'text-red-600'}`}>
                              {assigned.length}/{required}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            {assigned.length > 0 ? (
                              assigned.map(staffId => (
                                <div key={staffId} className="text-sm text-gray-600 pl-2 border-l-2 border-gray-200">
                                  {getStaffName(staffId)}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400 italic">No staff assigned</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffingSummary;