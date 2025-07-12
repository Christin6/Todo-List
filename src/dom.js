import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";

const canAddFolderToSidebar = () => {
	return {};
};

const createTodoDom = (state) => (title, desc, dueDate, priority, notes) => {
	const todo = createToDo(title, desc, dueDate, priority, notes);

	let checkBox = document.createElement("input");
	checkBox.type = "checkbox";
	checkBox.classList.add("todo-checkbox");
	checkBox.checked = todo.checked;

	let titleP = document.createElement("p");
	titleP.classList.add("todo-title");
	titleP.innerHTML = todo.title;

	let descP = document.createElement("p");
	descP.classList.add("todo-desc");
	descP.innerHTML = todo.description;

	let dueDateP = document.createElement("p");
	dueDateP.classList.add("todo-due");
	dueDateP.innerHTML = todo.dueDate;

	let noteP = document.createElement("p");
	noteP.classList.add("todo-note");
	noteP.innerHTML = todo.notes;

	let delBtn = document.createElement("button");
	delBtn.classList.add("todo-del-btn");
	delBtn.innerHTML = "X";

	let div = document.createElement("div");
	div.append(titleP, descP, dueDateP, noteP);

	let container = document.createElement("div");
	container.append(checkBox, div, delBtn);

	checkBox.addEventListener("change", (event) => {
		if (event.currentTarget.checked) {
			div.style.textDecoration = "line-through";
			div.style.color = "#828282";
		} else {
			div.style.textDecoration = "none";
			div.style.color = "#000";
		}
	});

	delBtn.addEventListener("click", () => {
		state.todoList.removeChild(container);
	});

	state.todoList.appendChild(container);
};

const canCreateTodoDom = (state) => {
	return {
		createTodoDom: createTodoDom(state),
	};
};

export const initializeDom = () => {
	let state = {
		inboxBtn: document.getElementById("inbox-btn"),
		todayBtn: document.getElementById("today-btn"),
		tomorrowBtn: document.getElementById("tomorrow-btn"),
		listsSect: document.getElementById("lists"),
		newTodoBtn: document.getElementById("new-todo-btn"),
		todoList: document.getElementById("todo-list"),
	};

	return {
		get inboxBtn() {
			return state.inboxBtn;
		},
		get todayBtn() {
			return state.todayBtn;
		},
		get tomorrowBtn() {
			return state.tomorrowBtn;
		},
		get listsSect() {
			return state.listsSect;
		},
		get newTodoBtn() {
			return state.newTodoBtn;
		},
		get todoList() {
			return state.todoList;
		},

		...canCreateTodoDom(state),
	};
};
