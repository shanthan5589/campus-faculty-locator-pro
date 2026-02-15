
import { ClassSession, DayOfWeek, Faculty, Room, TimeSlot } from "./types";

// Define buildings and rooms
const BUILDINGS = ["BLOCK 1", "BLOCK 2", "BLOCK 3", "BLOCK 4"];
const DEPARTMENTS = ["AIML", "CSDS", "CSBS", "CSAI", "CSE", "ECE", "MECH", "IT"];
const SECTIONS = ["A", "B", "C"];

// Define time slots for classes (excluding lunch)
const MORNING_TIME_SLOTS: TimeSlot[] = [
  { startTime: "09:00", endTime: "09:55" },
  { startTime: "09:55", endTime: "10:50" },
  { startTime: "10:50", endTime: "11:45" }
];

// Updated lunch timing from 11:30 to 12:10
const LUNCH_SLOT: TimeSlot = { startTime: "11:30", endTime: "12:10" };

const AFTERNOON_TIME_SLOTS: TimeSlot[] = [
  { startTime: "12:10", endTime: "13:05" },
  { startTime: "13:05", endTime: "14:00" },
  { startTime: "14:00", endTime: "14:55" },
  { startTime: "14:55", endTime: "15:30" }
];

const ALL_TIME_SLOTS = [...MORNING_TIME_SLOTS, LUNCH_SLOT, ...AFTERNOON_TIME_SLOTS];

// Public holidays (you can add more as needed)
export const PUBLIC_HOLIDAYS = [
  { day: 1, month: 1, description: "New Year's Day" },
  { day: 26, month: 1, description: "Republic Day" },
  { day: 15, month: 8, description: "Independence Day" },
  { day: 2, month: 10, description: "Gandhi Jayanti" },
  { day: 25, month: 12, description: "Christmas" },
  // Add more holidays as needed
];

// Helper function to generate a random room
const getRandomRoom = (): Room => {
  const building = BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)];
  const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
  const section = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
  return { building, department, section };
};

// Helper function to create a lunch session
const createLunchSession = (): ClassSession => {
  return {
    room: { building: "CAFETERIA", department: "LUNCH AREA", section: "-" },
    timeSlot: LUNCH_SLOT,
    isLunch: true
  };
};

// Create a set to track used room-timeslot combinations to avoid conflicts
const usedRoomTimeSlots = new Set<string>();

// Helper function to generate a unique classroom session
const generateUniqueClassSession = (timeSlot: TimeSlot): ClassSession => {
  let room: Room;
  let key: string;
  
  // Keep generating rooms until we find an unused combination
  do {
    room = getRandomRoom();
    key = `${room.building}-${room.department}-${room.section}-${timeSlot.startTime}`;
  } while (usedRoomTimeSlots.has(key));
  
  // Mark this combination as used
  usedRoomTimeSlots.add(key);
  
  return {
    room,
    timeSlot,
    isLunch: false
  };
};

// Helper function to create a special session (LAB or SRP)
const createSpecialSession = (specialType: string, timeSlotStart: string, timeSlotEnd: string): ClassSession => {
  const room = getRandomRoom();
  return {
    room: {
      ...room,
      department: specialType // Set the department to the special type (LAB or SRP)
    },
    timeSlot: { startTime: timeSlotStart, endTime: timeSlotEnd },
    isLunch: false
  };
};

// Generate a complete day schedule for a faculty member
const generateDaySchedule = () => {
  const sessions: ClassSession[] = [];
  
  // Morning sessions
  for (const timeSlot of MORNING_TIME_SLOTS) {
    // 70% chance of having a class during this slot
    if (Math.random() < 0.7) {
      sessions.push(generateUniqueClassSession(timeSlot));
    }
  }
  
  // Lunch (always present)
  sessions.push(createLunchSession());
  
  // Afternoon sessions
  for (const timeSlot of AFTERNOON_TIME_SLOTS) {
    // 70% chance of having a class during this slot
    if (Math.random() < 0.7) {
      sessions.push(generateUniqueClassSession(timeSlot));
    }
  }
  
  return { sessions };
};

