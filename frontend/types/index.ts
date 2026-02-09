// UserSession represents an authenticated user's session state
export interface UserSession {
  userId: string;
  token: string;
  email: string;
  name?: string;
}

// Task represents a user's individual todo item
export interface Task {
  id: number | string;  // Support both number (from backend) and string (for frontend consistency)
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// UI State manages the frontend application state
export interface UIState {
  loading: boolean;
  error?: string;
  modalOpen: boolean;
  toastMessage?: string;
  optimisticTasks?: Task[];
}

// ApiResponse for standardized API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// TaskUpdateRequest for updating task properties
export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

// UserCredentials for authentication
export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}