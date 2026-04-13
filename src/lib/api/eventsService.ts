/**
 * Events API Service
 * Handles all event-related API calls
 */

import { apiClient, ApiResponse, PaginatedResponse } from './apiClient';

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  time?: string;
  location: string;
  image_url?: string;
  event_type: string;
  capacity?: number;
  registered?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class EventsService {
  private baseEndpoint = '/events';

  /**
   * Get all events with optional filtering and pagination
   */
  async getEvents(filters?: {
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
    searchTerm?: string;
  }): Promise<PaginatedResponse<Event>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Event>>(
        this.baseEndpoint,
        { params: filters }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch events');
      }

      return response.data.data as PaginatedResponse<Event>;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  /**
   * Get event by ID
   */
  async getEvent(eventId: string): Promise<Event> {
    try {
      const response = await apiClient.get<Event>(
        `${this.baseEndpoint}/${eventId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch event');
      }

      return response.data.data as Event;
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>(
        `${this.baseEndpoint}/upcoming`,
        {
          params: { limit },
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Failed to fetch upcoming events'
        );
      }

      return response.data.data as Event[];
    } catch (error) {
      console.error('Get upcoming events error:', error);
      throw error;
    }
  }

  /**
   * Get featured events
   */
  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>(
        `${this.baseEndpoint}/featured`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Failed to fetch featured events'
        );
      }

      return response.data.data as Event[];
    } catch (error) {
      console.error('Get featured events error:', error);
      throw error;
    }
  }

  /**
   * Create event (admin)
   */
  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await apiClient.post<Event>(
        this.baseEndpoint,
        eventData
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create event');
      }

      return response.data.data as Event;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  /**
   * Update event (admin)
   */
  async updateEvent(
    eventId: string,
    updates: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    try {
      const response = await apiClient.patch<Event>(
        `${this.baseEndpoint}/${eventId}`,
        updates
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update event');
      }

      return response.data.data as Event;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  /**
   * Delete event (admin)
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${this.baseEndpoint}/${eventId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }
}

export const eventsService = new EventsService();
