import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";

const canAddFolderToSidebar = () => {
	return {};
};

const createTodoDom = (state) => (title, desc, dueDate, priority) => {
	const todo = createToDo(title, desc, dueDate, priority);

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

	let delBtn = document.createElement("button");
	delBtn.classList.add("todo-del-btn");
	delBtn.innerHTML = "🗑️";

	let div = document.createElement("div");
    div.classList.add("todo-info-div");
	div.append(titleP, descP, dueDateP);

	let container = document.createElement("div");
    container.classList.add("todo-container");
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

const createInputDialog = (target) => {
	const dialog = `<dialog role="dialog" id="new-todo-input-dialog">
                <input type="text" name="title" id="title-input">
                <input type="text" name="desc" id="desc-input">
                <input type="date" name="due-date" id="duedate-input">
                <input type="time" name="due-time" id="duetime-input">
                <select name="priority" id="priority-input">
                    <option value="">--Select the priority--</option>
                </select>

                <form method="dialog">
                    <button type="submit" id="submit-todo-input">Add Todo</button>
                    <button>Close</button>
                </form>
            </dialog>`;
	target.innerHTML = dialog;
};

export const initializeDom = () => {
	let state = {
		inboxBtn: document.getElementById("inbox-btn"),
		todayBtn: document.getElementById("today-btn"),
		tomorrowBtn: document.getElementById("tomorrow-btn"),
		foldersSect: document.getElementById("folders"),
		newTodoBtn: document.getElementById("new-todo-btn"),
		todoList: document.getElementById("todo-list"),
        newFolderBtn: document.getElementById("new-folder-btn"),
		inputDialogContainer: document.getElementById("new-todo-input-dialog-container")
	};

	createInputDialog(state.inputDialogContainer);
	state.newTodoInput = document.getElementById("new-todo-input-dialog");
	state.newTodoTitleInput = document.getElementById("title-input");
	state.newTodoDescInput = document.getElementById("desc-input");
	state.newTodoDuedateInput = document.getElementById("duedate-input");
	state.newTodoDuetimeInput = document.getElementById("duetime-input");
	state.newTodoPriorityInput = document.getElementById("priority-input");

	state.newTodoBtn.addEventListener("click", () => {
		state.newTodoInput.showModal();
	});

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
		get foldersSect() {
			return state.foldersSect;
		},
		get newTodoBtn() {
			return state.newTodoBtn;
		},
		get todoList() {
			return state.todoList;
		},
        get newFolderBtn() {
            return state.newFolderBtn;
        },

		...canCreateTodoDom(state),
	};
};
