'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import type { LeadershipMember as ApiLeadershipMember } from '@/lib/types';

type LeadershipMember = ApiLeadershipMember | any;

interface UseLeadershipState {
  leaders: LeadershipMember[];
  isLoading: boolean;
  error: string | null;
}

export function useLeadership() {
  const [state, setState] = useState<UseLeadershipState>({
    leaders: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Fetch leadership from backend
        const leaders = await apiClient.listLeadership();

        if (leaders && leaders.length > 0) {
          setState({
            leaders,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            leaders: [],
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch leadership:', error);
        setState({
          leaders: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load leadership',
        });
      }
    };

    fetchLeadership();
  }, []);

  return state;
}
