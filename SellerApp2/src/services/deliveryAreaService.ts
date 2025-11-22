import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '../config';

// Delivery Area interfaces
export interface DeliveryArea {
  radius: number;
  unit: 'km' | 'miles';
  isActive: boolean;
  updatedAt: string;
}

export interface DeliveryAreaWithLocation extends DeliveryArea {
  storeLocation: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

export interface DeliveryAreaResponse {
  success: boolean;
  message?: string;
  data?: DeliveryAreaWithLocation;
  error?: string;
}

export interface SetDeliveryAreaRequest {
  radius: number;
  unit?: 'km' | 'miles';
  isActive?: boolean;
}

class DeliveryAreaService {
  /**
   * Get delivery area settings for authenticated seller
   */
  async getDeliveryArea(): Promise<DeliveryAreaResponse> {
    try {
      console.log('📍 Fetching delivery area...');
      const response = await httpClient.get<DeliveryAreaResponse>(
        API_ENDPOINTS.DELIVERY_AREA
      );

      if (!response) {
        return {
          success: false,
          error: 'Empty response from server'
        };
      }

      console.log('✅ Delivery area fetched:', response);
      return response;
    } catch (error: any) {
      console.error('Get delivery area error:', error);
      
      // Handle different types of errors
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || `Server error: ${error.response.status}`
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - please check your connection'
        };
      } else {
        return {
          success: false,
          error: error.message || 'Failed to get delivery area'
        };
      }
    }
  }

  /**
   * Set or update delivery area
   */
  async setDeliveryArea(data: SetDeliveryAreaRequest): Promise<DeliveryAreaResponse> {
    try {
      console.log('📍 Setting delivery area:', data);
      
      // Validate radius
      if (data.radius < 0 || data.radius > 20) {
        return {
          success: false,
          error: 'Radius must be between 0 and 20 km'
        };
      }

      const response = await httpClient.put<DeliveryAreaResponse>(
        API_ENDPOINTS.DELIVERY_AREA,
        data
      );

      if (!response) {
        return {
          success: false,
          error: 'Empty response from server'
        };
      }

      console.log('✅ Delivery area set:', response);
      return response;
    } catch (error: any) {
      console.error('Set delivery area error:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || `Server error: ${error.response.status}`
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - please check your connection'
        };
      } else {
        return {
          success: false,
          error: error.message || 'Failed to set delivery area'
        };
      }
    }
  }

  /**
   * Clear delivery area (reset to defaults)
   */
  async clearDeliveryArea(): Promise<DeliveryAreaResponse> {
    try {
      console.log('🗑️ Clearing delivery area...');
      const response = await httpClient.delete<DeliveryAreaResponse>(
        API_ENDPOINTS.DELIVERY_AREA
      );

      if (!response) {
        return {
          success: false,
          error: 'Empty response from server'
        };
      }

      console.log('✅ Delivery area cleared:', response);
      return response;
    } catch (error: any) {
      console.error('Clear delivery area error:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || `Server error: ${error.response.status}`
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Network error - please check your connection'
        };
      } else {
        return {
          success: false,
          error: error.message || 'Failed to clear delivery area'
        };
      }
    }
  }
}

export const deliveryAreaService = new DeliveryAreaService();

