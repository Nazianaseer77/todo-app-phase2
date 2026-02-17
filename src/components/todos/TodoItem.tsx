import React, { useState } from 'react';
import { Todo } from '../../types/todo';
import Button from '../ui/Button';

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Todo>) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleToggle = () => {
    if (onToggle) {
      onToggle(todo.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(todo.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(todo.id, {
        title: editTitle,
        description: editDescription || undefined
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <li
      className={`p-4 hover:bg-gray-50 ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
      aria-label={`${todo.title} ${todo.completed ? 'completed' : 'not completed'}`}
    >
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Edit todo title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                rows={3}
                aria-label="Edit todo description"
              />
              <div className="flex space-x-2">
                <Button onClick={handleSave} aria-label="Save changes">
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel} aria-label="Cancel editing">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3
                className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                id={`todo-title-${todo.id}`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-500'}`}
                  id={`todo-desc-${todo.id}`}
                >
                  {todo.description}
                </p>
              )}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                {todo.dueDate && (
                  <span>Due: {formatDate(todo.dueDate)}</span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`} aria-label={`Priority: ${todo.priority}`}>
                  {todo.priority}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2" role="group" aria-label="Todo actions">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              aria-label={`Edit "${todo.title}"`}
            >
              Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            aria-label={`Delete "${todo.title}"`}
          >
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;