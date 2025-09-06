// Core application types

export type Role = 'technician' | 'tester' | 'scribe' | 'frontDesk';

export type Location = 'location1' | 'location2';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type ScheduleFrequency = 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface TimeSlot {
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface RecurringSchedule {
  weekDay: WeekDay;
  location: Location;
  timeSlot: TimeSlot;
  frequency: ScheduleFrequency;
  customPattern?: {
    weekInterval?: number; // For biweekly/custom patterns
    monthlyDay?: number; // For monthly patterns (1-31)
    monthlyWeek?: 'first' | 'second' | 'third' | 'fourth' | 'last'; // For monthly patterns (e.g., "third Friday")
    startDate?: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
  };
  exceptions?: string[]; // Array of dates (YYYY-MM-DD) when provider is not available
}

export interface Provider {
  id: string;
  name: string;
  requirements: Record<Role, number>;
  recurringSchedule: RecurringSchedule[];
  staffPreferences?: string[]; // Ordered list of preferred staff IDs
  defaultLocation?: Location;
  defaultTimeSlot?: TimeSlot;
}

export interface StaffAvailability {
  weekDay: WeekDay;
  available: boolean;
  timeSlot?: TimeSlot; // If available, optional custom hours
}

export interface Staff {
  id: string;
  name: string;
  roles: Role[];
  preferredLocation?: Location;
  availability: StaffAvailability[];
  preferredProviders?: string[]; // Ordered list of preferred provider IDs
  maxHoursPerWeek?: number;
  minHoursPerWeek?: number;
}

export interface ScheduleDay {
  date: string;
  providers: ProviderSchedule[];
}

export interface ProviderSchedule {
  providerId: string;
  location: Location;
  timeSlot: TimeSlot;
  assignedStaff: StaffAssignment[];
}

export interface StaffAssignment {
  staffId: string;
  assignedRole: Role;
}

export interface ResourceRequirement {
  role: Role;
  count: number;
  assignedStaff: string[];
}

export interface ScheduleViewOptions {
  view: 'day' | 'week' | 'month';
  location?: Location;
  date: Date;
}

export interface AssignmentScore {
  staffId: string;
  score: number;
  role: Role;
}