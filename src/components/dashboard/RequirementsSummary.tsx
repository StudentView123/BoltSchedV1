import React, { useMemo } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Role } from '../../types';

const RequirementsSummary: React.FC = () => {
  const { providers, schedule, staff, selectedDate } = useSchedule();

  const todaySchedule = useMemo(() => {
    return schedule.find(day => day.date === selectedDate) || { date: selectedDate, providers: [] };
  }, [schedule, selectedDate]);

  // Calculate total requirements for each role
  const totalRequirements = useMemo(() => {
    const requirements: Record<Role, { required: number; assigned: number }> = {
      technician: { required: 0, assigned: 0 },
      tester: { required: 0, assigned: 0 },
      scribe: { required: 0, assigned: 0 },
      frontDesk: { required: 0, assigned: 0 },
    };

    todaySchedule.providers.forEach(providerSchedule => {
      const provider = providers.find(p => p.id === providerSchedule.providerId);
      if (provider) {
        (Object.keys(provider.requirements) as Role[]).forEach(role => {
          requirements[role].required += provider.requirements[role];
        });

        // Count assigned staff by role
        providerSchedule.assignedStaff.forEach(assignment => {
          requirements[assignment.assignedRole].assigned += 1;
        });
      }
    });

    return requirements;
  }, [todaySchedule, providers]);

  // Count available staff by role capability
  const availableStaff = useMemo(() => {
    const available: Record<Role, number> = {
      technician: 0,
      tester: 0,
      scribe: 0,
      frontDesk: 0,
    };

    // Count staff with each role capability
    staff.forEach(staffMember => {
      staffMember.roles.forEach(role => {
        available[role] += 1;
      });
    });

    return available;
  }, [staff]);

  const getDisplayName = (role: Role): string => {
    switch (role) {
      case 'frontDesk':
        return 'Front Desk';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getRoleColor = (role: Role, isBg = true): string => {
    switch (role) {
      case 'technician':
        return isBg ? 'bg-blue-100' : 'text-blue-800';
      case 'tester':
        return isBg ? 'bg-green-100' : 'text-green-800';
      case 'scribe':
        return isBg ? 'bg-purple-100' : 'text-purple-800';
      case 'frontDesk':
        return isBg ? 'bg-yellow-100' : 'text-yellow-800';
      default:
        return isBg ? 'bg-gray-100' : 'text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Staffing Requirements</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(totalRequirements) as Role[]).map(role => {
            const { required, assigned } = totalRequirements[role];
            const available = availableStaff[role];
            const isFulfilled = assigned >= required;
            const fulfillmentPercentage = required > 0 ? Math.min(Math.round((assigned / required) * 100), 100) : 100;
            
            return (
              <div key={role} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role, true)} ${getRoleColor(role, false)}`}>
                    {getDisplayName(role)}
                  </div>
                  <span className={`text-sm font-medium ${isFulfilled ? 'text-green-600' : 'text-red-600'}`}>
                    {assigned}/{required}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${isFulfilled ? 'bg-green-600' : 'bg-amber-500'}`} 
                    style={{ width: `${fulfillmentPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Assigned: {assigned}</span>
                  <span>Available: {available}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequirementsSummary;