// User type
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

// Todo type
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Filter type
export interface Filter {
  status: 'all' | 'active' | 'completed';
  searchTerm?: string;
  category?: string;
  sortBy: 'date' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

// UI State type
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  viewMode: 'list' | 'grid';
  loadingStates: { [key: string]: boolean };
  errorMessages: { [key: string]: string };
  preferences: UserPreferences;
}

// User Preferences type
export interface UserPreferences {
  autoSave: boolean;
  notifications: boolean;
  compactView: boolean;
  showCompleted: boolean;
}

// API Response types
export interface TodoResponse {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string; // snake_case from API
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: string; // snake_case from API
  updated_at: string; // snake_case from API
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// Error types
export interface APIError {
  message: string;
  code: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}