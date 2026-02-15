
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClassSession, DayOfWeek, Faculty } from "@/utils/types";
import { findCurrentFacultyLocation } from "@/utils/facultyData";
import { Clock, MapPin, Calendar } from "lucide-react";

interface DailyScheduleProps {
  faculty: Faculty;
  day: DayOfWeek;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ faculty, day }) => {
  const daySchedule = faculty.schedule[day];
  const sessions = [...daySchedule.sessions].sort((a, b) => 
    a.timeSlot.startTime.localeCompare(b.timeSlot.startTime)
  );

  // Check if any session is current
  const currentLocation = findCurrentFacultyLocation(faculty);

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getDayTitle = (day: DayOfWeek): string => {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  const isCurrentSession = (session: ClassSession): boolean => {
    if (!currentLocation) return false;
    
    return (
      session.timeSlot.startTime === currentLocation.timeSlot.startTime &&
      session.room.building === currentLocation.room.building &&
      session.room.department === currentLocation.room.department &&
      session.room.section === currentLocation.room.section
    );
  };

  // Function to get a color class based on session type
  const getSessionColor = (session: ClassSession): string => {
    if (session.isLunch) return "bg-yellow-50 border-yellow-200";
    if (session.room.department === "LAB") return "bg-blue-50 border-blue-200";
    if (session.room.department === "SRP") return "bg-purple-50 border-purple-200";
    if (session.room.department === "SPECIAL CLASS") return "bg-pink-50 border-pink-200";
    return "border-gray-200";
  };

  // Function to get badge color
  const getBadgeColor = (session: ClassSession): string => {
    if (session.isLunch) return "bg-yellow-500";
    if (session.room.department === "LAB") return "bg-blue-500";
    if (session.room.department === "SRP") return "bg-purple-500";
    if (session.room.department === "SPECIAL CLASS") return "bg-pink-500";
    return "bg-faculty-primary";
  };

  return (
    <Card className="mb-8 shadow-md border-faculty-accent/10">
      <CardHeader className="bg-gradient-to-r from-faculty-primary/80 to-faculty-accent/80 text-white">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Calendar size={20} className="mr-2" />
            {getDayTitle(day)}'s Schedule
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No scheduled sessions for this day.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-md border transition-all hover:shadow-md ${getSessionColor(session)} ${
                  isCurrentSession(session) ? 'ring-2 ring-faculty-accent' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <div className="flex items-center">
                      <Clock size={18} className="text-faculty-secondary mr-2" />
                      <span className="font-medium">
                        {formatTimeSlot(session.timeSlot.startTime)} - {formatTimeSlot(session.timeSlot.endTime)}
                      </span>
                      {isCurrentSession(session) && (
                        <Badge className="ml-3 bg-green-600 animate-pulse">Current Location</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <MapPin size={18} className="text-faculty-secondary mr-2" />
                      <span className="font-medium">
                        {session.isLunch ? (
                          "Cafeteria - Lunch Break"
                        ) : (
                          <>
                            {session.room.building} - {session.room.department} Section {session.room.section}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <Badge className={`${getBadgeColor(session)} px-3 py-1 text-sm`}>
                    {session.isLunch ? "Lunch" : 
                     session.room.department === "LAB" ? "LAB" :
                     session.room.department === "SRP" ? "SRP" :
                     session.room.department === "SPECIAL CLASS" ? "Special Class" : "Class"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
