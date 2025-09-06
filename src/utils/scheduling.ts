import { Provider, Staff, Role, WeekDay, StaffAssignment, TimeSlot, AssignmentScore, RecurringSchedule } from '../types';

// Check if a date matches a recurring schedule pattern
export const doesDateMatchSchedule = (date: Date, schedule: RecurringSchedule): boolean => {
  const weekDay = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as WeekDay;
  
  // Check if the weekday matches
  if (weekDay !== schedule.weekDay) return false;
  
  // Check date range if specified
  if (schedule.customPattern?.startDate) {
    const startDate = new Date(schedule.customPattern.startDate);
    if (date < startDate) return false;
  }
  
  if (schedule.customPattern?.endDate) {
    const endDate = new Date(schedule.customPattern.endDate);
    if (date > endDate) return false;
  }
  
  // Check exceptions
  if (schedule.exceptions?.includes(date.toISOString().split('T')[0])) {
    return false;
  }
  
  switch (schedule.frequency) {
    case 'weekly':
      return true;
      
    case 'biweekly':
      if (!schedule.customPattern?.startDate) return false;
      const startDate = new Date(schedule.customPattern.startDate);
      const weekDiff = Math.floor(
        (date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      return weekDiff % 2 === 0;
      
    case 'monthly':
      if (schedule.customPattern?.monthlyDay) {
        return date.getDate() === schedule.customPattern.monthlyDay;
      }
      if (schedule.customPattern?.monthlyWeek) {
        const weekNum = Math.ceil(date.getDate() / 7);
        const isLastWeek = date.getDate() > 21;
        
        switch (schedule.customPattern.monthlyWeek) {
          case 'first': return weekNum === 1;
          case 'second': return weekNum === 2;
          case 'third': return weekNum === 3;
          case 'fourth': return weekNum === 4;
          case 'last': return isLastWeek;
        }
      }
      return false;
      
    case 'custom':
      if (!schedule.customPattern?.weekInterval || !schedule.customPattern?.startDate) {
        return false;
      }
      const customStartDate = new Date(schedule.customPattern.startDate);
      const customWeekDiff = Math.floor(
        (date.getTime() - customStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      return customWeekDiff % schedule.customPattern.weekInterval === 0;
      
    default:
      return false;
  }
};

// Check if a staff member is available for a given time slot
export const isStaffAvailable = (
  staff: Staff,
  weekDay: WeekDay,
  timeSlot: TimeSlot
): boolean => {
  const availability = staff.availability.find(a => a.weekDay === weekDay);
  
  if (!availability || !availability.available) {
    return false;
  }
  
  if (!availability.timeSlot) {
    return true; // Available all day
  }
  
  // Check if the staff's available hours overlap with the required time slot
  const availStart = parseInt(availability.timeSlot.startTime.replace(':', ''));
  const availEnd = parseInt(availability.timeSlot.endTime.replace(':', ''));
  const requiredStart = parseInt(timeSlot.startTime.replace(':', ''));
  const requiredEnd = parseInt(timeSlot.endTime.replace(':', ''));
  
  return availStart <= requiredStart && availEnd >= requiredEnd;
};

// Calculate a score for assigning a staff member to a provider
const calculateAssignmentScore = (
  staff: Staff,
  provider: Provider,
  role: Role,
  existingAssignments: StaffAssignment[]
): number => {
  let score = 0;
  
  // Base score for role capability
  if (staff.roles.includes(role)) {
    score += 100;
  }
  
  // Preferred location bonus
  if (staff.preferredLocation === provider.location) {
    score += 20;
  }
  
  // Provider preference bonus
  const providerPreferenceIndex = provider.staffPreferences?.indexOf(staff.id) ?? -1;
  if (providerPreferenceIndex !== -1) {
    score += Math.max(0, 50 - providerPreferenceIndex * 5); // Higher score for higher preference
  }
  
  // Staff preference bonus
  const staffPreferenceIndex = staff.preferredProviders?.indexOf(provider.id) ?? -1;
  if (staffPreferenceIndex !== -1) {
    score += Math.max(0, 30 - staffPreferenceIndex * 3);
  }
  
  // Workload balance penalty
  const existingAssignmentCount = existingAssignments.filter(a => a.staffId === staff.id).length;
  score -= existingAssignmentCount * 10;
  
  return score;
};

// Auto-assign staff to a provider based on requirements and availability
export const autoAssignStaff = (
  provider: Provider,
  availableStaff: Staff[],
  weekDay: WeekDay,
  timeSlot: TimeSlot,
  existingAssignments: StaffAssignment[]
): StaffAssignment[] => {
  const assignments: StaffAssignment[] = [];
  const roleRequirements = { ...provider.requirements };
  
  // Calculate scores for all possible assignments
  const assignmentScores: AssignmentScore[] = [];
  
  for (const role of Object.keys(roleRequirements) as Role[]) {
    const required = roleRequirements[role];
    if (required === 0) continue;
    
    for (const staff of availableStaff) {
      if (!isStaffAvailable(staff, weekDay, timeSlot)) continue;
      if (!staff.roles.includes(role)) continue;
      
      const score = calculateAssignmentScore(staff, provider, role, existingAssignments);
      assignmentScores.push({ staffId: staff.id, role, score });
    }
  }
  
  // Sort assignments by score (highest first)
  assignmentScores.sort((a, b) => b.score - a.score);
  
  // Make assignments based on scores while respecting requirements
  for (const { staffId, role, score } of assignmentScores) {
    if (roleRequirements[role] > 0 && 
        !assignments.some(a => a.staffId === staffId)) {
      assignments.push({ staffId, assignedRole: role });
      roleRequirements[role]--;
    }
  }
  
  return assignments;
};