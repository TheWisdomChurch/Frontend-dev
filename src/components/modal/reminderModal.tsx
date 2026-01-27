'use client';

import { BaseModal } from './Base';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

interface ReminderModalProps {
  event: {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    location?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSetReminder: (data: { email: string; frequency: string }) => Promise<void>;
  isLoading?: boolean;
}

export const ReminderModal = ({
  event,
  isOpen,
  onClose,
  onSetReminder,
  isLoading = false,
}: ReminderModalProps) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  const isProcessing = isLoading || isSubmitting;

  const eventDate = format(new Date(event.start_date), 'MMMM dd, yyyy');
  const timeUntil = formatDistanceToNow(new Date(event.start_date), { addSuffix: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      emailInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSetReminder({ email, frequency });
      toast.success(`Reminder set for ${event.title}!`);
      setEmail('');
      onClose();
    } catch (error) {
      toast.error('Failed to set reminder');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Reminder"
      subtitle={`Get notified about ${event.title}`}
      isLoading={isProcessing}
      loadingText="Setting reminder..."
      initialFocusRef={emailInputRef as React.RefObject<HTMLElement>}
      preventClose={isProcessing}
    >
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{eventDate}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Starts {timeUntil}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={emailInputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isProcessing}
        />
        
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isProcessing}
        >
          <option value="daily">Daily Updates</option>
          <option value="weekly">Weekly Updates</option>
          <option value="monthly">Monthly Updates</option>
        </select>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Setting Reminder...
            </>
          ) : (
            'Set Reminder'
          )}
        </button>
      </form>
    </BaseModal>
  );
};