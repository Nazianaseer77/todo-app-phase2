import apiClient from './index';
import {
  TodoResponse,
  TodoListResponse,
  CreateTodoRequest,
  UpdateTodoRequest
} from '../../types/todo';

/**
 * Todo-specific API client methods
 */
export const todoApiClient = {
  /**
   * Get all todos for the authenticated user
   */
  async getAllTodos(
    status?: 'all' | 'active' | 'completed',
    searchTerm?: string,
    priority?: 'low' | 'medium' | 'high',
    sortBy?: 'date' | 'priority' | 'title',
    sortOrder?: 'asc' | 'desc'
  ): Promise<TodoListResponse> {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    let userId = '';

    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback: try to get user ID from local storage
        userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    const params = new URLSearchParams();

    // Map status to backend's completed filter
    if (status === 'completed') {
      params.append('completed', 'true');
    } else if (status === 'active') {
      params.append('completed', 'false');
    }
    // Note: The backend doesn't currently support search, priority, sortBy, or sortOrder
    // We could add these features to the backend if needed

    const queryString = params.toString();
    // The backend expects /api/{user_id}/ (without 'tasks' in the path)
    const url = `/${userId}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<TodoListResponse>(url);
    return response.data;
  },

  /**
   * Get a specific todo by ID
   */
  async getTodoById(id: string): Promise<TodoResponse> {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    let userId = '';

    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback: try to get user ID from local storage
        userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    const response = await apiClient.get<TodoResponse>(`/${userId}/${id}`);
    return response.data;
  },

  /**
   * Create a new todo
   */
  async createTodo(todoData: CreateTodoRequest): Promise<TodoResponse> {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    let userId = '';

    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback: try to get user ID from local storage
        userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    // Add user_id to the request data since the backend requires it
    const requestData = {
      ...todoData,
      user_id: userId
    };

    const response = await apiClient.post<TodoResponse>(`/${userId}/`, requestData);
    return response.data;
  },

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, todoData: UpdateTodoRequest): Promise<TodoResponse> {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    let userId = '';

    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback: try to get user ID from local storage
        userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    const response = await apiClient.put<TodoResponse>(`/${userId}/${id}`, todoData);
    return response.data;
  },

  /**
   * Toggle the completion status of a todo
   */
  async toggleTodoCompletion(id: string): Promise<TodoResponse> {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    let userId = '';

    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback: try to get user ID from local storage
        userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    // First get the current todo to know its completion status
    const currentTodo = await this.getTodoById(id);

    const response = await apiClient.patch<TodoResponse>(`/${userId}/${id}/complete`, {
      completed: !currentTodo.completed
    });
    return response.data;
  },

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<void> {
    // Get user ID from token
    const token = localStorage.getItem('access_token');
    let userId = '';

    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        // Fallback: try to get user ID from local storage
        userId = localStorage.getItem('user_id') || '';
      }
    }

    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }

    await apiClient.delete(`/${userId}/${id}`);
  }
};