// Generate a complete weekly schedule with special modifications for specific faculty
const generateWeeklySchedule = (facultyName?: string) => {
  const schedule = {
    [DayOfWeek.MONDAY]: generateDaySchedule(),
    [DayOfWeek.TUESDAY]: generateDaySchedule(),
    [DayOfWeek.WEDNESDAY]: generateDaySchedule(),
    [DayOfWeek.THURSDAY]: generateDaySchedule(),
    [DayOfWeek.FRIDAY]: generateDaySchedule(),
    [DayOfWeek.SATURDAY]: generateDaySchedule()
  };

  // Apply special modifications for specific faculty
  if (facultyName) {
    if (facultyName === "Nethrasri") {
      // Modify Nethrasri's Monday schedule from 1:05 to 3:30 to LAB
      const labSession = createSpecialSession("LAB", "13:05", "15:30");
      
      // Filter out any classes in this time range
      schedule[DayOfWeek.MONDAY].sessions = schedule[DayOfWeek.MONDAY].sessions.filter(session => 
        session.isLunch || !(session.timeSlot.startTime >= "13:05" && session.timeSlot.startTime < "15:30")
      );
      
      // Add the LAB session
      schedule[DayOfWeek.MONDAY].sessions.push(labSession);
    }
    else if (facultyName === "Saritha") {
      // Modify Saritha's Tuesday schedule from 9:00 to 11:30 to LAB (updated to LAB)
      const labSession = createSpecialSession("LAB", "09:00", "11:30");
      
      // Filter out any classes in this time range
      schedule[DayOfWeek.TUESDAY].sessions = schedule[DayOfWeek.TUESDAY].sessions.filter(session => 
        session.isLunch || !(session.timeSlot.startTime >= "09:00" && session.timeSlot.startTime < "11:30")
      );
      
      // Add the LAB session
      schedule[DayOfWeek.TUESDAY].sessions.push(labSession);
    }
    else if (facultyName === "Sravani") {
      // Modify Sravani's Saturday schedule from 1:05 to 3:30 to LAB (updated to LAB)
      const labSession = createSpecialSession("LAB", "13:05", "15:30");
      
      // Filter out any classes in this time range
      schedule[DayOfWeek.SATURDAY].sessions = schedule[DayOfWeek.SATURDAY].sessions.filter(session => 
        session.isLunch || !(session.timeSlot.startTime >= "13:05" && session.timeSlot.startTime < "15:30")
      );
      
      // Add the LAB session
      schedule[DayOfWeek.SATURDAY].sessions.push(labSession);
    }
    else if (facultyName === "Rajini") {
      // Modify Rajini's Wednesday schedule from 9:00 to 11:30 to SRP
      const srpSession = createSpecialSession("SRP", "09:00", "11:30");
      
      // Filter out any classes in this time range
      schedule[DayOfWeek.WEDNESDAY].sessions = schedule[DayOfWeek.WEDNESDAY].sessions.filter(session => 
        session.isLunch || !(session.timeSlot.startTime >= "09:00" && session.timeSlot.startTime < "11:30")
      );
      
      // Add the SRP session
      schedule[DayOfWeek.WEDNESDAY].sessions.push(srpSession);
    }
  }

  return schedule;
};

// Generate faculty data
export const facultyData: Faculty[] = [
  { 
    id: "F001", 
    name: "Revathi",
    schedule: generateWeeklySchedule()
  },
  { 
    id: "F002", 
    name: "Shamila",
    schedule: generateWeeklySchedule()
  },
  { 
    id: "F003", 
    name: "Saritha",
    schedule: generateWeeklySchedule("Saritha")
  },
  { 
    id: "F004", 
    name: "Nethrasri",
    schedule: generateWeeklySchedule("Nethrasri")
  },
  { 
    id: "F005", 
    name: "Yesu",
    schedule: generateWeeklySchedule()
  },
  { 
    id: "F006", 
    name: "Rajini",
    schedule: generateWeeklySchedule("Rajini")
  },
  { 
    id: "F007", 
    name: "Sravani",
    schedule: generateWeeklySchedule("Sravani")
  }
];

// Function to find faculty by name (case insensitive)
export const findFacultyByName = (name: string): Faculty | undefined => {
  return facultyData.find(faculty => 
    faculty.name.toLowerCase() === name.toLowerCase() ||
    faculty.id.toLowerCase() === name.toLowerCase()
  );
};

// Add new faculty member with auto-generated schedule
export const addFacultyMember = (name: string): Faculty => {
  const id = `F${(facultyData.length + 1).toString().padStart(3, '0')}`;
  const newFaculty: Faculty = {
    id,
    name,
    schedule: generateWeeklySchedule(name) // Pass the name to apply any special rules if needed
  };
  
  facultyData.push(newFaculty);
  return newFaculty;
};

