/**
 * Giving/Donations API Service
 * Handles all giving and donation-related API calls
 */

import { apiClient } from './apiClient';

export interface DonationData {
  amount: number;
  currency: string;
  method: 'card' | 'bank' | 'mobile';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  donorType: 'anonymous' | 'identified';
  category?: string;
  message?: string;
  recurring?: {
    enabled: boolean;
    frequency?: 'monthly' | 'quarterly' | 'yearly';
  };
}

export interface DonationResponse {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
  reference: string;
}

class GivingService {
  private baseEndpoint = '/giving';

  /**
   * Process donation
   */
  async processDonation(data: DonationData): Promise<DonationResponse> {
    try {
      const response = await apiClient.post<DonationResponse>(
        `${this.baseEndpoint}/donate`,
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Donation processing failed');
      }

      return response.data.data as DonationResponse;
    } catch (error) {
      console.error('Donation error:', error);
      throw error;
    }
  }

  /**
   * Get donation history (requires authentication)
   */
  async getDonationHistory(pageSize: number = 10) {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/history`, {
        params: { pageSize },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Failed to fetch donation history'
        );
      }

      return response.data.data;
    } catch (error) {
      console.error('Get donation history error:', error);
      throw error;
    }
  }

  /**
   * Get giving statistics (public)
   */
  async getGivingStats() {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/statistics`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch statistics');
      }

      return response.data.data;
    } catch (error) {
      console.error('Get giving stats error:', error);
      throw error;
    }
  }

  /**
   * Verify donation status
   */
  async verifyDonation(transactionId: string): Promise<DonationResponse> {
    try {
      const response = await apiClient.get<DonationResponse>(
        `${this.baseEndpoint}/verify/${transactionId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to verify donation');
      }

      return response.data.data as DonationResponse;
    } catch (error) {
      console.error('Verify donation error:', error);
      throw error;
    }
  }

  /**
   * Set up recurring donation
   */
  async setupRecurringDonation(data: DonationData) {
    try {
      const response = await apiClient.post(
        `${this.baseEndpoint}/recurring`,
        data
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Failed to set up recurring donation'
        );
      }

      return response.data.data;
    } catch (error) {
      console.error('Setup recurring donation error:', error);
      throw error;
    }
  }

  /**
   * Cancel recurring donation
   */
  async cancelRecurringDonation(recurringId: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${this.baseEndpoint}/recurring/${recurringId}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Failed to cancel recurring donation'
        );
      }
    } catch (error) {
      console.error('Cancel recurring donation error:', error);
      throw error;
    }
  }
}

export const givingService = new GivingService();
