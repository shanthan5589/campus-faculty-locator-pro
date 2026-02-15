
import React, { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FacultySearch from "@/components/FacultySearch";
import WeeklySchedule from "@/components/WeeklySchedule";
import FacultyLocationBox from "@/components/FacultyLocationBox";
import AddFacultyForm from "@/components/AddFacultyForm";
import FacultyLocatorLogo from "@/components/FacultyLocatorLogo";
import { Faculty } from "@/utils/types";
import { findFacultyByName, getAllFacultyNames, getFacultyLocationMessage } from "@/utils/facultyData";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, School, Book, GraduationCap, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampusBlockMap from "@/components/CampusBlockMap";

const Index = () => {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const { toast } = useToast();
  const facultyNames = getAllFacultyNames();

  const handleSearch = (facultyName: string) => {
    const faculty = findFacultyByName(facultyName);
    
    if (faculty) {
      setSelectedFaculty(faculty);
      toast({
        title: "Faculty found",
        description: `Showing schedule for ${faculty.name}`,
      });
    } else {
      toast({
        title: "Faculty not found",
        description: "Could not find faculty with that name or ID. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleFacultyAdded = (facultyName: string) => {
    handleSearch(facultyName);
    toast({
      title: "Faculty added successfully",
      description: `${facultyName} has been added to the faculty list`,
    });
  };

  // Get location info for the selected faculty
  const locationInfo = selectedFaculty ? getFacultyLocationMessage(selectedFaculty) : null;
  const currentLocation = locationInfo?.location?.room;
  const isHoliday = locationInfo?.isHoliday;
  const holidayReason = locationInfo?.holidayReason;

  return (
    <div className="min-h-screen bg-gradient-to-br from-faculty-background to-blue-50">
      <header className="bg-gradient-to-r from-faculty-primary to-faculty-accent text-white py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center">
            <GraduationCap className="text-white/80 h-10 w-10 mr-3 animate-bounce-slow" />
            <div>
              <h1 className="text-4xl font-bold text-center">Campus Faculty Locator Pro</h1>
              <p className="mt-2 text-xl opacity-90 text-center">Find faculty members quickly across campus</p>
            </div>
            <Star className="text-yellow-300/80 h-8 w-8 ml-3 animate-pulse-slow" />
          </div>
          
          <div className="absolute top-0 left-4 opacity-30">
            <div className="grid grid-cols-3 gap-1">
              {Array(9).fill(0).map((_, i) => (
                <School key={i} size={24} className="text-white animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-0 right-4 opacity-30 transform rotate-12">
            <div className="grid grid-cols-3 gap-1">
              {Array(9).fill(0).map((_, i) => (
                <Book key={i} size={16} className="text-white animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <FacultySearch onSearch={handleSearch} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gradient-to-br from-white/70 to-faculty-secondary/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-faculty-accent/20 animate-fade-in">
              <h3 className="text-lg font-semibold text-faculty-primary mb-3 flex items-center">
                <School size={20} className="mr-2" />
                Available Faculty
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {facultyNames.map(name => (
                  <Button 
                    key={name} 
                    variant="outline" 
                    className="border-faculty-accent/30 hover:bg-faculty-accent/10 transition-all duration-300 hover:scale-105"
                    onClick={() => handleSearch(name)}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 order-1 lg:order-2">
            {!selectedFaculty ? (
              <Card className="bg-white/80 backdrop-blur-sm border border-faculty-accent/20 shadow-lg animate-fade-in overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-faculty-secondary/10 to-faculty-accent/10">
                  <CardTitle className="text-center text-faculty-primary flex items-center justify-center">
                    <Sparkles className="mr-2 text-yellow-500" size={24} />
                    Welcome to Faculty Locator
                    <Sparkles className="ml-2 text-yellow-500" size={24} />
                  </CardTitle>
                  <CardDescription className="text-center">
                    Find where faculty members are located throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FacultyLocatorLogo />
                  <div className="text-center py-2">
                    <p className="text-xl text-gray-700 mb-6">
                      Search for a faculty member by name or ID to view their schedule.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
        
        {selectedFaculty && (
          <>
            <div className="mb-6 bg-gradient-to-r from-white/90 to-faculty-secondary/10 p-6 rounded-lg shadow-md border border-faculty-accent/20 animate-fade-in">
              <h2 className="text-3xl font-bold text-faculty-primary flex items-center">
                <Book className="mr-3" size={28} />
                {selectedFaculty.name}'s Schedule
              </h2>
              <p className="text-gray-600">Faculty ID: {selectedFaculty.id}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FacultyLocationBox faculty={selectedFaculty} />
                <CampusBlockMap 
                  faculty={selectedFaculty} 
                  currentLocation={currentLocation} 
                  isHoliday={isHoliday} 
                  holidayReason={holidayReason}
                />
              </div>
              <div>
                <WeeklySchedule faculty={selectedFaculty} />
              </div>
            </div>
          </>
        )}
        
        {/* Add Faculty Form - Improved design */}
        <div className="mt-10 bg-gradient-to-br from-[#1e3a8a]/5 to-[#0d9488]/5 p-8 rounded-xl shadow-lg border border-faculty-accent/20 animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,64,175,0.1),transparent_70%)]"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-faculty-primary to-faculty-accent rounded-full mb-4 shadow-lg">
                <UserPlus size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-faculty-primary">
                Add New Faculty Member
              </h2>
              <p className="text-gray-600 mt-2">Create a new faculty member by generating a schedule or building one yourself</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-faculty-accent/10 rounded-lg p-6 shadow-md">
              <AddFacultyForm onFacultyAdded={handleFacultyAdded} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-faculty-primary to-faculty-accent text-white py-8 mt-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2),transparent_70%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center items-center mb-2">
            <GraduationCap className="mr-2" size={18} />
            <p className="text-lg font-medium">Campus Faculty Locator Pro</p>
            <Star className="ml-2 text-yellow-300" size={16} />
          </div>
          <p className="text-sm opacity-80 mt-1">© 2025 Helping you find faculty members efficiently</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
