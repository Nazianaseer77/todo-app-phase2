import apiClient from '../api-client';
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoResponse,
  TodoListResponse,
  TodoFilter
} from '../../types/todo';
import { handleAuthError } from '../auth/errors';

/**
 * Transform API response to frontend Todo model
 */
const transformTodoResponse = (response: TodoResponse): Todo => {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    completed: response.completed,
    dueDate: response.due_date,
    priority: response.priority,
    userId: response.user_id,
    createdAt: response.created_at,
    updatedAt: response.updated_at
  };
};

/**
 * Transform frontend Todo model to API request format
 */
const transformCreateTodoRequest = (request: CreateTodoRequest): any => {
  return {
    ...request,
    due_date: request.dueDate
  };
};

/**
 * Transform frontend Todo update request to API request format
 */
const transformUpdateTodoRequest = (request: UpdateTodoRequest): any => {
  return {
    ...request,
    due_date: request.dueDate
  };
};

/**
 * Helper function to get user ID from token
 */
const getUserIdFromToken = (): string => {
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

  return userId;
};

/**
 * Todo service for handling all todo-related API operations
 */
export const todoService = {
  /**
   * Get all todos for the authenticated user
   */
  async getAllTodos(filter?: TodoFilter): Promise<Todo[]> {
    try {
      const userId = getUserIdFromToken();

      const params = new URLSearchParams();

      // The backend tasks endpoint accepts a 'completed' query parameter for filtering
      if (filter) {
        if (filter.status === 'completed') {
          params.append('completed', 'true');
        } else if (filter.status === 'pending') {
          params.append('completed', 'false');
        }
        // Note: The backend doesn't currently support search, priority, sortBy, or sortOrder
        // We could add these features to the backend if needed
      }

      const queryString = params.toString();
      // The backend expects /api/{user_id}/ (without 'tasks' in the path)
      const url = `/${userId}${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get<TodoListResponse>(url);

      // Transform API response to frontend models
      return response.data.todos.map(transformTodoResponse);
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  /**
   * Get a specific todo by ID
   */
  async getTodoById(id: string): Promise<Todo> {
    try {
      const userId = getUserIdFromToken();

      const response = await apiClient.get<TodoResponse>(`/${userId}/${id}`);
      return transformTodoResponse(response.data);
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  /**
   * Create a new todo
   */
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    try {
      const userId = getUserIdFromToken();

      // Add user_id to the request data since the backend requires it
      const requestData = {
        ...transformCreateTodoRequest(todoData),
        user_id: userId
      };

      const response = await apiClient.post<TodoResponse>(`/${userId}/`, requestData);
      return transformTodoResponse(response.data);
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, todoData: UpdateTodoRequest): Promise<Todo> {
    try {
      const userId = getUserIdFromToken();

      const requestData = transformUpdateTodoRequest(todoData);
      const response = await apiClient.put<TodoResponse>(`/${userId}/${id}`, requestData);
      return transformTodoResponse(response.data);
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  /**
   * Toggle the completion status of a todo
   */
  async toggleTodoCompletion(id: string): Promise<Todo> {
    try {
      const userId = getUserIdFromToken();

      // First get the current todo to know its completion status
      const currentTodo = await this.getTodoById(id);

      const response = await apiClient.patch<TodoResponse>(`/${userId}/${id}/complete`, {
        completed: !currentTodo.completed
      });
      return transformTodoResponse(response.data);
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<void> {
    try {
      const userId = getUserIdFromToken();

      await apiClient.delete(`/${userId}/${id}`);
    } catch (error) {
      throw handleAuthError(error);
    }
  }
};