import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { formatTime } from '../../utils/mockData';

const MonthView: React.FC = () => {
  const { schedule, providers, staff } = useSchedule();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: Array<{ date: Date | null; scheduleDay: any }> = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({ date: null, scheduleDay: null });
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const scheduleDay = schedule.find(day => day.date === dateString);
      days.push({ date, scheduleDay });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : 'Unknown';
  };

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Unknown';
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`bg-white min-h-[120px] p-2 ${
                day.date ? 'border-t border-gray-200' : ''
              }`}
            >
              {day.date && (
                <>
                  <div className="font-medium text-sm text-gray-900">
                    {day.date.getDate()}
                  </div>
                  {day.scheduleDay?.providers.map((providerSchedule: any) => (
                    <div
                      key={providerSchedule.providerId}
                      className="mt-1 text-xs"
                    >
                      <div className="bg-blue-50 rounded p-1 mb-1">
                        <div className="font-medium text-blue-900">
                          {getProviderName(providerSchedule.providerId)}
                        </div>
                        <div className="text-blue-700">
                          {providerSchedule.location} •{' '}
                          {formatTime(providerSchedule.timeSlot.startTime)} -{' '}
                          {formatTime(providerSchedule.timeSlot.endTime)}
                        </div>
                        {providerSchedule.assignedStaff.length > 0 && (
                          <div className="mt-1 text-gray-600">
                            {providerSchedule.assignedStaff.map((assignment: any) => (
                              <div key={assignment.staffId} className="truncate">
                                {getStaffName(assignment.staffId)} ({assignment.assignedRole})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthView;