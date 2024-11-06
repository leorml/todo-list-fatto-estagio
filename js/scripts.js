// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoPriceInput = document.querySelector("#todo-price");
const todoDeadlineInput = document.querySelector("#todo-deadline"); 
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editPriceInput = document.querySelector("#edit-price");
const editDeadlineInput = document.querySelector("#edit-deadline"); // Novo input para a data limite na edição
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;
let oldPriceValue;''
let oldDeadlineValue;

// Funções
const saveTodo = (text, price = 0, deadline, done = 0, save = 1) => {
  if (!text || !price || !deadline) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const todoPrice = document.createElement("span");
  todoPrice.classList.add("todo-price");
  todoPrice.innerText = `R$ ${price.toFixed(2)}`;
  todo.appendChild(todoPrice);

  const todoDeadline = document.createElement("span");
  todoDeadline.classList.add("todo-deadline");
  todoDeadline.innerText = `Data Limite: ${deadline}`;
  todo.appendChild(todoDeadline);

  // Adicionar classe para background amarelo se o preço for maior que 1000
  if (price >= 1000) {
    todo.classList.add("high-price");
  }

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, price, deadline, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoPriceInput.value = "";
  todoDeadlineInput.value = ""; // Limpar o input de data limite
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

/**const updateTodo = (text, price, deadline) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    let todoPrice = todo.querySelector(".todo-price");
    let todoDeadline = todo.querySelector(".todo-deadline"); 

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
      todoPrice.innerText = `R$ ${price.toFixed(2)}`;
      todoDeadline.innerText = `Data Limite: ${deadline}`;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text, price, deadline);
    }

    if (price > 1000) {
      todo.classList.add("high-price");
    } else {
      todo.classList.remove("high-price");
    }
  });
};
**/
const updateTodo = (text, price, deadline) => {
  console.log("updateTodo foi chamada com os valores:", text, price, deadline);
  const todos = document.querySelectorAll(".todo");
  console.log("todos:", todos);

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    let todoPrice = todo.querySelector(".todo-price");
    let todoDeadline = todo.querySelector(".todo-deadline");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
      todoPrice.innerText = `R$ ${price.toFixed(2)}`;
      todoDeadline.innerText = `Data Limite: ${deadline}`;
    }

    if (parseFloat(todoPrice.innerText.replace("R$ ", "")) >= 1000) {
      todo.classList.add("high-price");
    } else {
      todo.classList.remove("high-price");
    }
  });
};
const sortable = Sortable.create(todoList, {
  // configurações do SortableJS
});
// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  const priceValue = parseFloat(todoPriceInput.value) || 0;
  const deadlineValue = todoDeadlineInput.value; // Obter o valor da data limite

  if (inputValue) {
    saveTodo(inputValue, priceValue, deadlineValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;
  let todoPrice;
  let todoDeadline;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
    todoPrice = parseFloat(
      parentEl.querySelector(".todo-price").innerText.replace("R$ ", "")
    );
    todoDeadline = parentEl.querySelector(".todo-deadline").innerText.replace("Data Limite: ", ""); // Obter a data limite
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    editPriceInput.value = todoPrice;
    editDeadlineInput.value = todoDeadline; // Preencher o input de data limite na edição
    oldInputValue = todoTitle;
    oldPriceValue = todoPrice;
    oldDeadlineValue = todoDeadline; // Armazenar a data limite antiga
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;
  const editPriceValue = parseFloat(editPriceInput.value) || 0;
  const editDeadlineValue = editDeadlineInput.value; // Obter a data limite da edição

  if (editInputValue) {
    updateTodo(editInputValue, editPriceValue, editDeadlineValue);
  }

  toggleForms();
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.price, todo.deadline, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText, todoNewPrice, todoNewDeadline) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText
      ? ((todo.text = todoNewText), (todo.price = todoNewPrice), (todo.deadline = todoNewDeadline))
      : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};
const db = require('./database');

// Função para inserir uma tarefa no banco de dados
function insertTarefa(text, price, deadline) {
  db.run(`
    INSERT INTO tarefas (text, price, deadline)
    VALUES (?, ?, ?);
  `, [text, price, deadline], function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Tarefa inserida com sucesso!');
    }
  });
}

// Função para selecionar todas as tarefas do banco de dados
function selectTarefas() {
  db.all('SELECT * FROM tarefas', function(err, rows) {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
    }
  });
}

const todos = getAllTodos();

if (todos.length > 0) {
  todos.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.classList.add("todo");
    todoElement.innerHTML = `
      <h3>${todo.text}</h3>
      <span>${todo.price}</span>
      <span>${todo.deadline}</span>
    `;
    todoList.appendChild(todoElement);
  });
} else {
  const messageElement = document.createElement("p");
  messageElement.textContent = "Não há tarefas salvas no banco de dados.";
  todoList.appendChild(messageElement);
}

// Inserir uma tarefa no banco de dados
insertTarefa('Nova tarefa', 100.00, '2023-03-15');
loadTodos();
// Selecionar todas as tarefas do banco de dados
selectTarefas();