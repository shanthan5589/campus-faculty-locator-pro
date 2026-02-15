
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, User } from "lucide-react";
import { getAllFacultyNames } from "@/utils/facultyData";
import { Card } from "./ui/card";
import { Command } from "./ui/command";

interface FacultySearchProps {
  onSearch: (facultyName: string) => void;
}

const FacultySearch: React.FC<FacultySearchProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [showPredictions, setShowPredictions] = useState(false);
  const facultyNames = getAllFacultyNames();
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter faculty names based on search input (after 2+ characters)
    if (searchValue.length >= 2) {
      const filtered = facultyNames.filter(name => 
        name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredNames(filtered);
      setShowPredictions(filtered.length > 0);
    } else {
      setShowPredictions(false);
    }

    // Add click outside listener to close predictions
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchValue, facultyNames]);

  const handleInputSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setShowPredictions(false);
    }
  };

  const handlePredictionClick = (name: string) => {
    setSearchValue(name);
    onSearch(name);
    setShowPredictions(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-faculty-primary/10 to-faculty-accent/10 backdrop-blur-sm shadow-lg border border-faculty-accent/20 animate-fade-in">
      <h2 className="text-2xl font-bold text-faculty-primary mb-5 flex items-center">
        <Search className="mr-2" size={24} />
        Find Faculty
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="relative" ref={searchRef}>
          <form onSubmit={handleInputSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by faculty name or ID..."
                className="pl-10 border-faculty-secondary/30 focus:border-faculty-accent focus:ring-faculty-accent transition-all duration-300"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-faculty-secondary" 
                size={16} 
              />
              <Button 
                type="submit" 
                className="absolute right-0 top-0 h-full bg-faculty-primary hover:bg-faculty-accent transition-all duration-300 group flex items-center"
              >
                <Search size={16} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Search
              </Button>
            </div>
          </form>
          
          {/* Predictive Search Results */}
          {showPredictions && (
            <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto animate-fade-in">
              <Command>
                <div className="p-2">
                  {filteredNames.map((name) => (
                    <div 
                      key={name} 
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => handlePredictionClick(name)}
                    >
                      <User className="mr-2 h-4 w-4 text-faculty-secondary" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </Command>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FacultySearch;
