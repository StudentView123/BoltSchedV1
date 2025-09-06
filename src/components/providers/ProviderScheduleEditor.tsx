import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Provider, WeekDay, Location, TimeSlot, ScheduleFrequency, RecurringSchedule } from '../../types';
import { WEEKDAYS } from '../../utils/mockData';
import { useLocation } from '../../context/LocationContext';
import { formatTime } from '../../utils/mockData';

interface ProviderScheduleEditorProps {
  provider: Provider;
  onScheduleChange: (recurringSchedule: Provider['recurringSchedule']) => void;
}

const ProviderScheduleEditor: React.FC<ProviderScheduleEditorProps> = ({ provider, onScheduleChange }) => {
  const { locations } = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState<RecurringSchedule>({
    weekDay: 'monday',
    location: locations[0],
    timeSlot: provider.defaultTimeSlot || { startTime: '09:00', endTime: '17:00' },
    frequency: 'weekly',
  });

  const frequencies: ScheduleFrequency[] = ['weekly', 'biweekly', 'monthly', 'custom'];

  const handleAddSchedule = () => {
    const updatedSchedule = [...provider.recurringSchedule, newSchedule];
    onScheduleChange(updatedSchedule);
    setShowAddForm(false);
    setNewSchedule({
      weekDay: 'monday',
      location: provider.defaultLocation || locations[0],
      timeSlot: provider.defaultTimeSlot || { startTime: '09:00', endTime: '17:00' },
      frequency: 'weekly',
    });
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedule = provider.recurringSchedule.filter((_, i) => i !== index);
    onScheduleChange(updatedSchedule);
  };

  const formatWeekDay = (day: WeekDay) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatFrequency = (schedule: RecurringSchedule) => {
    switch (schedule.frequency) {
      case 'weekly':
        return 'Every week';
      case 'biweekly':
        return 'Every 2 weeks';
      case 'monthly':
        return schedule.customPattern?.monthlyDay 
          ? `Monthly on day ${schedule.customPattern.monthlyDay}`
          : 'Monthly';
      case 'custom':
        return schedule.customPattern?.weekInterval
          ? `Every ${schedule.customPattern.weekInterval} weeks`
          : 'Custom';
      default:
        return 'Unknown frequency';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Recurring Schedule</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Schedule
        </button>
      </div>

      {/* Current schedules */}
      <div className="space-y-2">
        {provider.recurringSchedule.map((schedule, index) => (
          <div
            key={`${schedule.weekDay}-${schedule.location}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">{formatWeekDay(schedule.weekDay)}</span>
                <span className="mx-2">•</span>
                <span>{schedule.location}</span>
                <span className="mx-2">•</span>
                <span>{formatTime(schedule.timeSlot.startTime)} - {formatTime(schedule.timeSlot.endTime)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {formatFrequency(schedule)}
                {schedule.customPattern?.startDate && (
                  <>
                    <span className="mx-2">•</span>
                    Starting {new Date(schedule.customPattern.startDate).toLocaleDateString()}
                  </>
                )}
                {schedule.customPattern?.endDate && (
                  <>
                    <span className="mx-2">•</span>
                    Until {new Date(schedule.customPattern.endDate).toLocaleDateString()}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => handleRemoveSchedule(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add schedule form */}
      {showAddForm && (
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Day</label>
              <select
                value={newSchedule.weekDay}
                onChange={(e) => setNewSchedule({ ...newSchedule, weekDay: e.target.value as WeekDay })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {WEEKDAYS.map(day => (
                  <option key={day} value={day}>
                    {formatWeekDay(day)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select
                value={newSchedule.location}
                onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value as Location })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={newSchedule.timeSlot.startTime}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    timeSlot: { ...newSchedule.timeSlot, startTime: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={newSchedule.timeSlot.endTime}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    timeSlot: { ...newSchedule.timeSlot, endTime: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select
                value={newSchedule.frequency}
                onChange={(e) => {
                  const frequency = e.target.value as ScheduleFrequency;
                  setNewSchedule({
                    ...newSchedule,
                    frequency,
                    customPattern: frequency === 'biweekly' 
                      ? { weekInterval: 2 }
                      : frequency === 'monthly'
                      ? { monthlyDay: new Date().getDate() }
                      : undefined
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {(newSchedule.frequency === 'biweekly' || newSchedule.frequency === 'custom') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Week Interval</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={newSchedule.customPattern?.weekInterval || 2}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    customPattern: {
                      ...newSchedule.customPattern,
                      weekInterval: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}

            {newSchedule.frequency === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Day of Month</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newSchedule.customPattern?.monthlyDay || 1}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    customPattern: {
                      ...newSchedule.customPattern,
                      monthlyDay: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={newSchedule.customPattern?.startDate || ''}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    customPattern: {
                      ...newSchedule.customPattern,
                      startDate: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                <input
                  type="date"
                  value={newSchedule.customPattern?.endDate || ''}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule,
                    customPattern: {
                      ...newSchedule.customPattern,
                      endDate: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSchedule}
                className="px-3 py-1.5 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderScheduleEditor;