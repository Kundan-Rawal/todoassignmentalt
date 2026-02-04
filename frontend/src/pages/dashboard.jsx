import { useEffect, useState } from 'react';
import api from '../api'; // Your axios instance
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos");
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await api.post('/todos', { title: newTodo });
      // Add new item to the top of the list
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      alert('Error adding todo');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      // Optimistic update: update UI immediately
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, is_completed: !currentStatus } : t
      );
      setTodos(updatedTodos);

      // Send to backend
      await api.put(`/todos/${id}`, { is_completed: !currentStatus });
    } catch (error) {
      // Revert if API fails
      fetchTodos();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Tasks</h1>
        <button onClick={logout} className="btn-logout">Logout</button>
      </header>

      <div className="todo-input-section">
        <form onSubmit={handleAddTodo}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn-add">Add</button>
        </form>
      </div>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="empty-state">No tasks yet. Add one above!</li>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
              <span 
                className="todo-text" 
                onClick={() => toggleStatus(todo.id, todo.is_completed)}
              >
                {todo.title}
              </span>
              <button 
                className="btn-delete" 
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}