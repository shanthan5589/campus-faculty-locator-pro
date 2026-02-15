
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserPlus, Calendar, WandSparkles, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { addFacultyMember } from "@/utils/facultyData";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ScheduleBuilder from "@/components/ScheduleBuilder";

interface AddFacultyFormProps {
  onFacultyAdded: (facultyName: string) => void;
}

interface FormValues {
  facultyName: string;
}

const AddFacultyForm: React.FC<AddFacultyFormProps> = ({ onFacultyAdded }) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [scheduleType, setScheduleType] = useState<"auto" | "manual">("auto");
  
  const form = useForm<FormValues>({
    defaultValues: {
      facultyName: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.facultyName.trim().length === 0) {
      toast({
        title: "Error",
        description: "Faculty name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAdding(true);
      
      if (scheduleType === "auto") {
        // Use the existing generate function
        const newFaculty = addFacultyMember(data.facultyName.trim());
        toast({
          title: "Faculty added successfully",
          description: `${newFaculty.name} (ID: ${newFaculty.id}) has been added with a generated schedule.`,
        });
        form.reset();
        onFacultyAdded(newFaculty.name);
      } else {
        // For manual schedule, we'll show a message to complete the schedule in the next step
        toast({
          title: "Creating faculty member",
          description: "Complete the schedule using the schedule builder below",
        });
        // The actual creation happens in the ScheduleBuilder component
      }
      
      setIsAdding(false);
    } catch (error) {
      setIsAdding(false);
      toast({
        title: "Error adding faculty",
        description: "There was a problem adding the faculty member.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Tabs defaultValue="auto" className="w-full" onValueChange={(value) => setScheduleType(value as "auto" | "manual")}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <WandSparkles size={18} />
            Auto-Generate Schedule
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Calendar size={18} />
            Create Custom Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto">
          <Card className="p-6 border border-faculty-accent/30 bg-white/80 backdrop-blur-sm shadow-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="facultyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-faculty-primary font-medium">Faculty Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter new faculty name" 
                          {...field} 
                          className="border-faculty-secondary/30 focus:border-faculty-accent focus:ring-faculty-accent"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-faculty-primary to-faculty-accent hover:opacity-90 transition-all duration-300"
                  disabled={isAdding}
                >
                  <WandSparkles size={18} className="mr-2 animate-pulse-slow" />
                  {isAdding ? "Adding Faculty..." : "Add Faculty with Generated Schedule"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-faculty-secondary/20">
              <h4 className="font-medium text-faculty-primary flex items-center mb-2">
                <Sparkles size={16} className="mr-2 text-faculty-accent" />
                Auto-Generate Feature
              </h4>
              <p className="text-sm text-gray-600">
                This option will automatically generate a complete weekly schedule for the faculty member,
                including class sessions, lunch breaks, and special activities based on common academic patterns.
              </p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual">
          <ScheduleBuilder onComplete={onFacultyAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddFacultyForm;
