'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import type { Testimonial } from '@/lib/apiTypes';
import { testimonialsData } from '@/lib/data'; // Fallback only

interface UseTestimonialsState {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
}

export function useTestimonials() {
  const [state, setState] = useState<UseTestimonialsState>({
    testimonials: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Fetch approved testimonials from backend
        const testimonials = await apiClient.listApprovedTestimonials();

        if (testimonials && testimonials.length > 0) {
          setState({
            testimonials,
            isLoading: false,
            error: null,
          });
        } else {
          // Fallback to mock data only if backend returns empty
          setState({
            testimonials: testimonialsData || [],
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Use mock data as fallback on error
        setState({
          testimonials: testimonialsData || [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load testimonials',
        });
      }
    };

    fetchTestimonials();
  }, []);

  return state;
}
