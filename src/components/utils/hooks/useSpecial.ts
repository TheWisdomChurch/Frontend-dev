// hooks/useSpecialEvents.ts
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NL } from '@/components/assets';

gsap.registerPlugin(ScrollTrigger);

export interface SpecialEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  type: 'service' | 'conference' | 'celebration' | 'outreach';
  image: string;
  featured?: boolean;
  registrationLink?: string;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  location: string;
  eventType: string;
}

export const useSpecialEvents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    location: '',
    eventType: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<RegistrationFormData>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const conferenceRef = useRef<HTMLDivElement>(null);

  const specialEvents: SpecialEvent[] = [
    {
      id: '1',
      title: 'Wisdom Power Conference 2025',
      date: 'March 15-17, 2025',
      time: '6:00 PM Daily',
      description:
        'Experience three days of powerful teachings, anointed worship, and life-changing encounters with God. Join us for this transformative conference featuring renowned speakers and ministers.',
      location: 'Main Sanctuary & Overflow Areas',
      type: 'conference',
      image: '/images/conference-2025.jpg',
      featured: true,
      registrationLink: '#register',
    },
    {
      id: '2',
      title: '7 Nights of Lifting',
      date: 'November 17-23, 2025',
      time: '6:00 PM Each Night',
      description:
        'Seven consecutive nights of spiritual elevation, powerful worship, and breakthrough messages. Each night focuses on a different aspect of spiritual growth and divine encounter.',
      location: 'Main Sanctuary',
      type: 'conference',
      image: NL.src,
      featured: true,
    },
    {
      id: '3',
      title: '7 Nights of Lifting',
      date: 'NOVEMBER 17 - 23, 2025',
      time: '5PM Daily',
      description:
        'Join us for a powerful 7 Nights of Lifting service celebrating the resurrection of Jesus Christ. Special music, message of hope, and family activities.',
      location: 'Honors Gardens, opposite Dominion Church , Alasia Bus Stop',
      type: 'celebration',
      image: '/images/easter-service.jpg',
    },
    {
      id: '4',
      title: 'Christmas Eve Candlelight Service',
      date: 'December 24, 2024',
      time: '4:00 PM, 6:00 PM & 8:00 PM',
      description:
        'A beautiful candlelight service with Christmas carols, communion, and the Christmas story. Perfect for the whole family.',
      location: 'Main Sanctuary',
      type: 'celebration',
      image: '/images/christmas-eve.jpg',
    },

    {
      id: '6',
      title: 'Supernatural Service',
      date: 'Fourth Sunday of Each Month',
      time: '9:00 AM',
      description:
        'Experience the supernatural power of God in our monthly miracle service. A time dedicated to healing, deliverance, and divine encounters.',
      location: 'Main Sanctuary',
      type: 'service',
      image: '/images/supernatural-service.jpg',
    },
  ];

  const weeklyServices = [
    {
      day: 'Sunday',
      services: [
        { time: '9:00 AM', name: 'Main Worship Service', type: 'worship' },
      ],
    },
    {
      day: 'Thursday',
      services: [
        { time: '6:00 PM', name: 'Midweek Service', type: 'teaching' },
      ],
    },
  ];

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', {
        ...formData,
        event: selectedEvent?.title,
      });

      // Close modal and reset form
      closeModal();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        location: '',
        eventType: selectedEvent?.title || '',
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal handlers
  const openModal = (event: SpecialEvent) => {
    setSelectedEvent(event);
    setFormData(prev => ({ ...prev, eventType: event.title }));
    setIsModalOpen(true);

    gsap.fromTo(
      '.event-modal',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
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
        setFormErrors({});
      },
    });
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );

      // Services section animation
      gsap.fromTo(
        servicesRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: servicesRef.current,
            start: 'top 80%',
          },
        }
      );

      // Events section animation
      const eventCards = eventsRef.current?.querySelectorAll('.event-card');
      if (eventCards) {
        gsap.fromTo(
          eventCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: eventsRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      // Conference section animation
      gsap.fromTo(
        conferenceRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: conferenceRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return {
    // State
    isModalOpen,
    selectedEvent,
    formData,
    formErrors,
    isSubmitting,

    // Refs
    headerRef,
    servicesRef,
    eventsRef,
    conferenceRef,

    // Data
    specialEvents,
    weeklyServices,

    // Handlers
    handleInputChange,
    handleSubmit,
    openModal,
    closeModal,
  };
};
