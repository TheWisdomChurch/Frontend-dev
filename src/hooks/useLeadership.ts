'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import type { LeadershipMember as ApiLeadershipMember } from '@/lib/types';
import { pastorsData, deaconsData } from '@/lib/data'; // Fallback only

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
          // Fallback to mock data only if backend returns empty
          const fallbackLeaders = [
            ...(pastorsData || []),
            ...(deaconsData || []),
          ];
          setState({
            leaders: fallbackLeaders,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch leadership:', error);
        // Use mock data as fallback on error
        const fallbackLeaders = [
          ...(pastorsData || []),
          ...(deaconsData || []),
        ];
        setState({
          leaders: fallbackLeaders,
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
