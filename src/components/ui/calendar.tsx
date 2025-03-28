
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addMonths } from "date-fns";
import { enUS, es, fr, de } from 'date-fns/locale';

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const locales = { enUS, es, fr, de };
type LocaleKey = keyof typeof locales;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

// Full Calendar Demo component with all requested features
function CalendarDemo() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [locale, setLocale] = React.useState<LocaleKey>("enUS");
  const [showTime, setShowTime] = React.useState(false);
  const [time, setTime] = React.useState("12:00");
  const [dateFormat, setDateFormat] = React.useState("PP");

  // For time picker to be combined with date
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  // Custom date footer with Today and Clear buttons
  const Footer = () => {
    const { goToMonth } = useNavigation();
  
    return (
      <div className="p-2 border-t border-muted flex justify-between items-center">
        <button 
          onClick={() => {
            const today = new Date();
            setSelectedDate(today);
            goToMonth(today);
          }} 
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Today
        </button>
        <button 
          onClick={() => {
            setSelectedDate(undefined);
            setSelectedDates([]);
            setDateRange({ from: undefined, to: undefined });
          }} 
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Clear
        </button>
      </div>
    );
  };

  // Custom date cell rendering
  const renderCustomDay = (day: Date, selected: boolean) => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    return (
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md p-0",
        selected && "bg-primary text-primary-foreground font-medium",
        isWeekend && !selected && "text-red-500"
      )}>
        <time dateTime={format(day, "yyyy-MM-dd")}>
          {format(day, "d")}
        </time>
      </div>
    );
  };

  // Fixed handle range selection
  const handleRangeSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };

  // Import navigation from react-day-picker
  const { useNavigation } = require('react-day-picker');

  return (
    <div className="space-y-8">
      {/* Basic Calendar */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">1. Basic Calendar</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
        />
        {selectedDate && (
          <p className="mt-2 text-sm">Selected: {format(selectedDate, "PPP")}</p>
        )}
      </section>

      {/* Date Format Control */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">2. Date Format Control</h2>
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setDateFormat("PP")} 
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              dateFormat === "PP" && "bg-primary text-primary-foreground"
            )}
          >
            Default (PP)
          </button>
          <button 
            onClick={() => setDateFormat("MM/dd/yyyy")} 
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              dateFormat === "MM/dd/yyyy" && "bg-primary text-primary-foreground"
            )}
          >
            MM/dd/yyyy
          </button>
          <button 
            onClick={() => setDateFormat("dd-MM-yyyy")} 
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              dateFormat === "dd-MM-yyyy" && "bg-primary text-primary-foreground"
            )}
          >
            dd-MM-yyyy
          </button>
          <button 
            onClick={() => setDateFormat("yyyy/MM/dd")} 
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              dateFormat === "yyyy/MM/dd" && "bg-primary text-primary-foreground"
            )}
          >
            yyyy/MM/dd
          </button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
        />
        {selectedDate && (
          <p className="mt-2 text-sm">Selected: {format(selectedDate, dateFormat)}</p>
        )}
      </section>

      {/* Locale Support */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">3. Locale Support</h2>
        <div className="flex gap-4 mb-4">
          {Object.keys(locales).map((loc) => (
            <button 
              key={loc} 
              onClick={() => setLocale(loc as LocaleKey)} 
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                locale === loc && "bg-primary text-primary-foreground"
              )}
            >
              {loc}
            </button>
          ))}
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          locale={locales[locale]}
        />
      </section>

      {/* Min and Max Date */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">5. Min and Max Date</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => 
            date < new Date(new Date().setDate(new Date().getDate() - 7)) || 
            date > new Date(new Date().setDate(new Date().getDate() + 30))
          }
          className="border rounded-md"
          defaultMonth={new Date()}
          footer={<p className="text-xs text-center text-muted-foreground">Only dates within 7 days in the past and 30 days in the future are selectable.</p>}
        />
      </section>

      {/* Multiple Dates Selection */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">6. Multiple Dates Selection</h2>
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={setSelectedDates}
          className="border rounded-md"
          numberOfMonths={1}
        />
        {selectedDates.length > 0 && (
          <p className="mt-2 text-sm">
            Selected {selectedDates.length} date(s): {selectedDates.map(date => format(date, "MMM d")).join(", ")}
          </p>
        )}
      </section>

      {/* Range Selection */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">7. Range Selection</h2>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleRangeSelect}
          className="border rounded-md"
          numberOfMonths={1}
        />
        {dateRange.from && (
          <p className="mt-2 text-sm">
            Range: {format(dateRange.from, "PPP")} 
            {dateRange.to ? ` to ${format(dateRange.to, "PPP")}` : ""}
          </p>
        )}
      </section>

      {/* Button Bar */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">8. Button Bar</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          footer={<Footer />}
        />
      </section>

      {/* Time Picker */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">9. Time Picker</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="show-time" 
              checked={showTime}
              onChange={(e) => setShowTime(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="show-time">Include time selection</label>
          </div>
          {showTime && (
            <input 
              type="time" 
              value={time}
              onChange={handleTimeChange}
              className="border rounded-md px-3 py-2 w-40"
            />
          )}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md"
          />
          {selectedDate && (
            <p className="mt-2 text-sm">
              Selected: {format(selectedDate, "PPP")}
              {showTime && ` at ${time}`}
            </p>
          )}
        </div>
      </section>

      {/* Month Picker */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">10. Month Picker</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={2025}
        />
        {selectedDate && (
          <p className="mt-2 text-sm">Selected: {format(selectedDate, "MMMM yyyy")}</p>
        )}
      </section>

      {/* Year Picker */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">11. Year Picker</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={2025}
        />
        {selectedDate && (
          <p className="mt-2 text-sm">Selected: {format(selectedDate, "yyyy")}</p>
        )}
      </section>

      {/* Multiple Months View */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">12. Multiple Months View</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          numberOfMonths={2}
        />
      </section>

      {/* Date Template Customization */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">13. Date Template Customization</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          modifiers={{
            weekend: (date) => date.getDay() === 0 || date.getDay() === 6,
          }}
          modifiersStyles={{
            weekend: { color: "red" }
          }}
        />
      </section>

      {/* Inline Mode */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">15. Inline Mode</h2>
        <div className="border rounded-md p-4 bg-background">
          <h3 className="text-sm font-medium mb-2">Always visible calendar</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mx-auto"
            showOutsideDays={false}
          />
        </div>
      </section>

      {/* Invalid State */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">18. Invalid State</h2>
        <div className="space-y-2">
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={setSelectedDate}
            className="border border-red-500 rounded-md"
            initialFocus
          />
          <p className="text-sm text-red-500">Please select a date</p>
        </div>
      </section>

      {/* Disabled State */}
      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-4">19. Disabled State</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md opacity-50 pointer-events-none"
          disabled
        />
      </section>
    </div>
  );
}

export { Calendar, CalendarDemo };
