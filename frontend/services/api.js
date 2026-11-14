import { getAuthSession } from '../utils/storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const { token } = await getAuthSession();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Properties endpoints
  async getProperties(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/properties${query ? `?${query}` : ''}`);
  }

  async getPropertyById(id) {
    return this.request(`/properties/${id}`);
  }

  async createProperty(propertyData) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // Favorites endpoints
  async getFavorites() {
    return this.request('/favorites');
  }

  async toggleFavorite(propertyId) {
    return this.request(`/favorites/${propertyId}`, {
      method: 'POST',
    });
  }

  // Visit requests endpoints
  async getVisits() {
    return this.request('/visits');
  }

  async createVisit(visitData) {
    return this.request('/visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  }
}

export const api = new ApiService();
