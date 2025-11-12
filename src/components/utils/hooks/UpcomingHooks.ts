/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useUpcomingEvents.ts
import { useState, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import {
  CalendarEvent,
  MonthlyEvents,
  RegistrationFormData,
  ReminderFormData,
} from '@/lib/types';

export const useUpcomingEvents = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'year'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateEvents, setDateEvents] = useState<{
    date: Date;
    events: CalendarEvent[];
  } | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false);
  const [isLiftingModalOpen, setIsLiftingModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderEventType, setReminderEventType] = useState<
    'conference' | 'lifting'
  >('conference');
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    location: '',
  });
  const [reminderFormData, setReminderFormData] = useState<ReminderFormData>({
    email: '',
    frequency: 'weekly',
    eventType: 'conference',
  });
  const [formErrors, setFormErrors] = useState<Partial<RegistrationFormData>>(
    {}
  );
  const [reminderFormErrors, setReminderFormErrors] = useState<
    Partial<ReminderFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  // Refs for animations
  const calendarRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const conferenceRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  const location = 'Honor Gardens opposite Dominion City, Alasia Bus stop';

  // Generate recurring monthly events
  const generateMonthlyEvents = (year: number): MonthlyEvents => {
    const events: MonthlyEvents = {};

    for (let month = 0; month < 12; month++) {
      const monthEvents: CalendarEvent[] = [];

      // Get first Sunday of the month
      const firstSunday = new Date(year, month, 1);
      while (firstSunday.getDay() !== 0) {
        firstSunday.setDate(firstSunday.getDate() + 1);
      }

      // First Sunday - Celebration & Communion Service
      monthEvents.push({
        id: `celebration-${month}-${year}`,
        title: 'Celebration & Communion Service',
        date: new Date(year, month, firstSunday.getDate())
          .toISOString()
          .split('T')[0],
        time: '9:00 AM',
        type: 'Worship Service',
        location: location,
        description:
          "Join us for our monthly celebration and communion service. Experience powerful worship, partake in holy communion, and give thanks for God's blessings.",
        logo: '🎉',
      });

      // Second Sunday - Gaining Wisdom Service
      const secondSunday = new Date(firstSunday);
      secondSunday.setDate(firstSunday.getDate() + 7);
      monthEvents.push({
        id: `wisdom1-${month}-${year}`,
        title: 'Gaining Wisdom Service',
        date: new Date(year, month, secondSunday.getDate())
          .toISOString()
          .split('T')[0],
        time: '9:00 AM',
        type: 'Teaching Service',
        location: 'Main Sanctuary',
        description:
          "Deep dive into God's word with practical wisdom for daily living. Transform your mind and spirit through biblical teachings.",
        logo: '📖',
      });

      // Third Sunday - Gaining Wisdom Service
      const thirdSunday = new Date(secondSunday);
      thirdSunday.setDate(secondSunday.getDate() + 7);
      monthEvents.push({
        id: `wisdom2-${month}-${year}`,
        title: 'Gaining Wisdom Service',
        date: new Date(year, month, thirdSunday.getDate())
          .toISOString()
          .split('T')[0],
        time: '9:00 AM',
        type: 'Teaching Service',
        location: 'Main Sanctuary',
        description:
          'Continue your journey in wisdom. This service focuses on applying biblical principles to modern life challenges.',
        logo: '📖',
      });

      // Fourth Sunday - Supernatural Service
      const fourthSunday = new Date(thirdSunday);
      fourthSunday.setDate(thirdSunday.getDate() + 7);
      if (fourthSunday.getMonth() === month) {
        monthEvents.push({
          id: `supernatural-${month}-${year}`,
          title: 'Supernatural Service',
          date: new Date(year, month, fourthSunday.getDate())
            .toISOString()
            .split('T')[0],
          time: '9:00 AM',
          type: 'Miracle Service',
          location: 'Main Sanctuary',
          description:
            'Experience the supernatural power of God. A service dedicated to miracles, healing, and divine encounters.',
          logo: '✨',
        });
      }

      // Fifth Sunday - Special Thanksgiving (if exists)
      const fifthSunday = new Date(fourthSunday);
      fifthSunday.setDate(fourthSunday.getDate() + 7);
      if (fifthSunday.getMonth() === month) {
        monthEvents.push({
          id: `thanksgiving-${month}-${year}`,
          title: 'Special Thanksgiving Service',
          date: new Date(year, month, fifthSunday.getDate())
            .toISOString()
            .split('T')[0],
          time: '9:00 AM',
          type: 'Thanksgiving Service',
          location: 'Main Sanctuary',
          description:
            "Special thanksgiving service for months with five Sundays. Join us in giving extra thanks for God's abundant blessings.",
          logo: '🙏',
        });
      }

      events[month] = monthEvents;
    }

    return events;
  };

  // Generate special events for specific years
  const generateYearlySpecialEvents = (year: number): MonthlyEvents => {
    const specialEvents: MonthlyEvents = {};

    if (year === 2025) {
      specialEvents[10] = [
        // November 2025 - 7 Nights of Lifting events
        {
          id: '7-nights-1',
          title: '7 Nights of Lifting - Night 1',
          date: '2025-11-17',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            'Opening night of our powerful 7 Nights of Lifting. Experience anointed worship and life-changing messages.',
          logo: '🌟',
        },
        // ... other 7 nights events
        {
          id: 'service-of-songs',
          title: 'Service of Songs',
          date: '2025-11-16',
          time: '5:00 PM - 7:00 PM',
          type: 'Worship Night',
          location: location,
          description:
            'A Service of powerful worship and praise. Join us as we lift up the name of Jesus through songs and hymns.',
          logo: '🎵',
        },
      ];

      specialEvents[11] = [
        // December 2025 events
        {
          id: 'christmas-service',
          title: 'Christmas Celebration Service',
          date: '2025-12-24',
          time: '6:00 PM - 9:00 PM',
          type: 'Special Event',
          location: location,
          description:
            "Christmas Eve service with candlelight, carols, and celebration of Christ's birth.",
          logo: '🎄',
        },
      ];
    }

    if (year === 2026) {
      specialEvents[2] = [
        // March 2026 - Wisdom Power Conference
        {
          id: 'conference-2026',
          title: 'Wisdom Power Conference 2026',
          date: '2026-03-20',
          time: '6:00 PM Daily',
          type: 'Conference',
          location: location,
          description:
            'Annual Wisdom Power Conference. Three days of powerful teachings, worship, and spiritual encounters.',
          logo: '🎤',
        },
      ];
    }

    return specialEvents;
  };

  // Combine recurring and special events
  const getMonthlyEventsForYear = (year: number): MonthlyEvents => {
    const recurringEvents = generateMonthlyEvents(year);
    const specialEvents = generateYearlySpecialEvents(year);

    const combinedEvents: MonthlyEvents = { ...recurringEvents };

    Object.keys(specialEvents).forEach(month => {
      const monthNum = parseInt(month);
      if (combinedEvents[monthNum]) {
        combinedEvents[monthNum] = [
          ...combinedEvents[monthNum],
          ...specialEvents[monthNum],
        ];
      } else {
        combinedEvents[monthNum] = specialEvents[monthNum];
      }
    });

    return combinedEvents;
  };

  // Properly typed events data
  const monthlyEvents: MonthlyEvents = useMemo(() => {
    return getMonthlyEventsForYear(currentDate.getFullYear());
  }, [currentDate.getFullYear()]);

  const months = [
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

  const years = [2025, 2026, 2027];

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<RegistrationFormData> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.location.trim()) errors.location = 'Location is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reminder form validation
  const validateReminderForm = (): boolean => {
    const errors: Partial<ReminderFormData> = {};

    if (!reminderFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reminderFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setReminderFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof RegistrationFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle reminder form input changes
  const handleReminderInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReminderFormData(prev => ({ ...prev, [name]: value }));

    if (reminderFormErrors[name as keyof ReminderFormData]) {
      setReminderFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent,
    eventType: 'conference' | 'lifting'
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Processing your registration...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', { ...formData, eventType });

      toast.update(toastId, {
        render: `🎉 Thank you for registering for the ${eventType === 'conference' ? 'Wisdom Power Conference 2026' : '7 Nights of Lifting'}! We will contact you with more details.`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      if (eventType === 'conference') {
        closeConferenceModal();
      } else {
        closeLiftingModal();
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        location: '',
      });
    } catch (error) {
      toast.update(toastId, {
        render:
          '❌ There was an error processing your registration. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reminder form submission
  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReminderForm()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSettingReminder(true);
    const toastId = toast.loading('Setting your reminder...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Reminder data:', reminderFormData);

      toast.update(toastId, {
        render: `🔔 Reminder set! You will receive ${reminderFormData.frequency} notifications about the ${reminderFormData.eventType === 'conference' ? 'Wisdom Power Conference 2026' : '7 Nights of Lifting'}.`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      closeReminderModal();
      setReminderFormData({
        email: '',
        frequency: 'weekly',
        eventType: 'conference',
      });
    } catch (error) {
      toast.update(toastId, {
        render:
          '❌ There was an error setting your reminder. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally {
      setIsSettingReminder(false);
    }
  };

  // Modal handlers
  const openConferenceModal = () => {
    setIsConferenceModalOpen(true);
    gsap.fromTo(
      '.conference-modal',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const closeConferenceModal = () => {
    gsap.to('.conference-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsConferenceModalOpen(false);
        setFormErrors({});
      },
    });
  };

  const openLiftingModal = () => {
    setIsLiftingModalOpen(true);
    gsap.fromTo(
      '.lifting-modal',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const closeLiftingModal = () => {
    gsap.to('.lifting-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsLiftingModalOpen(false);
        setFormErrors({});
      },
    });
  };

  const openReminderModal = (eventType: 'conference' | 'lifting') => {
    setReminderEventType(eventType);
    setReminderFormData(prev => ({ ...prev, eventType }));
    setIsReminderModalOpen(true);
    gsap.fromTo(
      '.reminder-modal',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const closeReminderModal = () => {
    gsap.to('.reminder-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsReminderModalOpen(false);
        setReminderFormErrors({});
      },
    });
  };

  // Event modal handler
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    gsap.fromTo(
      '.event-modal',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  // Date events modal handler
  const handleDateClick = (date: Date, events: CalendarEvent[]) => {
    if (events.length > 0) {
      setDateEvents({ date, events });
      setIsDateModalOpen(true);
      gsap.fromTo(
        '.date-events-modal',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  };

  const closeModal = () => {
    gsap.to('.event-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
      },
    });
  };

  const closeDateModal = () => {
    gsap.to('.date-events-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsDateModalOpen(false);
        setDateEvents(null);
      },
    });
  };

  // Scroll to events section
  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
    closeDateModal();
  };

  // Get events for specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    const monthEvents = monthlyEvents[month] || [];
    return monthEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  // Generate calendar grid for month view
  const calendarGrid = useMemo((): {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const grid: {
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
    }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      grid.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        events: getEventsForDate(current),
      });
      current.setDate(current.getDate() + 1);
    }

    return grid;
  }, [currentDate, monthlyEvents]);

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    gsap.to(calendarRef.current, {
      opacity: 0,
      x: direction === 'next' ? -50 : 50,
      duration: 0.3,
      onComplete: () => {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
          return newDate;
        });
        gsap.fromTo(
          calendarRef.current,
          { opacity: 0, x: direction === 'next' ? 50 : -50 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      },
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setView('month');
  };

  const selectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  // Get all events for current month
  const currentMonthEvents = useMemo((): CalendarEvent[] => {
    const month = currentDate.getMonth();
    return monthlyEvents[month] || [];
  }, [currentDate, monthlyEvents]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calendar section animation
      gsap.fromTo(
        calendarRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );

      // Events list animation
      const eventCards = eventsRef.current?.querySelectorAll('.event-card');
      if (eventCards) {
        gsap.fromTo(
          eventCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: eventsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Conference section animation
      gsap.fromTo(
        conferenceRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: conferenceRef.current,
            start: 'top 80%',
          },
        }
      );

      // Newsletter animation
      gsap.fromTo(
        newsletterRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return {
    // State
    currentDate,
    view,
    selectedEvent,
    isModalOpen,
    dateEvents,
    isDateModalOpen,
    isConferenceModalOpen,
    isLiftingModalOpen,
    isReminderModalOpen,
    reminderEventType,
    formData,
    reminderFormData,
    formErrors,
    reminderFormErrors,
    isSubmitting,
    isSettingReminder,

    // Refs
    calendarRef,
    eventsRef,
    conferenceRef,
    newsletterRef,

    // Data
    monthlyEvents,
    months,
    years,
    location,
    calendarGrid,
    currentMonthEvents,

    // Handlers
    setView,
    handleInputChange,
    handleReminderInputChange,
    handleSubmit,
    handleReminderSubmit,
    handleEventClick,
    handleDateClick,
    openConferenceModal,
    closeConferenceModal,
    openLiftingModal,
    closeLiftingModal,
    openReminderModal,
    closeReminderModal,
    closeModal,
    closeDateModal,
    scrollToEvents,
    navigateMonth,
    navigateYear,
    selectMonth,
    selectYear,
  };
};
