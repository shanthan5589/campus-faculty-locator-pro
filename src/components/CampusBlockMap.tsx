
import React from "react";
import { Faculty } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Map } from "lucide-react";

interface CampusBlockMapProps {
  faculty: Faculty | null;
  currentLocation?: { building: string; department: string; section: string } | null;
  isHoliday?: boolean;
  holidayReason?: string;
}

const CampusBlockMap: React.FC<CampusBlockMapProps> = ({
  faculty,
  currentLocation,
  isHoliday,
  holidayReason
}) => {
  // If it's a holiday, show a holiday message
  if (isHoliday) {
    return (
      <Card className="overflow-hidden border border-yellow-300 bg-yellow-50 shadow-lg animate-fade-in mb-6">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-400 rounded-full p-3">
              <Map className="h-10 w-10 text-yellow-900" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-yellow-800 mb-2">Holiday Notice</h3>
          <p className="text-lg text-yellow-700">Today is a {holidayReason}.</p>
          <p className="mt-2 text-yellow-600">
            Faculty are not expected to be on campus. All educational activities are suspended for the day.
          </p>
        </div>
      </Card>
    );
  }

  // If no faculty is selected, don't show the map
  if (!faculty) {
    return null;
  }

  // Function to determine which block should be highlighted
  const getBlockHighlight = (blockName: string) => {
    if (!currentLocation) return "bg-gray-100 border-gray-200";
    
    if (currentLocation.building === "CAFETERIA") {
      return blockName === "CAFETERIA" 
        ? "bg-yellow-100 border-yellow-400 shadow-md" 
        : "bg-gray-100 border-gray-200";
    }
    
    return currentLocation.building === blockName 
      ? "bg-green-100 border-green-400 shadow-md" 
      : "bg-gray-100 border-gray-200";
  };

  // Function to determine if a block should show the faculty badge
  const shouldShowFacultyBadge = (blockName: string) => {
    if (!currentLocation) return false;
    
    if (currentLocation.building === "CAFETERIA") {
      return blockName === "CAFETERIA";
    }
    
    return currentLocation.building === blockName;
  };

  return (
    <Card className="shadow-lg border border-faculty-accent/20 overflow-hidden animate-fade-in mb-6">
      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          <Map className="mr-2 text-faculty-primary" />
          <h3 className="text-xl font-semibold text-faculty-primary">
            Campus Block Map
          </h3>
        </div>

        <div className="relative w-full aspect-[4/3] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          {/* Main campus layout grid */}
          <div className="grid grid-cols-3 gap-4 p-4 h-full">
            {/* Top row - Block 1 and 2 */}
            <div className={`col-span-1 flex items-center justify-center border-2 rounded-lg transition-all ${getBlockHighlight("BLOCK 1")}`}>
              <div className="text-center p-4">
                <h4 className="font-bold">BLOCK 1</h4>
                {shouldShowFacultyBadge("BLOCK 1") && (
                  <Badge className="mt-2 bg-faculty-primary animate-pulse">
                    {faculty.name} is here
                  </Badge>
                )}
              </div>
            </div>
            <div className={`col-span-1 flex items-center justify-center border-2 rounded-lg transition-all ${getBlockHighlight("BLOCK 2")}`}>
              <div className="text-center p-4">
                <h4 className="font-bold">BLOCK 2</h4>
                {shouldShowFacultyBadge("BLOCK 2") && (
                  <Badge className="mt-2 bg-faculty-primary animate-pulse">
                    {faculty.name} is here
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Cafeteria in top right */}
            <div className={`col-span-1 flex items-center justify-center border-2 rounded-lg transition-all ${getBlockHighlight("CAFETERIA")}`}>
              <div className="text-center p-4">
                <h4 className="font-bold">CAFETERIA</h4>
                {shouldShowFacultyBadge("CAFETERIA") && (
                  <Badge className="mt-2 bg-yellow-500 animate-pulse">
                    {faculty.name} at lunch
                  </Badge>
                )}
              </div>
            </div>

            {/* Bottom row - Block 3 and 4 */}
            <div className={`col-span-1 flex items-center justify-center border-2 rounded-lg transition-all ${getBlockHighlight("BLOCK 3")}`}>
              <div className="text-center p-4">
                <h4 className="font-bold">BLOCK 3</h4>
                {shouldShowFacultyBadge("BLOCK 3") && (
                  <Badge className="mt-2 bg-faculty-primary animate-pulse">
                    {faculty.name} is here
                  </Badge>
                )}
              </div>
            </div>
            <div className={`col-span-1 flex items-center justify-center border-2 rounded-lg transition-all ${getBlockHighlight("BLOCK 4")}`}>
              <div className="text-center p-4">
                <h4 className="font-bold">BLOCK 4</h4>
                {shouldShowFacultyBadge("BLOCK 4") && (
                  <Badge className="mt-2 bg-faculty-primary animate-pulse">
                    {faculty.name} is here
                  </Badge>
                )}
              </div>
            </div>

            {/* Pathways between blocks */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="text-center bg-green-50 p-2 rounded-lg border border-green-200 w-full">
                <p className="text-sm text-green-700">Campus Grounds</p>
              </div>
            </div>
          </div>

          {/* Legend at the bottom */}
          <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-md border border-gray-200 shadow-sm">
            <div className="flex items-center text-xs text-gray-600">
              <span className="inline-block w-3 h-3 bg-green-100 border border-green-400 mr-1 rounded-sm"></span>
              <span>Current Location</span>
              <span className="inline-block w-3 h-3 bg-yellow-100 border border-yellow-400 mx-2 rounded-sm"></span>
              <span>Cafeteria</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampusBlockMap;
