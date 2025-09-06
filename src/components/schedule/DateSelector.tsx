import React from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { formatDate } from '../../utils/mockData';

const DateSelector: React.FC = () => {
  const { selectedDate, setSelectedDate, schedule, providers, autoAssignAllStaff } = useSchedule();

  const goToPreviousDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleAutoAssignAll = () => {
    const todaySchedule = schedule.find(day => day.date === selectedDate);
    if (todaySchedule) {
      todaySchedule.providers.forEach(providerSchedule => {
        autoAssignAllStaff(selectedDate, providerSchedule.providerId);
      });
    }
  };

  // Check if there are any unfulfilled requirements for the selected date
  const hasUnfulfilledRequirements = () => {
    const todaySchedule = schedule.find(day => day.date === selectedDate);
    if (!todaySchedule) return false;

    return todaySchedule.providers.some(providerSchedule => {
      const provider = providers.find(p => p.id === providerSchedule.providerId);
      if (!provider) return false;

      const assignedByRole: Record<string, number> = {
        technician: 0,
        tester: 0,
        scribe: 0,
        frontDesk: 0,
      };

      providerSchedule.assignedStaff.forEach(assignment => {
        assignedByRole[assignment.assignedRole] += 1;
      });

      return Object.keys(provider.requirements).some(role => {
        const required = provider.requirements[role as keyof typeof provider.requirements];
        const assigned = assignedByRole[role] || 0;
        return required > 0 && assigned < required;
      });
    });
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={goToPreviousDay}
          className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNextDay}
          className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {formatDate(selectedDate)}
        </h2>
      </div>
      <div className="flex space-x-2">
        {hasUnfulfilledRequirements() && (
          <button
            onClick={handleAutoAssignAll}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Zap className="mr-2 h-4 w-4" />
            Auto Assign All
          </button>
        )}
        <button
          onClick={goToToday}
          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default DateSelector;