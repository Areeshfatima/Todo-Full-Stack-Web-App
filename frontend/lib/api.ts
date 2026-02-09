// frontend/lib/api.ts
// Centralized API client with JWT attachment from Better Auth session

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T | { raw_response: string }> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Handle network errors
    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear the invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('better-auth-token');

          // Dispatch custom event for auto-redirect to login
          window.dispatchEvent(new Event('auth-expired'));
        }
        throw new Error('Unauthorized: Please log in again');
      }

      // Handle 403 Forbidden - access denied
      if (response.status === 403) {
        throw new Error('Access denied: You do not have permission to perform this action');
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Something went wrong');
      } else {
        // If not JSON, get the text and create a generic error
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text || 'Something went wrong'}`);
      }
    }

    // Check if response is JSON before parsing for successful responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      // If not JSON, return the text content or an empty object
      const text = await response.text();
      console.warn('Non-JSON response received:', text);
      return text ? { raw_response: text } : {} as T | { raw_response: string };
    }
  } catch (error: any) {
    // Handle network connection errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection and try again');
    }

    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};

// Authentication API functions
export const authApi = {
  signup: async (credentials: { email: string; password: string; name?: string }) => {
    const response = await apiRequest<any>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    // Transform backend response to match frontend types
    return {
      token: response.token,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      }
    };
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    // Transform backend response to match frontend types
    return {
      token: response.token,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      }
    };
  },

  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  getUser: async () => {
    const response = await apiRequest<any>('/api/auth/me', {
      method: 'GET',
    });
    // Transform backend response to match frontend types
    return {
      id: response.id,
      email: response.email,
      name: response.name,
    };
  },
};

// Task API functions
export const taskApi = {
  getAll: async () => {
    const response = await apiRequest<any>('/api/tasks');
    // Transform backend response to match frontend types
    return {
      tasks: response.map((task: any) => ({
        id: task.id.toString(), // Convert to string to match frontend type
        userId: task.user_id, // Map user_id to userId
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: task.created_at, // Map snake_case to camelCase
        updatedAt: task.updated_at, // Map snake_case to camelCase
      }))
    };
  },

  create: async (task: { title: string; description?: string; completed: boolean }) => {
    const response = await apiRequest<any>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    // Transform backend response to match frontend types
    return {
      task: {
        id: response.id.toString(), // Convert to string to match frontend type
        userId: response.user_id, // Map user_id to userId
        title: response.title,
        description: response.description,
        completed: response.completed,
        createdAt: response.created_at, // Map snake_case to camelCase
        updatedAt: response.updated_at, // Map snake_case to camelCase
      }
    };
  },

  update: async (id: string, task: import('../types').TaskUpdateRequest) => {
    const response = await apiRequest<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
    // Transform backend response to match frontend types
    return {
      task: {
        id: response.id.toString(), // Convert to string to match frontend type
        userId: response.user_id, // Map user_id to userId
        title: response.title,
        description: response.description,
        completed: response.completed,
        createdAt: response.created_at, // Map snake_case to camelCase
        updatedAt: response.updated_at, // Map snake_case to camelCase
      }
    };
  },

  delete: async (id: string) => {
    return apiRequest(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  toggleComplete: async (id: string, completed: boolean) => {
    const response = await apiRequest<any>(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
    // Transform backend response to match frontend types
    return {
      task: {
        id: response.id.toString(), // Convert to string to match frontend type
        userId: response.user_id, // Map user_id to userId
        title: response.title,
        description: response.description,
        completed: response.completed,
        createdAt: response.created_at, // Map snake_case to camelCase
        updatedAt: response.updated_at, // Map snake_case to camelCase
      }
    };
  },
};

export default {
  auth: authApi,
  tasks: taskApi,
};