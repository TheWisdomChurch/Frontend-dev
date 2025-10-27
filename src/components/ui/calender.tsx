'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '../utils';

export interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  showOutsideDays?: boolean;
  disabled?: (date: Date) => boolean;
}

function Calendar({
  className,
  selected,
  onSelect,
  month = new Date(),
  onMonthChange,
  showOutsideDays = true,
  disabled,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(month);

  React.useEffect(() => {
    setCurrentMonth(month);
  }, [month]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(
      currentMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return disabled?.(date) || false;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onSelect?.(selectedDate);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('p-3', className)} {...props}>
      <div className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <div className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <div className="absolute left-1 right-1 flex justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full space-y-1">
          {/* Week days header */}
          <div className="flex">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex flex-col space-y-2">
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <div key={weekIndex} className="flex w-full">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayNumber = weekIndex * 7 + dayIndex - firstDay + 1;
                  const isOutsideMonth =
                    dayNumber < 1 || dayNumber > daysInMonth;

                  if (isOutsideMonth && !showOutsideDays) {
                    return <div key={dayIndex} className="h-9 w-9" />;
                  }

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        'h-9 w-9 text-center text-sm p-0 relative',
                        isSelected(dayNumber) &&
                          'bg-primary text-primary-foreground first:rounded-l-md last:rounded-r-md',
                        isToday(dayNumber) &&
                          !isSelected(dayNumber) &&
                          'bg-accent text-accent-foreground'
                      )}
                    >
                      {!isOutsideMonth ? (
                        <button
                          type="button"
                          className={cn(
                            'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md',
                            isSelected(dayNumber) &&
                              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                            isToday(dayNumber) &&
                              !isSelected(dayNumber) &&
                              'bg-accent text-accent-foreground',
                            isDisabled(dayNumber) &&
                              'text-muted-foreground opacity-50 cursor-not-allowed'
                          )}
                          onClick={() =>
                            !isDisabled(dayNumber) &&
                            handleDateSelect(dayNumber)
                          }
                          disabled={isDisabled(dayNumber)}
                        >
                          {dayNumber}
                        </button>
                      ) : showOutsideDays ? (
                        <span className="text-muted-foreground opacity-50">
                          {dayNumber < 1
                            ? getDaysInMonth(
                                new Date(
                                  currentMonth.getFullYear(),
                                  currentMonth.getMonth() - 1,
                                  1
                                )
                              ) + dayNumber
                            : dayNumber - daysInMonth}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
