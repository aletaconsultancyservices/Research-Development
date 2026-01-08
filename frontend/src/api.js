import axios from 'axios';

/**
 * API Configuration Module
 * Handles centralized API communication with interceptors for error handling
 * Supports environment-based API URL configuration
 * Version: 2.1.0
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for all requests
});

// Request interceptor - Add request logging and validation
api.interceptors.request.use(
  config => {
    // Log API requests in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors consistently
api.interceptors.response.use(
  response => {
    // Log successful responses in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  error => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`❌ API Error [${status}]:`, data);
      
      // Handle specific status codes
      switch (status) {
        case 400:
          console.error('Bad Request - Invalid data sent to server');
          break;
        case 401:
          console.error('Unauthorized - Authentication required');
          break;
        case 403:
          console.error('Forbidden - Access denied');
          break;
        case 404:
          console.error('Not Found - Resource does not exist');
          break;
        case 500:
          console.error('Server Error - Internal server error');
          break;
        default:
          console.error(`HTTP Error: ${status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ No Response - Server did not respond');
    } else {
      // Error setting up the request
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
