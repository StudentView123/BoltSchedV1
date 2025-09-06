import { Location, Provider, Role, Staff, ScheduleDay, WeekDay } from '../types';
import { doesDateMatchSchedule } from './scheduling';

export const LOCATIONS: Location[] = ['location1', 'location2'];

export const ROLES: Role[] = ['technician', 'tester', 'scribe', 'frontDesk'];

export const WEEKDAYS: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Dr. Smith',
    requirements: {
      technician: 3,
      tester: 2,
      scribe: 1,
      frontDesk: 3,
    },
    recurringSchedule: [
      {
        weekDay: 'monday',
        location: 'location1',
        timeSlot: { startTime: '09:00', endTime: '17:00' },
        frequency: 'weekly'
      },
      {
        weekDay: 'wednesday',
        location: 'location2',
        timeSlot: { startTime: '09:00', endTime: '17:00' },
        frequency: 'biweekly',
        customPattern: {
          weekInterval: 2,
          startDate: new Date().toISOString().split('T')[0]
        }
      },
      {
        weekDay: 'friday',
        location: 'location1',
        timeSlot: { startTime: '09:00', endTime: '17:00' },
        frequency: 'monthly',
        customPattern: {
          monthlyWeek: 'third'
        }
      }
    ]
  },
  {
    id: 'p2',
    name: 'Dr. Johnson',
    requirements: {
      technician: 1,
      tester: 1,
      scribe: 0,
      frontDesk: 1,
    },
    recurringSchedule: [
      {
        weekDay: 'monday',
        location: 'location1',
        timeSlot: { startTime: '08:00', endTime: '16:00' }
      },
      {
        weekDay: 'tuesday',
        location: 'location2',
        timeSlot: { startTime: '08:00', endTime: '16:00' }
      }
    ]
  },
  {
    id: 'p3',
    name: 'Dr. Williams',
    requirements: {
      technician: 2,
      tester: 1,
      scribe: 1,
      frontDesk: 2,
    },
    recurringSchedule: [
      {
        weekDay: 'monday',
        location: 'location2',
        timeSlot: { startTime: '09:00', endTime: '17:00' }
      },
      {
        weekDay: 'wednesday',
        location: 'location2',
        timeSlot: { startTime: '09:00', endTime: '17:00' }
      },
      {
        weekDay: 'friday',
        location: 'location1',
        timeSlot: { startTime: '09:00', endTime: '17:00' }
      }
    ]
  },
];

export const MOCK_STAFF: Staff[] = [
  { 
    id: 's1', 
    name: 'Alex Kim', 
    roles: ['technician', 'tester'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's2', 
    name: 'Jamie Rivera', 
    roles: ['technician'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's3', 
    name: 'Sam Taylor', 
    roles: ['tester', 'scribe'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's4', 
    name: 'Jordan Lee', 
    roles: ['frontDesk'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's5', 
    name: 'Casey Morgan', 
    roles: ['frontDesk', 'technician'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's6', 
    name: 'Taylor Johnson', 
    roles: ['technician', 'tester'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's7', 
    name: 'Riley Adams', 
    roles: ['scribe'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's8', 
    name: 'Quinn White', 
    roles: ['frontDesk'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's9', 
    name: 'Morgan Chen', 
    roles: ['technician'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
  { 
    id: 's10', 
    name: 'Parker Williams', 
    roles: ['tester'],
    availability: WEEKDAYS.map(weekDay => ({ weekDay, available: true }))
  },
];

// Helper function to generate dates for the next 7 days
export const generateDateRange = (startDate: Date = new Date(), days: number = 7): string[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};

// Generate schedule based on recurring schedules
export const generateEmptySchedule = (): ScheduleDay[] => {
  const dates = generateDateRange();
  
  return dates.map(date => {
    const dayDate = new Date(date);
    
    const scheduledProviders = MOCK_PROVIDERS.flatMap(provider => {
      const matchingSchedules = provider.recurringSchedule.filter(
        schedule => doesDateMatchSchedule(dayDate, schedule)
      );
      
      return matchingSchedules.map(schedule => ({
        providerId: provider.id,
        location: schedule.location,
        timeSlot: schedule.timeSlot,
        assignedStaff: []
      }));
    });

    return {
      date,
      providers: scheduledProviders
    };
  });
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Format time for display
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};