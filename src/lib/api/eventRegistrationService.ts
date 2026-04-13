/**
 * Event Registration API Service
 * Handles all event registration related API calls
 */

import { apiClient, ApiResponse, PaginatedResponse } from './apiClient';
import type { EventRegistrationData } from '@/lib/types';
import type { EventRegistrationFormSchema } from '@/lib/validation';

export interface EventRegistrationResponse {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'attended' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class EventRegistrationService {
  private baseEndpoint = '/events/registrations';

  /**
   * Submit event registration
   */
  async submitRegistration(
    data: EventRegistrationFormSchema & EventRegistrationData
  ): Promise<EventRegistrationResponse> {
    try {
      const response = await apiClient.post<EventRegistrationResponse>(
        this.baseEndpoint,
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }

      return response.data.data as EventRegistrationResponse;
    } catch (error) {
      console.error('Event registration error:', error);
      throw error;
    }
  }

  /**
   * Get registration by ID
   */
  async getRegistration(
    registrationId: string
  ): Promise<EventRegistrationResponse> {
    try {
      const response = await apiClient.get<EventRegistrationResponse>(
        `${this.baseEndpoint}/${registrationId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch registration');
      }

      return response.data.data as EventRegistrationResponse;
    } catch (error) {
      console.error('Get registration error:', error);
      throw error;
    }
  }

  /**
   * Get all registrations for an event
   */
  async getEventRegistrations(
    eventId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<EventRegistrationResponse>> {
    try {
      const response = await apiClient.get<
        PaginatedResponse<EventRegistrationResponse>
      >(`/events/${eventId}${this.baseEndpoint}`, {
        params: { page, pageSize },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch registrations');
      }

      return response.data.data as PaginatedResponse<EventRegistrationResponse>;
    } catch (error) {
      console.error('Get event registrations error:', error);
      throw error;
    }
  }

  /**
   * Update registration status
   */
  async updateRegistrationStatus(
    registrationId: string,
    status: 'confirmed' | 'attended' | 'cancelled'
  ): Promise<EventRegistrationResponse> {
    try {
      const response = await apiClient.patch<EventRegistrationResponse>(
        `${this.baseEndpoint}/${registrationId}/status`,
        { status }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update status');
      }

      return response.data.data as EventRegistrationResponse;
    } catch (error) {
      console.error('Update registration status error:', error);
      throw error;
    }
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(registrationId: string): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${this.baseEndpoint}/${registrationId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Cancel registration error:', error);
      throw error;
    }
  }
}

export const eventRegistrationService = new EventRegistrationService();
