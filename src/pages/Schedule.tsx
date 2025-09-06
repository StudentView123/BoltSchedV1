import React, { useState } from 'react';
import { Calendar, Plus, Grid, List } from 'lucide-react';
import { useSchedule } from '../context/ScheduleContext';
import DateSelector from '../components/schedule/DateSelector';
import ProviderScheduleCard from '../components/schedule/ProviderScheduleCard';
import AddProviderModal from '../components/schedule/AddProviderModal';
import MonthView from '../components/schedule/MonthView';

const Schedule: React.FC = () => {
  const { schedule, providers, selectedDate } = useSchedule();
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [view, setView] = useState<'day' | 'month'>('day');

  const todaySchedule = schedule.find(day => day.date === selectedDate) || { date: selectedDate, providers: [] };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500">Manage provider and staff assignments</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                view === 'day'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
                view === 'month'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setIsAddingProvider(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </button>
        </div>
      </div>
      
      {view === 'day' ? (
        <>
          <DateSelector />
          
          {todaySchedule.providers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No providers scheduled</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a provider to start creating the schedule for this day.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddingProvider(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Provider
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todaySchedule.providers.map(providerSchedule => {
                const provider = providers.find(p => p.id === providerSchedule.providerId);
                if (!provider) return null;
                
                return (
                  <ProviderScheduleCard
                    key={providerSchedule.providerId}
                    date={selectedDate}
                    provider={provider}
                    providerSchedule={providerSchedule}
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        <MonthView />
      )}
      
      {isAddingProvider && (
        <AddProviderModal
          date={selectedDate}
          onClose={() => setIsAddingProvider(false)}
        />
      )}
    </div>
  );
};

export default Schedule;