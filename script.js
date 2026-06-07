const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterBtns = document.querySelectorAll(".filter-btn");

const STORAGE_KEY = "todos";

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = "all";


function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  todos.push({
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;

  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);

  saveTodos();
  renderTodos();
}

function editTodo(index) {
  const updatedText = prompt(
    "Edit task:",
    todos[index].text
  );

  if (!updatedText?.trim()) return;

  todos[index].text = updatedText.trim();

  saveTodos();
  renderTodos();
}


function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter(todo => !todo.completed);

    case "completed":
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}


function createTodoElement(todo, index) {
  const li = document.createElement("li");

  if (todo.completed) {
    li.classList.add("completed");
  }

  li.innerHTML = `
    <span class="task-text">
      ${todo.text}
    </span>

    <div class="task-actions">
      <button 
        class="complete-btn"
        data-action="toggle"
        data-index="${index}">
        ✓
      </button>

      <button
        class="edit-btn"
        data-action="edit"
        data-index="${index}">
        ✏
      </button>

      <button
        class="delete-btn"
        data-action="delete"
        data-index="${index}">
        🗑
      </button>
    </div>
  `;

  return li;
}

function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach(todo => {
    const originalIndex = todos.indexOf(todo);

    todoList.appendChild(
      createTodoElement(todo, originalIndex)
    );
  });
}


function handleAddTodo() {
  const text = todoInput.value.trim();

  if (!text) return;

  addTodo(text);
  todoInput.value = "";
}

function handleFilterClick(button) {
  document
    .querySelector(".filter-btn.active")
    ?.classList.remove("active");

  button.classList.add("active");

  currentFilter = button.dataset.filter;

  renderTodos();
}

function handleTodoActions(event) {
  const button = event.target.closest("button");

  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  switch (action) {
    case "toggle":
      toggleTodo(index);
      break;

    case "edit":
      editTodo(index);
      break;

    case "delete":
      deleteTodo(index);
      break;
  }
}


addBtn.addEventListener("click", handleAddTodo);

todoInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    handleAddTodo();
  }
});

filterBtns.forEach(button => {
  button.addEventListener("click", () =>
    handleFilterClick(button)
  );
});

todoList.addEventListener(
  "click",
  handleTodoActions
);

renderTodos();