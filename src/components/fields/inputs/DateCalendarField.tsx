import React, { useState, useEffect } from "react";
import { format, isValid, parse, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface DateCalendarFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  allowMultipleSelection?: boolean;
  allowRangeSelection?: boolean;
  showButtonBar?: boolean;
  includeTimePicker?: boolean;
  monthPickerOnly?: boolean;
  yearPickerOnly?: boolean;
  showMultipleMonths?: boolean;
  inlineMode?: boolean;
  filledStyle?: boolean;
  floatingLabel?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  helpText?: string;
}

export function DateCalendarField({
  value,
  onChange,
  dateFormat = "yyyy-MM-dd",
  locale,
  minDate,
  maxDate,
  allowMultipleSelection = false,
  allowRangeSelection = false,
  showButtonBar = false,
  includeTimePicker = false,
  monthPickerOnly = false,
  yearPickerOnly = false,
  showMultipleMonths = false,
  inlineMode = false,
  filledStyle = false,
  floatingLabel = false,
  invalid = false,
  disabled = false,
  required = false,
  label,
  placeholder = "Select date",
  id,
  name,
  className,
  helpText,
}: DateCalendarFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, dateFormat));
    } else {
      setInputValue("");
    }
  }, [value, dateFormat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    
    if (newInputValue === "") {
      onChange(null);
      return;
    }
    
    const parsedDate = parse(newInputValue, dateFormat, new Date());
    
    if (isValid(parsedDate)) {
      const isInRange = isDateInRange(parsedDate);
      if (isInRange) {
        onChange(parsedDate);
      }
    }
  };

  const isDateInRange = (date: Date): boolean => {
    if (minDate && maxDate) {
      return isWithinInterval(date, { start: minDate, end: maxDate });
    }
    if (minDate) {
      return date >= minDate;
    }
    if (maxDate) {
      return date <= maxDate;
    }
    return true;
  };

  const handleCalendarSelect = (date: Date | null) => {
    if (date) {
      setInputValue(format(date, dateFormat));
    } else {
      setInputValue("");
    }
    
    onChange(date);
    
    if (!inlineMode && !allowMultipleSelection && !allowRangeSelection) {
      setIsOpen(false);
    }
  };

  const handleRangeSelect = (range: { from: Date; to: Date | undefined }) => {
    setDateRange(range);
    
    if (range.from && range.to) {
      const formattedRange = `${format(range.from, dateFormat)} - ${format(range.to, dateFormat)}`;
      setInputValue(formattedRange);
      
      onChange(range.from);
      
      if (!inlineMode) {
        setIsOpen(false);
      }
    }
  };

  const handleMultipleSelect = (dates: Date[]) => {
    setSelectedDates(dates);
    
    if (dates.length > 0) {
      const formattedDates = dates.map(d => format(d, dateFormat)).join(", ");
      setInputValue(formattedDates);
      
      onChange(dates[0]);
    } else {
      setInputValue("");
      onChange(null);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onChange(null);
    setDateRange({ from: undefined, to: undefined });
    setSelectedDates([]);
  };

  const handleToday = () => {
    const today = new Date();
    if (isDateInRange(today)) {
      onChange(today);
      setInputValue(format(today, dateFormat));
    }
  };

  const inputClasses = cn(
    filledStyle ? "bg-gray-100" : "bg-white",
    invalid ? "border-red-500" : "border-gray-300",
    isFocused && !invalid ? "ring-2 ring-blue-500 border-blue-500" : "",
    disabled ? "opacity-60 cursor-not-allowed" : ""
  );

  const renderCalendarContent = () => {
    if (yearPickerOnly) {
      return null;
    }

    if (monthPickerOnly) {
      return null;
    }

    if (allowRangeSelection) {
      return (
        <>
          <div className={showMultipleMonths ? "flex" : ""}>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleRangeSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
            
            {showMultipleMonths && (
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
                month={
                  value 
                    ? new Date(value.getFullYear(), value.getMonth() + 1) 
                    : new Date(new Date().getFullYear(), new Date().getMonth() + 1)
                }
                className={cn("p-3 pointer-events-auto")}
              />
            )}
          </div>
          
          {includeTimePicker && value && (
            <div className="p-3 border-t">
              <div className="flex justify-between items-center">
                <Label htmlFor="time-input">Time</Label>
                <Input
                  id="time-input"
                  type="time"
                  className="w-32"
                  value={value ? format(value, "HH:mm") : ""}
                  onChange={(e) => {
                    if (!value) return;
                    
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = new Date(value);
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    onChange(newDate);
                  }}
                />
              </div>
            </div>
          )}
          
          {showButtonBar && (
            <div className="p-3 border-t flex justify-between">
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}
        </>
      );
    } else if (allowMultipleSelection) {
      return (
        <>
          <div className={showMultipleMonths ? "flex" : ""}>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={handleMultipleSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
            
            {showMultipleMonths && (
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleMultipleSelect}
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
                month={
                  value 
                    ? new Date(value.getFullYear(), value.getMonth() + 1) 
                    : new Date(new Date().getFullYear(), new Date().getMonth() + 1)
                }
                className={cn("p-3 pointer-events-auto")}
              />
            )}
          </div>
          
          {includeTimePicker && value && (
            <div className="p-3 border-t">
              <div className="flex justify-between items-center">
                <Label htmlFor="time-input">Time</Label>
                <Input
                  id="time-input"
                  type="time"
                  className="w-32"
                  value={value ? format(value, "HH:mm") : ""}
                  onChange={(e) => {
                    if (!value) return;
                    
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = new Date(value);
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    onChange(newDate);
                  }}
                />
              </div>
            </div>
          )}
          
          {showButtonBar && (
            <div className="p-3 border-t flex justify-between">
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          <div className={showMultipleMonths ? "flex" : ""}>
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
            
            {showMultipleMonths && (
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleCalendarSelect}
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
                month={
                  value 
                    ? new Date(value.getFullYear(), value.getMonth() + 1) 
                    : new Date(new Date().getFullYear(), new Date().getMonth() + 1)
                }
                className={cn("p-3 pointer-events-auto")}
              />
            )}
          </div>
          
          {includeTimePicker && value && (
            <div className="p-3 border-t">
              <div className="flex justify-between items-center">
                <Label htmlFor="time-input">Time</Label>
                <Input
                  id="time-input"
                  type="time"
                  className="w-32"
                  value={value ? format(value, "HH:mm") : ""}
                  onChange={(e) => {
                    if (!value) return;
                    
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = new Date(value);
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    onChange(newDate);
                  }}
                />
              </div>
            </div>
          )}
          
          {showButtonBar && (
            <div className="p-3 border-t flex justify-between">
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {label && !floatingLabel && (
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : "",
            invalid ? "text-red-500" : ""
          )}
        >
          {label}
        </Label>
      )}
      
      {inlineMode ? (
        <div className="border rounded-md shadow-sm">
          {renderCalendarContent()}
        </div>
      ) : (
        <div className="relative">
          {floatingLabel && (
            <Label
              htmlFor={id}
              className={cn(
                "absolute text-xs transition-all duration-200 pointer-events-none",
                isFocused || inputValue
                  ? "-top-2 left-2 px-1 bg-white text-blue-500 text-xs z-10"
                  : "top-2.5 left-3 text-gray-500",
                required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : "",
                invalid ? "text-red-500" : ""
              )}
            >
              {label}
            </Label>
          )}
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id={id}
                  name={name}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(
                    inputClasses,
                    "pr-10"
                  )}
                  aria-invalid={invalid}
                  aria-required={required}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-2"
                  onClick={() => setIsOpen(!isOpen)}
                  tabIndex={-1}
                  disabled={disabled}
                >
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {renderCalendarContent()}
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {helpText && !invalid && (
        <p className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      
      {invalid && (
        <p className="text-xs text-red-500 mt-1">
          Please enter a valid date in the format {dateFormat}.
        </p>
      )}
    </div>
  );
}

export type DateCalendarFieldWithHelpText = DateCalendarFieldProps & {
  helpText?: string;
};
