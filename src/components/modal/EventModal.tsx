'use client';

import { BaseModal } from './Base';
import { Calendar, Clock, MapPin, Share2, CalendarPlus, Check, Loader2 } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

interface EventDetailsModalProps {
  event: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date?: string;
    time: string;
    location: string;
    type: string;
    image_url?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onRegister?: () => Promise<void>; // Made async
  isLoading?: boolean;
}

export const EventDetailsModal = ({
  event,
  isOpen,
  onClose,
  onRegister,
  isLoading = false,
}: EventDetailsModalProps) => {
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const registerButtonRef = useRef<HTMLButtonElement>(null);
  
  const formattedDate = format(new Date(event.start_date), 'EEEE, MMMM dd, yyyy');
  
  const parseTime = (timeString: string): { hours: number; minutes: number } => {
    const match = timeString.match(/(\d{1,2}):(\d{2})\s?(am|pm)?/i);
    if (!match) return { hours: 9, minutes: 0 };
    
    let [_, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    if (period?.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (period?.toLowerCase() === 'am' && hour === 12) hour = 0;
    
    return { hours: hour, minutes: minute };
  };
  
  const createEventDates = () => {
    const startDate = new Date(event.start_date);
    const { hours, minutes } = parseTime(event.time);
    
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = event.end_date 
      ? new Date(event.end_date)
      : addHours(startDate, 2);
    
    return { startDate, endDate };
  };

  const handleAddToCalendar = async () => {
    try {
      setIsAddingToCalendar(true);
      const { startDate, endDate } = createEventDates();
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
      };
      
      const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'PRODID:-//Church Events//EN',
        'BEGIN:VEVENT',
        `UID:${event.id}@${window.location.hostname}`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description || 'Church Event'}`,
        `LOCATION:${event.location}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${event.title}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');
      
      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${event.title.replace(/\s+/g, '-')}.ics`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      setAddedToCalendar(true);
      toast.success('Calendar event downloaded! Open the .ics file to add to your calendar.');
      
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      toast.error('Failed to create calendar event');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const shareData = {
        title: event.title,
        text: `${event.title}\n📅 ${formattedDate} at ${event.time}\n📍 ${event.location}\n\n${event.description || ''}`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Event shared!');
      } else {
        const text = `${event.title}\n📅 ${formattedDate} at ${event.time}\n📍 ${event.location}`;
        await navigator.clipboard.writeText(text);
        toast.success('Event details copied to clipboard!');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const text = `${event.title}\n📅 ${formattedDate} at ${event.time}\n📍 ${event.location}`;
        alert(`Share this event:\n\n${text}`);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleRegister = async () => {
    if (!onRegister) return;
    
    try {
      setIsRegistering(true);
      await onRegister();
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      subtitle={event.type}
      maxWidth="max-w-md"
      isLoading={isLoading}
      initialFocusRef={onRegister ? (registerButtonRef as React.RefObject<HTMLElement>) : undefined}
    >
      {/* Event Image */}
      {event.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-40 sm:h-44 md:h-48 object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{event.location}</span>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">About This Event</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {event.description}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Register Button (if provided) */}
        {onRegister && (
          <button
            ref={registerButtonRef}
            onClick={handleRegister}
            disabled={isRegistering || isLoading}
            className="w-full py-3 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Registering...
              </>
            ) : (
              'Register Now'
            )}
          </button>
        )}
        
        {/* Calendar & Share Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCalendar}
            disabled={isAddingToCalendar || isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Calendar"
          >
            {isAddingToCalendar ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : addedToCalendar ? (
              <>
                <Check className="w-5 h-5" />
                <span className="font-medium">Added!</span>
              </>
            ) : (
              <>
                <CalendarPlus className="w-5 h-5" />
                <span className="font-medium">Add to Calendar</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            disabled={isSharing || isLoading}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share Event"
          >
            {isSharing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center mt-2">
          The .ics file works with Apple Calendar, Google Calendar, Outlook, and most calendar apps
        </p>
      </div>
    </BaseModal>
  );
};
