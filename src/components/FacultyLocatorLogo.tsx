
import React from 'react';
import { School, MapPin, GraduationCap, Sparkles } from 'lucide-react';

const FacultyLocatorLogo = () => {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 mb-6">
        {/* Main circular background */}
        <div className="absolute inset-0 bg-gradient-to-br from-faculty-primary to-faculty-accent rounded-full shadow-xl flex items-center justify-center animate-pulse-slow">
          {/* Inner circle */}
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Campus building icon */}
            <School className="w-16 h-16 text-faculty-primary animate-bounce-slow" />
            
            {/* Decorative elements */}
            <GraduationCap className="absolute top-4 left-4 w-6 h-6 text-faculty-secondary" />
            <MapPin className="absolute bottom-4 right-4 w-6 h-6 text-faculty-accent" />
            <Sparkles className="absolute bottom-3 left-3 w-5 h-5 text-yellow-400 animate-spin-slow" />
          </div>
        </div>
        
        {/* Orbiting pin */}
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '8s' }}>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="bg-faculty-accent p-2 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-faculty-primary text-center mb-1 flex items-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-faculty-primary to-faculty-accent">Faculty Locator</span>
        <Sparkles className="ml-2 text-yellow-400 animate-pulse" size={20} />
      </h2>
      
      <div className="text-lg text-faculty-secondary font-medium">
        <span className="animate-pulse">Find Faculty • Track Schedules • Navigate Campus</span>
      </div>
    </div>
  );
};

export default FacultyLocatorLogo;
