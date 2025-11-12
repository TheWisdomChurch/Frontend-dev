/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3 } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { useState, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Type definitions
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  location: string;
  description?: string;
  logo?: string;
}

interface MonthlyEvents {
  [key: number]: CalendarEvent[];
}

interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  location: string;
}

interface ReminderFormData {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  eventType: 'conference' | 'lifting';
}

const Upcoming = () => {
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
  const location = 'Honor Gardens opposite Dominion City, Alasia Bus stop';
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

  // Generate recurring monthly events with proper structure
  const generateMonthlyEvents = (year: number): MonthlyEvents => {
    const events: MonthlyEvents = {};

    // Generate events for each month (January = 0, December = 11)
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
        time: '9:00 AM ',
        type: 'Teaching Service',
        location: 'Main Sanctuary',
        description:
          'Continue your journey in wisdom. This service focuses on applying biblical principles to modern life challenges.',
        logo: '📖',
      });

      // Fourth Sunday - Supernatural Service
      const fourthSunday = new Date(thirdSunday);
      fourthSunday.setDate(thirdSunday.getDate() + 7);
      // Check if fourth Sunday is still in the same month
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
        // November 2025
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
        {
          id: '7-nights-2',
          title: '7 Nights of Lifting - Night 2',
          date: '2025-11-18',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            'Second night of spiritual elevation. Deepen your faith through powerful teachings and prayer.',
          logo: '🌟',
        },
        {
          id: '7-nights-3',
          title: '7 Nights of Lifting - Night 3',
          date: '2025-11-19',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            "Third night of transformation. Encounter God's presence in a powerful way.",
          logo: '🌟',
        },
        {
          id: '7-nights-4',
          title: '7 Nights of Lifting - Night 4',
          date: '2025-11-20',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            'Fourth night of breakthrough. Receive your miracle and experience divine healing.',
          logo: '🌟',
        },
        {
          id: '7-nights-5',
          title: '7 Nights of Lifting - Night 5',
          date: '2025-11-21',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            'Fifth night of empowerment. Be equipped for your divine purpose and calling.',
          logo: '🌟',
        },
        {
          id: '7-nights-6',
          title: '7 Nights of Lifting - Night 6',
          date: '2025-11-22',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            'Sixth night of restoration. Experience complete restoration in every area of your life.',
          logo: '🌟',
        },
        {
          id: '7-nights-7',
          title: '7 Nights of Lifting - Night 7',
          date: '2025-11-23',
          time: '6:00 PM',
          type: 'Special Event',
          location: location,
          description:
            'Grand finale night. Culmination of seven powerful nights of spiritual elevation and encounter.',
          logo: '🌟',
        },
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
        {
          id: 'supernatural-ordination',
          title: 'Supernatural & Ordination Service',
          date: '2025-11-30',
          time: '9:00 AM - 12:00 PM',
          type: 'Special Service',
          location: location,
          description:
            'Combined supernatural service and ordination ceremony for new ministers and leaders.',
          logo: '🙏',
        },
      ];

      specialEvents[11] = [
        // December 2025
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
        {
          id: 'new-year-eve',
          title: "New Year's Eve Service",
          date: '2025-12-31',
          time: '10:00 PM - 12:30 AM',
          type: 'Watch Night',
          location: location,
          description:
            'Watch night service to welcome the new year in prayer, worship, and dedication.',
          logo: '🎆',
        },
      ];
    }

    if (year === 2026) {
      specialEvents[10] = [
        // November 2026
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
        {
          id: 'conference-2026-day2',
          title: 'Wisdom Power Conference - Day 2',
          date: '2026-03-21',
          time: '6:00 PM Daily',
          type: 'Conference',
          location: location,
          description:
            'Second day of the Wisdom Power Conference. Deepen your spiritual journey.',
          logo: '🎤',
        },
        {
          id: 'conference-2026-day3',
          title: 'Wisdom Power Conference - Day 3',
          date: '2026-03-22',
          time: '6:00 PM Daily',
          type: 'Conference',
          location: location,
          description:
            'Final day of the Wisdom Power Conference. Experience the grand finale.',
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

    // Merge recurring events with special events
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

  // Properly typed events data with recurring events for all years
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

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof RegistrationFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle reminder form input changes
  const handleReminderInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReminderFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (reminderFormErrors[name as keyof ReminderFormData]) {
      setReminderFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission with Toastify
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

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the data to your backend
      console.log('Registration data:', { ...formData, eventType });

      // Show success toast
      toast.update(toastId, {
        render: `🎉 Thank you for registering for the ${eventType === 'conference' ? 'Wisdom Power Conference 2026' : '7 Nights of Lifting'}! We will contact you with more details.`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      // Close modal and reset form
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

  // Handle reminder form submission with Toastify
  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReminderForm()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSettingReminder(true);

    const toastId = toast.loading('Setting your reminder...');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Reminder data:', reminderFormData);

      // Show success toast
      toast.update(toastId, {
        render: `🔔 Reminder set! You will receive ${reminderFormData.frequency} notifications about the ${reminderFormData.eventType === 'conference' ? 'Wisdom Power Conference 2026' : '7 Nights of Lifting'}.`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      // Close modal and reset form
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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calendar section animation
      gsap.fromTo(
        calendarRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );

      // Events list animation - Fixed TypeScript error
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
  const calendarGrid = useMemo((): CalendarDate[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const grid: CalendarDate[] = [];
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

  return (
    <div className="overflow-x-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />

      <HeroSection
        title="Upcoming Events"
        subtitle="What's Happening at Wisdom House"
        description="Stay connected with all the activities, studies, and gatherings happening throughout the week. There's always something going on!"
        backgroundImage={hero_bg_2.src}
        showButtons={true}
        primaryButtonText="Download Calendar"
        secondaryButtonText="Subscribe to Updates"
        showScrollIndicator={true}
      />

      {/* Rest of the component remains the same... */}
      {/* The rest of your JSX code remains exactly the same */}

      {/* Happening This Month Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Bold Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                UPCOMING <span className="text-yellow-500">EVENTS</span>
              </h1>
              <div className="w-24 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover transformative experiences and spiritual gatherings
                designed to uplift and inspire your journey
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image Column */}
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 h-96 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                  <span className="text-white text-3xl font-bold text-center px-4 relative z-10">
                    7 Nights of Lifting
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="space-y-8">
                <H2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  7 Nights of <span className="text-yellow-500">Lifting</span>
                </H2>
                <div className="space-y-4">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Join us for seven powerful nights of worship, prayer, and
                    spiritual elevation. Each night features special guests,
                    anointed worship, and life-changing messages that will lift
                    your spirit and strengthen your faith.
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Don't miss this transformative experience where we come
                    together as a community to seek God's presence and power in
                    our lives.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={openLiftingModal}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Register to Attend
                  </button>
                  <button
                    onClick={() => openReminderModal('lifting')}
                    className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Remind Me Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Calendar Section */}
      <section ref={calendarRef} className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="mb-6 text-4xl md:text-5xl font-black">
                Event <span className="text-yellow-400">Calendar</span>
              </H2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Browse through our interactive calendar to stay updated with all
                upcoming events and gatherings
              </p>

              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-8 bg-gray-800 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateYear('prev')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">‹‹</span>
                  </button>
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">‹</span>
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setView(view === 'month' ? 'year' : 'month')}
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {view === 'month' ? 'Month View' : 'Year View'}
                  </button>
                  <h3 className="text-3xl font-black text-white">
                    {view === 'month'
                      ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                      : currentDate.getFullYear()}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">›</span>
                  </button>
                  <button
                    onClick={() => navigateYear('next')}
                    className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-2xl">››</span>
                  </button>
                </div>
              </div>

              {/* Year Selector */}
              <div className="flex justify-center gap-3 mb-8">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      currentDate.getFullYear() === year
                        ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:scale-105'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {view === 'year' ? (
              /* Year View */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {months.map((month, index) => {
                  const hasEvents =
                    monthlyEvents[index] && monthlyEvents[index].length > 0;
                  return (
                    <div
                      key={month}
                      onClick={() => selectMonth(index)}
                      className={`bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 transform hover:scale-105 ${
                        currentDate.getMonth() === index
                          ? 'border-yellow-400 bg-yellow-400 bg-opacity-10'
                          : hasEvents
                            ? 'border-green-500 hover:border-green-400 bg-green-400 bg-opacity-5'
                            : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="text-xl font-black text-white mb-3">
                        {month}
                      </h3>
                      {hasEvents ? (
                        <div className="space-y-2">
                          <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {monthlyEvents[index]!.length} event
                            {monthlyEvents[index]!.length > 1 ? 's' : ''}
                          </span>
                          <p className="text-sm text-gray-400">
                            Click to view events
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No events scheduled
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Month View */
              <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-gray-900 border-b border-gray-700">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                    day => (
                      <div
                        key={day}
                        className="p-6 text-center font-black text-gray-300 text-sm uppercase tracking-wider"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 bg-gray-700 p-2">
                  {calendarGrid.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-32 p-3 rounded-xl transition-all duration-300 ${
                        !day.isCurrentMonth
                          ? 'bg-gray-900 text-gray-600'
                          : 'bg-gray-800 hover:bg-gray-750 text-white'
                      } ${
                        day.isToday
                          ? 'bg-yellow-400 bg-opacity-20 border-2 border-yellow-400'
                          : ''
                      } ${
                        day.events.length > 0
                          ? 'cursor-pointer hover:scale-105'
                          : ''
                      }`}
                      onClick={() => handleDateClick(day.date, day.events)}
                    >
                      <div
                        className={`text-lg font-bold mb-2 ${
                          day.isToday
                            ? 'text-yellow-400'
                            : !day.isCurrentMonth
                              ? 'text-gray-600'
                              : 'text-white'
                        }`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={event.id}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs p-2 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            title={event.title}
                          >
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded text-center">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Month Events List */}
            <div
              ref={eventsRef}
              className="mt-16 bg-gray-800 rounded-3xl shadow-2xl p-10"
            >
              <H3 className="mb-8 text-3xl font-black text-center">
                Events for{' '}
                <span className="text-yellow-400">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </H3>

              {currentMonthEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {currentMonthEvents.map(event => (
                    <div
                      key={event.id}
                      className="event-card bg-gradient-to-br from-gray-750 to-gray-800 rounded-2xl p-8 border-l-4 border-yellow-400 hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {event.logo && (
                            <span className="text-2xl">{event.logo}</span>
                          )}
                          <span className="inline-block bg-yellow-400 bg-opacity-20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black border border-yellow-400 border-opacity-30">
                            {event.type}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-2xl font-black text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center">
                          <span className="font-black w-20 text-gray-400">
                            Date:
                          </span>
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-black w-20 text-gray-400">
                            Time:
                          </span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-black w-20 text-gray-400">
                            Where:
                          </span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <button className="w-full mt-6 bg-yellow-400 text-gray-900 py-4 rounded-xl font-black hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg">
                        Add to Calendar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-2xl text-gray-400 mb-4 font-bold">
                    No events scheduled for {months[currentDate.getMonth()]}{' '}
                    {currentDate.getFullYear()}
                  </p>
                  <p className="text-gray-500">
                    Check back later for updates or browse other months.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wisdom Power Conference 2026 Banner */}
      <section
        ref={conferenceRef}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full opacity-5 animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black opacity-40"></div>
          {/* Placeholder for video - replace with actual video */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-xl text-white text-opacity-80">
                Conference Highlight Video
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 border border-white border-opacity-20 shadow-2xl">
              <H2 className="mb-8 text-5xl md:text-7xl font-black leading-tight">
                WISDOM POWER <span className="text-yellow-400">CONFERENCE</span>{' '}
                2026
              </H2>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-2xl md:text-3xl mb-12 opacity-90 leading-relaxed font-light">
                The most anticipated spiritual gathering of the year is coming.
                Experience powerful teachings, anointed worship, and
                life-changing encounters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openConferenceModal}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-16 py-6 rounded-2xl font-black text-xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 shadow-2xl"
                >
                  Register for Event
                </button>
                <button
                  onClick={() => openReminderModal('conference')}
                  className="border-2 border-white text-white px-16 py-6 rounded-2xl font-bold text-xl hover:bg-white hover:bg-opacity-10 transition-all duration-500"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        ref={newsletterRef}
        className="py-24 bg-gradient-to-br from-white to-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-6 text-4xl md:text-5xl font-black text-gray-900">
              Stay <span className="text-yellow-500">Updated</span>
            </H2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get the latest news and updates about our upcoming programs and
              events delivered to your inbox
            </p>

            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-200">
              <form className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900 placeholder-gray-500 text-lg font-semibold transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  By subscribing, you agree to receive updates about our events
                  and programs. You can unsubscribe at any time. We respect your
                  privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 event-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  {selectedEvent.logo && (
                    <div className="text-4xl bg-yellow-100 p-3 rounded-xl">
                      {selectedEvent.logo}
                    </div>
                  )}
                  <div>
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-black mb-4">
                      {selectedEvent.type}
                    </span>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              {selectedEvent.description && (
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>
              )}

              <div className="space-y-4 text-gray-700 mb-8">
                <div className="flex items-center">
                  <span className="font-black w-24 text-gray-900">Date:</span>
                  <span className="text-lg">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-black w-24 text-gray-900">Time:</span>
                  <span className="text-lg">{selectedEvent.time}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-black w-24 text-gray-900">
                    Location:
                  </span>
                  <span className="text-lg">{selectedEvent.location}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-yellow-400 text-gray-900 py-4 rounded-xl font-black hover:bg-yellow-500 transition-colors duration-300 shadow-lg">
                  Add to Calendar
                </button>
                <button className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors duration-300">
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Events Modal */}
      {isDateModalOpen && dateEvents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 date-events-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {dateEvents.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                  <p className="text-gray-600">
                    {dateEvents.events.length} event
                    {dateEvents.events.length > 1 ? 's' : ''} scheduled
                  </p>
                </div>
                <button
                  onClick={closeDateModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {dateEvents.events.map(event => (
                  <div
                    key={event.id}
                    className="bg-gray-50 rounded-xl p-4 border-l-4 border-yellow-400 cursor-pointer hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => {
                      closeDateModal();
                      handleEventClick(event);
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {event.logo && (
                        <span className="text-xl">{event.logo}</span>
                      )}
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                        {event.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600">{event.time}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={scrollToEvents}
                  className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors duration-300 shadow-lg"
                >
                  View All Events
                </button>
                <button
                  onClick={closeDateModal}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conference Registration Modal */}
      {isConferenceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 conference-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">
                    Register for Wisdom Power Conference 2026
                  </h3>
                  <p className="text-gray-600">
                    Join us for this transformative spiritual gathering
                  </p>
                </div>
                <button
                  onClick={closeConferenceModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={e => handleSubmit(e, 'conference')}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.firstName
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.lastName
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.email
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.phone
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.country
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Africa</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Location/City *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.location
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your city"
                    />
                    {formErrors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> After registration, you will receive
                    a confirmation email with event details and next steps. For
                    group registrations, please contact our events team
                    directly.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Registration...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 7 Nights of Lifting Registration Modal */}
      {isLiftingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 lifting-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">
                    Register for 7 Nights of Lifting
                  </h3>
                  <p className="text-gray-600">
                    Join us for seven powerful nights of spiritual elevation
                  </p>
                </div>
                <button
                  onClick={closeLiftingModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={e => handleSubmit(e, 'lifting')}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.firstName
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.lastName
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.email
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.phone
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.country
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Africa</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Location/City *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                        formErrors.location
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-400'
                      }`}
                      placeholder="Enter your city"
                    />
                    {formErrors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This registration covers all seven
                    nights of the event. You will receive a detailed schedule
                    and preparation materials via email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0                       3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Registration...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 reminder-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Set Reminder
                  </h3>
                  <p className="text-gray-600">
                    Get notified about the{' '}
                    {reminderEventType === 'conference'
                      ? 'Wisdom Power Conference 2026'
                      : '7 Nights of Lifting'}
                  </p>
                </div>
                <button
                  onClick={closeReminderModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReminderSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={reminderFormData.email}
                    onChange={handleReminderInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${
                      reminderFormErrors.email
                        ? 'border-red-500'
                        : 'border-gray-200 focus:border-yellow-400'
                    }`}
                    placeholder="Enter your email"
                  />
                  {reminderFormErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {reminderFormErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reminder Frequency
                  </label>
                  <select
                    name="frequency"
                    value={reminderFormData.frequency}
                    onChange={handleReminderInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                  >
                    <option value="daily">Daily Updates</option>
                    <option value="weekly">Weekly Updates</option>
                    <option value="monthly">Monthly Updates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={reminderFormData.eventType}
                    onChange={handleReminderInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                  >
                    <option value="conference">
                      Wisdom Power Conference 2026
                    </option>
                    <option value="lifting">7 Nights of Lifting</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> We'll send you periodic
                    updates about the event, including important dates, speaker
                    announcements, and registration reminders.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSettingReminder}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-4 rounded-xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSettingReminder ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Setting Reminder...
                    </span>
                  ) : (
                    'Set Reminder'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upcoming;
