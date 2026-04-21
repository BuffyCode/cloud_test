document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoPriority = document.getElementById('todo-priority');
    const todoList = document.getElementById('todo-list');
    const errorMsg = document.getElementById('error-msg');
    const taskCount = document.getElementById('task-count');
    
    const API_BASE_URL = '/api/todos';

    fetchTodos();

    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        const priority = todoPriority.value;
        if (!text) return;

        try {
            const btn = document.getElementById('add-btn');
            btn.innerHTML = 'Adding...';
            btn.disabled = true;

            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, priority })
            });

            if (!res.ok) throw new Error('Failed');
            
            todoInput.value = '';
            hideError();
            await fetchTodos();
            
            btn.innerHTML = '<span>Add Task</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
            btn.disabled = false;
        } catch (err) {
            showError('Server connection error.');
            btn.disabled = false;
        }
    });

    async function fetchTodos() {
        try {
            const res = await fetch(API_BASE_URL);
            const todos = await res.json();
            renderTodos(todos);
            taskCount.innerText = `${todos.length} Task${todos.length !== 1 ? 's' : ''}`;
        } catch (err) {
            showError('Failed to load tasks.');
        }
    }

    function renderTodos(todos) {
        todoList.innerHTML = todos.length === 0 ? 
            '<li class="empty-state">All caught up! 🎉</li>' : '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <label class="checkbox-container">
                    <input type="checkbox" class="toggle-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="priority-badge priority-${(todo.priority || 'Medium').toLowerCase()}">${todo.priority || 'Med'}</span>
                <button class="delete-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;

            li.querySelector('.toggle-checkbox').addEventListener('change', (e) => toggleTodo(todo._id, e.target.checked, li));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo._id, li));
            todoList.appendChild(li);
        });
    }

    // (Include toggleTodo, deleteTodo, showError, hideError, and escapeHtml from your original script)
});