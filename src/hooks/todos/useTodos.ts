import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilter } from '../../types/todo';
import { todoService } from '../../services/todos';
import { handleAuthError } from '../../services/auth/errors';

interface UseTodosReturn {
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
 * Custom hook for managing todos
 * Uses SWR for data fetching, caching, and synchronization
 */
export const useTodos = (filter?: TodoFilter): UseTodosReturn => {
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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle loading state
  useEffect(() => {
    if (!data && !error) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [data, error]);

  // Handle error state
  useEffect(() => {
    if (error) {
      setErrorMessage(handleAuthError(error).message);
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  const createTodo = async (todoData: CreateTodoRequest) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const newTodo = await todoService.createTodo(todoData);

      // Update local cache optimistically
      if (data) {
        mutate([...data, newTodo], false);
      } else {
        mutate([newTodo]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: UpdateTodoRequest) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const updatedTodo = await todoService.updateTodo(id, updates);

      // Update local cache optimistically
      if (data) {
        const updatedTodos = data.map(todo =>
          todo.id === id ? updatedTodo : todo
        );
        mutate(updatedTodos, false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const toggledTodo = await todoService.toggleTodoCompletion(id);

      // Update local cache optimistically
      if (data) {
        const updatedTodos = data.map(todo =>
          todo.id === id ? toggledTodo : todo
        );
        mutate(updatedTodos, false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      await todoService.deleteTodo(id);

      // Update local cache optimistically
      if (data) {
        const updatedTodos = data.filter(todo => todo.id !== id);
        mutate(updatedTodos, false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete todo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    mutate();
  };

  return {
    todos: data || [],
    loading,
    error: errorMessage,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refetch
  };
};