// Add new faculty with custom schedule
export const addFacultyWithCustomSchedule = (name: string, schedule: Record<DayOfWeek, { sessions: ClassSession[] }>) => {
  const id = `F${(facultyData.length + 1).toString().padStart(3, '0')}`;
  const newFaculty: Faculty = {
    id,
    name,
    schedule
  };
  
  facultyData.push(newFaculty);
  return newFaculty;
};

// Get all faculty names for dropdown
export const getAllFacultyNames = (): string[] => {
  return facultyData.map(faculty => faculty.name);
};

// Check if today is a public holiday or Sunday
export const isHoliday = (date: Date = new Date()): { isHoliday: boolean; reason: string } => {
  // Check if it's Sunday (day 0)
  if (date.getDay() === 0) {
    return { isHoliday: true, reason: "Sunday" };
  }
  
  // Check if it's a public holiday
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  
  const holiday = PUBLIC_HOLIDAYS.find(h => h.day === day && h.month === month);
  
  if (holiday) {
    return { isHoliday: true, reason: holiday.description };
  }
  
  return { isHoliday: false, reason: "" };
};

// Get current day name
export const getCurrentDayName = (): DayOfWeek => {
  const days = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY
  ];
  
  const today = new Date().getDay();
  // Convert from JS day (0=Sunday) to our enum (0=Monday)
  const dayIndex = today === 0 ? 5 : today - 1;
  
  return days[dayIndex < days.length ? dayIndex : 0];
};

// Get current time slot based on the current time
export const getCurrentTimeSlot = (): TimeSlot | null => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  
  for (const slot of ALL_TIME_SLOTS) {
    if (currentTime >= slot.startTime && currentTime < slot.endTime) {
      return slot;
    }
  }
  
  return null; // Outside of any time slot
};

// Find where a faculty is right now
export const findCurrentFacultyLocation = (faculty: Faculty): ClassSession | null => {
  // Check if it's a holiday first
  const holidayCheck = isHoliday();
  if (holidayCheck.isHoliday) {
    return null; // No location on holidays
  }
  
  const currentDay = getCurrentDayName();
  const currentTimeSlot = getCurrentTimeSlot();
  
  if (!currentTimeSlot) {
    return null; // Outside of school hours
  }
  
  const daySchedule = faculty.schedule[currentDay];
  
  for (const session of daySchedule.sessions) {
    if (
      session.timeSlot.startTime === currentTimeSlot.startTime &&
      session.timeSlot.endTime === currentTimeSlot.endTime
    ) {
      return session;
    }
  }
  
  return null; // No class this period
};

// New function to get a formatted message about faculty location
export const getFacultyLocationMessage = (faculty: Faculty): { message: string; location?: ClassSession; isHoliday?: boolean; holidayReason?: string } => {
  // Check if it's a holiday first
  const holidayCheck = isHoliday();
  if (holidayCheck.isHoliday) {
    return { 
      message: `Today is a holiday (${holidayCheck.reason}). Faculty are not expected to be on campus.`,
      isHoliday: true,
      holidayReason: holidayCheck.reason
    };
  }
  
  const currentLocation = findCurrentFacultyLocation(faculty);
  const currentDay = getCurrentDayName();
  const currentTimeSlot = getCurrentTimeSlot();
  
  if (!currentTimeSlot) {
    return { 
      message: "Outside of college hours. Faculty is likely not on campus." 
    };
  }
  
  if (currentLocation) {
    if (currentLocation.isLunch) {
      return { 
        message: `Currently at lunch in the Cafeteria (${currentLocation.timeSlot.startTime} - ${currentLocation.timeSlot.endTime})`,
        location: currentLocation
      };
    }
    
    return { 
      message: `Currently teaching in ${currentLocation.room.building}, ${currentLocation.room.department} Section ${currentLocation.room.section} (${currentLocation.timeSlot.startTime} - ${currentLocation.timeSlot.endTime})`,
      location: currentLocation
    };
  }
  
  // Try to find the next class for today
  const sortedSessions = [...faculty.schedule[currentDay].sessions]
    .sort((a, b) => a.timeSlot.startTime.localeCompare(b.timeSlot.startTime))
    .filter(session => session.timeSlot.startTime > (currentTimeSlot?.startTime || ""));
  
  if (sortedSessions.length > 0) {
    const nextSession = sortedSessions[0];
    return { 
      message: `Free period. Next class at ${nextSession.timeSlot.startTime} in ${nextSession.room.building}, ${nextSession.room.department} Section ${nextSession.room.section}.`
    };
  }
  
  return { 
    message: "No more classes scheduled for today. Faculty may be in their office or off campus."
  };
};
