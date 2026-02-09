import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";
import React, { useState } from "react";

export interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: "all" | "completed" | "pending") => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "completed" | "pending"
  >("all");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = (filter: "all" | "completed" | "pending") => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative flex items-center">
          <Search className="absolute left-3 text-gray-400 h-5 w-5" />

            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="ml-2"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              {selectedFilter.charAt(0).toUpperCase() +
                selectedFilter.slice(1)}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterChange("all")}>
              All Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("pending")}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
