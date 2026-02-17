'use client';

import React, { useState } from 'react';
import { useTodos } from '../../../src/hooks/todos/useTodos';
import { CreateTodoRequest, UpdateTodoRequest } from '../../../src/types/todo';
import TodoList from '../../../src/components/todos/TodoList';
import TodoForm from '../../../src/components/todos/TodoForm';
import Button from '../../../src/components/ui/Button';
import { useAuth } from '../../../src/contexts/auth';

const DashboardPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    refetch
  } = useTodos();

  const [editingTodo, setEditingTodo] = useState<any>(null);

  const handleCreateTodo = async (todoData: CreateTodoRequest) => {
    try {
      await createTodo(todoData);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdateTodo = async (id: string, updates: UpdateTodoRequest) => {
    try {
      await updateTodo(id, updates);
      setEditingTodo(null);
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id);
      } catch (err) {
        console.error('Error deleting todo:', err);
      }
    }
  };

  const startEditing = (todo: any) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Todo Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button
                variant="outline"
                onClick={() => {
                  // Logout functionality would go here
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="pb-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Todos</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add New Todo'}
                </Button>
              </div>
            </div>

            <div className="mt-5">
              {showForm && (
                <div className="mb-8 bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingTodo ? 'Edit Todo' : 'Create New Todo'}
                  </h3>
                  <TodoForm
                    onSubmit={editingTodo ?
                      (data) => handleUpdateTodo(editingTodo.id, data) :
                      handleCreateTodo
                    }
                    onCancel={cancelEditing}
                    initialData={editingTodo || undefined}
                  />
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                  <Button variant="outline" size="sm" className="ml-2" onClick={refetch}>
                    Retry
                  </Button>
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <TodoList
                  todos={todos}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={startEditing}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;