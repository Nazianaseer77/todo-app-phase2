import { useState } from 'react';
import useSWR from 'swr';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilter } from '../../types/todo';
import { todoService } from '../../services/todos';

interface UseOptimisticTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (todoData: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refetch: () => void;
}

/**
 * Custom hook for managing todos with optimistic UI updates
 * Uses SWR for data fetching and caching, with optimistic updates for better UX
 */
export const useOptimisticTodos = (filter?: TodoFilter): UseOptimisticTodosReturn => {
  // Get user ID for cache key
  const userId = typeof window !== 'undefined' ? (() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub || 'unknown';
      } catch (e) {
        return localStorage.getItem('user_id') || 'unknown';
      }
    }
    return 'unknown';
  })() : 'unknown';

  // Construct cache key based on user ID and filter
  const filterKey = filter ? JSON.stringify(filter) : '';
  const { data, error, mutate } = useSWR(
    [`/user-todos-${userId}-${filterKey}`, filterKey],
    () => todoService.getAllTodos(filter),
    {
      // Revalidate data on focus and on interval
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  const [optimisticTodos, setOptimisticTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Combine server data with optimistic updates
  const todos = optimisticTodos.length > 0 ? optimisticTodos : data || [];

  const createTodo = async (todoData: CreateTodoRequest) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Optimistic update: add todo to local state immediately
      const newTodoId = `optimistic-${Date.now()}`;
      const optimisticTodo: Todo = {
        id: newTodoId,
        title: todoData.title,
        description: todoData.description,
        completed: false,
        dueDate: todoData.dueDate,
        priority: todoData.priority || 'medium',
        userId: '', // Will be populated by backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to optimistic list
      setOptimisticTodos(prev => [...prev, optimisticTodo]);

      // Actually create the todo
      const actualTodo = await todoService.createTodo(todoData);

      // Replace the optimistic todo with the actual one
      setOptimisticTodos(prev =>
        prev.map(todo =>
          todo.id === newTodoId ? actualTodo : todo
        )
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create todo');

      // Remove optimistic todo on error
      setOptimisticTodos(prev =>
        prev.filter(todo => !todo.id.startsWith('optimistic-'))
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: UpdateTodoRequest) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Optimistic update: update todo in local state immediately
      setOptimisticTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo
        )
      );

      // Actually update the todo
      const updatedTodo = await todoService.updateTodo(id, updates);

      // Replace with the actual updated todo
      setOptimisticTodos(prev =>
        prev.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update todo');

      // Revert optimistic update on error by refetching
      setOptimisticTodos([]); // Reset to server state
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Optimistic update: toggle completion status immediately
      setOptimisticTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } : todo
        )
      );

      // Actually toggle the todo
      const updatedTodo = await todoService.toggleTodoCompletion(id);

      // Replace with the actual updated todo
      setOptimisticTodos(prev =>
        prev.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle todo');

      // Revert optimistic update on error by refetching
      setOptimisticTodos([]); // Reset to server state
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Optimistic update: remove todo from local state immediately
      setOptimisticTodos(prev =>
        prev.filter(todo => todo.id !== id)
      );

      // Actually delete the todo
      await todoService.deleteTodo(id);

      // If successful, the todo is already removed from optimistic state
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete todo');

      // Revert optimistic update on error by refetching
      setOptimisticTodos([]); // Reset to server state
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    // Clear optimistic updates and refetch from server
    setOptimisticTodos([]);
    mutate();
  };

  return {
    todos,
    loading,
    error: errorMessage,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refetch
  };
};