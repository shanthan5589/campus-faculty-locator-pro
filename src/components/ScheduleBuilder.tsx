
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar, Clock, Briefcase, BookOpen, Coffee, School, Plus, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { addFacultyWithCustomSchedule } from "@/utils/facultyData";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DayOfWeek, ClassSession, Room, TimeSlot } from "@/utils/types";

interface ScheduleBuilderProps {
  onComplete: (facultyName: string) => void;
}

interface FormValues {
  facultyName: string;
  building: string;
  department: string;
  section: string;
  startTime: string;
  endTime: string;
  day: string;
  sessionType: string;
}

interface ScheduleEntry {
  day: DayOfWeek;
  session: ClassSession;
}

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      facultyName: "",
      building: "",
      department: "",
      section: "A",
      startTime: "09:00",
      endTime: "09:55",
      day: DayOfWeek.MONDAY,
      sessionType: "class"
    },
  });

  const addSessionToSchedule = (data: FormValues) => {
    const day = data.day as DayOfWeek;
    const isLunch = data.sessionType === "lunch";
    
    const session: ClassSession = {
      room: {
        building: isLunch ? "CAFETERIA" : data.building,
        department: isLunch ? "LUNCH AREA" : data.department,
        section: isLunch ? "-" : data.section,
      },
      timeSlot: {
        startTime: data.startTime,
        endTime: data.endTime
      },
      isLunch
    };

    setScheduleEntries([...scheduleEntries, { day, session }]);
    
    toast({
      title: "Session added",
      description: `Added ${isLunch ? "lunch break" : "class session"} on ${day} from ${data.startTime} to ${data.endTime}`,
    });
    
    // Reset form fields except faculty name
    const facultyName = form.getValues("facultyName");
    form.reset({
      facultyName,
      building: "",
      department: "",
      section: "A",
      startTime: "09:00",
      endTime: "09:55",
      day: DayOfWeek.MONDAY,
      sessionType: "class"
    });
  };
  
  const createFacultyWithSchedule = () => {
    const facultyName = form.getValues("facultyName");
    
    if (!facultyName.trim()) {
      toast({
        title: "Error",
        description: "Faculty name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (scheduleEntries.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one session to the schedule",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Group sessions by day
      const scheduleByDay = scheduleEntries.reduce((acc, { day, session }) => {
        if (!acc[day]) {
          acc[day] = { sessions: [] };
        }
        acc[day].sessions.push(session);
        return acc;
      }, {} as Record<DayOfWeek, { sessions: ClassSession[] }>);
      
      const newFaculty = addFacultyWithCustomSchedule(facultyName, scheduleByDay);
      
      toast({
        title: "Faculty created successfully",
        description: `${newFaculty.name} (ID: ${newFaculty.id}) has been added with your custom schedule.`,
      });
      
      // Reset everything
      form.reset();
      setScheduleEntries([]);
      onComplete(newFaculty.name);
      
    } catch (error) {
      toast({
        title: "Error creating faculty",
        description: "There was a problem creating the faculty member.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const removeEntry = (index: number) => {
    const newEntries = [...scheduleEntries];
    newEntries.splice(index, 1);
    setScheduleEntries(newEntries);
    
    toast({
      title: "Session removed",
      description: "The session has been removed from the schedule",
    });
  };
  
  const getSessionTypeIcon = (sessionType: string, size = 16) => {
    switch (sessionType) {
      case "lunch":
        return <Coffee size={size} />;
      case "LAB":
        return <Briefcase size={size} />;
      case "SRP":
        return <BookOpen size={size} />;
      default:
        return <School size={size} />;
    }
  };
  
  const getDayDisplay = (day: DayOfWeek) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  return (
    <Card className="p-6 border border-faculty-accent/30 bg-white/80 backdrop-blur-sm shadow-md">
      <div className="mb-6 space-y-4">
        <h3 className="text-xl font-semibold text-faculty-primary flex items-center">
          <Calendar className="mr-2" size={20} />
          Create Custom Faculty Schedule
        </h3>
        
        <div className="p-4 bg-blue-50 rounded-lg border border-faculty-secondary/20">
          <p className="text-sm text-gray-600">
            Use this form to create a faculty member with a custom schedule. 
            First enter the faculty name, then add sessions to their weekly schedule.
          </p>
        </div>
        
        <div className="p-4 border border-dashed border-faculty-secondary/40 rounded-lg">
          <Form {...form}>
            <FormItem className="mb-4">
              <FormLabel className="text-lg text-faculty-primary font-medium">Faculty Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter faculty name" 
                  {...form.register("facultyName")}
                  className="border-faculty-secondary/30 focus:border-faculty-accent focus:ring-faculty-accent"
                />
              </FormControl>
            </FormItem>
          </Form>
        </div>
      </div>
      
      <div className="border-t border-faculty-secondary/20 pt-6 mb-6">
        <h4 className="text-lg font-semibold text-faculty-primary mb-4">Add Schedule Sessions</h4>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addSessionToSchedule)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DayOfWeek).map((day) => (
                          <SelectItem key={day} value={day}>
                            {getDayDisplay(day)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sessionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">Regular Class</SelectItem>
                        <SelectItem value="lunch">Lunch Break</SelectItem>
                        <SelectItem value="LAB">Lab Session</SelectItem>
                        <SelectItem value="SRP">Research/Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="09:00" 
                        pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                        title="Enter time in format HH:MM"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="09:55" 
                        pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                        title="Enter time in format HH:MM"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch("sessionType") !== "lunch" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select building" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BLOCK 1">Block 1</SelectItem>
                          <SelectItem value="BLOCK 2">Block 2</SelectItem>
                          <SelectItem value="BLOCK 3">Block 3</SelectItem>
                          <SelectItem value="BLOCK 4">Block 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AIML">AIML</SelectItem>
                          <SelectItem value="CSDS">CSDS</SelectItem>
                          <SelectItem value="CSBS">CSBS</SelectItem>
                          <SelectItem value="CSAI">CSAI</SelectItem>
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="ECE">ECE</SelectItem>
                          <SelectItem value="MECH">MECH</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-faculty-secondary hover:bg-faculty-secondary/80 transition-all"
            >
              <Plus size={16} className="mr-2" />
              Add Session to Schedule
            </Button>
          </form>
        </Form>
      </div>
      
      {/* Display the schedule entries */}
      <div className="border-t border-faculty-secondary/20 pt-4 mb-6">
        <h4 className="text-lg font-semibold text-faculty-primary mb-4 flex items-center">
          <Calendar size={18} className="mr-2" />
          Current Schedule ({scheduleEntries.length} sessions)
        </h4>
        
        {scheduleEntries.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
            No sessions added yet. Use the form above to add sessions.
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {Object.values(DayOfWeek).map(day => {
              const dayEntries = scheduleEntries.filter(entry => entry.day === day);
              if (dayEntries.length === 0) return null;
              
              return (
                <AccordionItem key={day} value={day}>
                  <AccordionTrigger className="hover:bg-faculty-accent/5 px-2 rounded-md">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-faculty-primary" />
                      {getDayDisplay(day)} <span className="ml-2 text-sm text-gray-500">({dayEntries.length} sessions)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2">
                      {dayEntries
                        .sort((a, b) => a.session.timeSlot.startTime.localeCompare(b.session.timeSlot.startTime))
                        .map((entry, index) => {
                          const entryIndex = scheduleEntries.findIndex(e => 
                            e.day === entry.day && 
                            e.session.timeSlot.startTime === entry.session.timeSlot.startTime &&
                            e.session.timeSlot.endTime === entry.session.timeSlot.endTime
                          );
                          
                          return (
                            <div key={`${day}-${index}`} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-full ${entry.session.isLunch ? 'bg-orange-100' : 'bg-blue-100'} mr-3`}>
                                  {getSessionTypeIcon(entry.session.isLunch ? 'lunch' : entry.session.room.department)}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {entry.session.isLunch ? 'Lunch Break' : `${entry.session.room.building}, ${entry.session.room.department} (Section ${entry.session.room.section})`}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {entry.session.timeSlot.startTime} - {entry.session.timeSlot.endTime}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeEntry(entryIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
      
      <div className="border-t border-faculty-secondary/20 pt-6">
        <Button 
          onClick={createFacultyWithSchedule}
          className="w-full md:w-auto bg-gradient-to-r from-faculty-primary to-faculty-accent hover:opacity-90 transition-all duration-300"
          disabled={isSubmitting || scheduleEntries.length === 0 || !form.getValues("facultyName")}
        >
          <UserPlus size={18} className="mr-2" />
          {isSubmitting ? "Creating Faculty..." : "Create Faculty with Custom Schedule"}
        </Button>
      </div>
    </Card>
  );
};

export default ScheduleBuilder;
