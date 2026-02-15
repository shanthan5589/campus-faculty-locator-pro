
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Faculty } from "@/utils/types";
import { getFacultyLocationMessage } from "@/utils/facultyData";
import { MapPin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FacultyLocationBoxProps {
  faculty: Faculty;
}

const FacultyLocationBox: React.FC<FacultyLocationBoxProps> = ({ faculty }) => {
  const { message, location } = getFacultyLocationMessage(faculty);
  const now = new Date();
  
  return (
    <Card className="mb-6 border-2 border-faculty-accent">
      <CardHeader className="bg-faculty-accent text-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin size={18} />
          Current Location Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>As of {format(now, 'h:mm a')}</span>
            <Calendar size={16} className="ml-2" />
            <span>{format(now, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Badge className={location?.isLunch ? "bg-yellow-500" : location ? "bg-green-500" : "bg-gray-500"}>
              {location?.isLunch ? "At Lunch" : location ? "In Class" : "Not In Class"}
            </Badge>
          </div>
          
          <p className="text-lg font-medium">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyLocationBox;
