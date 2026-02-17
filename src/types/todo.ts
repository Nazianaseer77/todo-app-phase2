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

// Todo creation request type
export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  priority?: 'low' | 'medium' | 'high';
}

// Todo update request type
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string; // ISO date string
  priority?: 'low' | 'medium' | 'high';
}

// Todo API response type
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

// Todo list response type
export interface TodoListResponse {
  todos: TodoResponse[];
  total: number;
}

// Todo filter type
export interface TodoFilter {
  status?: 'all' | 'active' | 'completed';
  searchTerm?: string;
  priority?: 'low' | 'medium' | 'high';
  sortBy?: 'date' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}