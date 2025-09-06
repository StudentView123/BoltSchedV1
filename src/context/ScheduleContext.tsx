import { createContext, useContext, useState, ReactNode } from 'react';
import { Location, Provider, ScheduleDay, Staff, ProviderSchedule, StaffAssignment, Role, WeekDay } from '../types';
import { MOCK_PROVIDERS, MOCK_STAFF, generateEmptySchedule } from '../utils/mockData';
import { autoAssignStaff } from '../utils/scheduling';

interface ScheduleContextType {
  providers: Provider[];
  staff: Staff[];
  schedule: ScheduleDay[];
  selectedDate: string;
  // Actions
  setSelectedDate: (date: string) => void;
  addProvider: (provider: Provider) => void;
  updateProvider: (provider: Provider) => void;
  removeProvider: (providerId: string) => void;
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  removeStaff: (staffId: string) => void;
  assignProviderToDate: (date: string, providerId: string, location: Location) => void;
  removeProviderFromDate: (date: string, providerId: string) => void;
  assignStaffToProvider: (date: string, providerId: string, staffId: string, role: Role) => void;
  removeStaffFromProvider: (date: string, providerId: string, staffId: string) => void;
  autoAssignStaffToProvider: (date: string, providerId: string) => void;
  autoAssignAllStaff: (date: string, providerId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [schedule, setSchedule] = useState<ScheduleDay[]>(generateEmptySchedule());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const addProvider = (provider: Provider) => {
    setProviders([...providers, provider]);
  };

  const updateProvider = (provider: Provider) => {
    setProviders(providers.map(p => (p.id === provider.id ? provider : p)));
  };

  const removeProvider = (providerId: string) => {
    setProviders(providers.filter(p => p.id !== providerId));
  };

  const addStaff = (staffMember: Staff) => {
    setStaff([...staff, staffMember]);
  };

  const updateStaff = (staffMember: Staff) => {
    setStaff(staff.map(s => (s.id === staffMember.id ? staffMember : s)));
  };

  const removeStaff = (staffId: string) => {
    setStaff(staff.filter(s => s.id !== staffId));
  };

  const assignProviderToDate = (date: string, providerId: string, location: Location) => {
    setSchedule(
      schedule.map(day => {
        if (day.date === date) {
          // Check if provider is already assigned
          const providerExists = day.providers.some(p => p.providerId === providerId);
          
          if (providerExists) {
            // Update existing provider location
            return {
              ...day,
              providers: day.providers.map(p => 
                p.providerId === providerId ? { ...p, location } : p
              )
            };
          } else {
            // Find the provider data
            const providerData = providers.find(p => p.id === providerId);
            if (!providerData) return day;

            // Get the day of week
            const dayDate = new Date(date);
            const weekDay = dayDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as WeekDay;

            // Find matching recurring schedule
            const recurringSchedule = providerData.recurringSchedule.find(
              schedule => schedule.weekDay === weekDay && schedule.location === location
            );

            // Use recurring schedule time slot or default
            const timeSlot = recurringSchedule?.timeSlot || {
              startTime: '09:00',
              endTime: '17:00'
            };

            // Add new provider to the day with time slot
            return {
              ...day,
              providers: [
                ...day.providers, 
                { 
                  providerId, 
                  location, 
                  assignedStaff: [],
                  timeSlot
                }
              ]
            };
          }
        }
        return day;
      })
    );
  };

  const removeProviderFromDate = (date: string, providerId: string) => {
    setSchedule(
      schedule.map(day => {
        if (day.date === date) {
          return {
            ...day,
            providers: day.providers.filter(p => p.providerId !== providerId)
          };
        }
        return day;
      })
    );
  };

  const assignStaffToProvider = (date: string, providerId: string, staffId: string, role: Role) => {
    setSchedule(
      schedule.map(day => {
        if (day.date === date) {
          return {
            ...day,
            providers: day.providers.map(provider => {
              if (provider.providerId === providerId) {
                // Check if staff is already assigned to this provider
                const staffExists = provider.assignedStaff.some(s => s.staffId === staffId);
                
                if (staffExists) {
                  // Update existing staff role
                  return {
                    ...provider,
                    assignedStaff: provider.assignedStaff.map(s => 
                      s.staffId === staffId ? { staffId, assignedRole: role } : s
                    )
                  };
                } else {
                  // Add new staff assignment
                  return {
                    ...provider,
                    assignedStaff: [
                      ...provider.assignedStaff,
                      { staffId, assignedRole: role }
                    ]
                  };
                }
              }
              return provider;
            })
          };
        }
        return day;
      })
    );
  };

  const removeStaffFromProvider = (date: string, providerId: string, staffId: string) => {
    setSchedule(
      schedule.map(day => {
        if (day.date === date) {
          return {
            ...day,
            providers: day.providers.map(provider => {
              if (provider.providerId === providerId) {
                return {
                  ...provider,
                  assignedStaff: provider.assignedStaff.filter(s => s.staffId !== staffId)
                };
              }
              return provider;
            })
          };
        }
        return day;
      })
    );
  };

  const autoAssignStaffToProvider = (date: string, providerId: string) => {
    setSchedule(
      schedule.map(day => {
        if (day.date === date) {
          return {
            ...day,
            providers: day.providers.map(provider => {
              if (provider.providerId === providerId) {
                const providerData = providers.find(p => p.id === providerId);
                if (!providerData) return provider;
                
                const dayDate = new Date(date);
                const weekDay = dayDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as WeekDay;
                
                const assignments = autoAssignStaff(
                  providerData,
                  staff,
                  weekDay,
                  provider.timeSlot,
                  provider.assignedStaff
                );
                
                return {
                  ...provider,
                  assignedStaff: assignments
                };
              }
              return provider;
            })
          };
        }
        return day;
      })
    );
  };

  const autoAssignAllStaff = (date: string, providerId: string) => {
    autoAssignStaffToProvider(date, providerId);
  };

  const value = {
    providers,
    staff,
    schedule,
    selectedDate,
    setSelectedDate,
    addProvider,
    updateProvider,
    removeProvider,
    addStaff,
    updateStaff,
    removeStaff,
    assignProviderToDate,
    removeProviderFromDate,
    assignStaffToProvider,
    removeStaffFromProvider,
    autoAssignStaffToProvider,
    autoAssignAllStaff
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};