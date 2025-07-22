import { format } from "date-fns";
import { searchFolder, searchTodoBasedOnFolder } from "./util";

const createTodoDom = (todo, folder, target) => {
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
	dueDateP.innerHTML = format(todo.dueDate, "yyyy-MM-dd KK:mm a");

	let otherBtn = document.createElement("button");
	otherBtn.classList.add("todo-other-btn");
	otherBtn.innerText = "・・・";

	let delBtn = document.createElement("button");
	delBtn.classList.add("todo-del-btn");
	delBtn.innerText = "🗑️ Delete task";

	let editBtn = document.createElement("button");
	editBtn.classList.add("todo-edit-btn");
	editBtn.innerText = "✏️ Edit task";

	let dropDownOptionsContainer = document.createElement("div");
	dropDownOptionsContainer.append(editBtn, delBtn);
	dropDownOptionsContainer.style.display = "none";

	let dropDownContainer = document.createElement("div");
	dropDownContainer.classList.add("todo-dropdown-menu");
	dropDownContainer.append(otherBtn, dropDownOptionsContainer);

	let div = document.createElement("div");
	div.classList.add("todo-info-div");
	div.append(titleP, descP, dueDateP);

	let container = document.createElement("div");
	container.classList.add("todo-container");
	container.append(checkBox, div, dropDownContainer);

	container.style.borderLeft = `5px solid ${todo.priority}`;

	checkBox.addEventListener("change", () => {
		todo.checked = !todo.checked;
		if (todo.checked) {
			div.style.textDecoration = "line-through";
			div.style.color = "#828282";
		} else {
			div.style.textDecoration = "none";
			div.style.color = "#000";
		}
	});

	otherBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		dropDownOptionsContainer.style.display = "";
	});

	document.documentElement.addEventListener("click", () => {
		if (dropDownOptionsContainer.style.display === "") {
			dropDownOptionsContainer.style.display = "none";
		}
	});

	delBtn.addEventListener("click", () => {
		folder.deleteItem(todo);
		target.removeChild(container);
	});

	target.appendChild(container);
};

const canCreateTodoDom = (state) => {
	return {
		createTodoDom: (todo, folder, target) => createTodoDom(todo, folder, target),
	};
};

const canCreateFolderDom = (state) => {
	return {
		createFolderDom: (folder, folderContainer) => {
			let titleBtn = document.createElement("button");
			titleBtn.classList.add("folder-btn");
			titleBtn.innerText = folder.name;

			titleBtn.style.borderLeft = `5px solid ${folder.color}`;

			titleBtn.addEventListener("click", () => {
				state.currentView = folder.name;
				state.todoList.innerHTML = "";

				let todo = searchTodoBasedOnFolder(
					folder.name,
					folderContainer
				);
				for (let i = 0; i < todo.length; i++) {
					createTodoDom(
						todo[i],
						searchFolder(todo[i].folder, folderContainer),
						state.todoList
					);
				}
			});

			state.foldersSect.appendChild(titleBtn);
		},
	};
};

const createTodoInputDialog = (target) => {
	const dialog = `<dialog role="dialog" id="new-todo-input-dialog">
                <input type="text" name="title" id="title-input" placeholder="Title">
                <input type="text" name="desc" id="desc-input" placeholder="Description">
                <input type="datetime-local" name="due-date" id="duedate-input" value=${format(
					new Date(),
					"yyyy-MM-dd"
				)}T${format(new Date(), "HH:mm")} min=${format(
		new Date(),
		"yyyy-MM-dd"
	)}T${format(new Date(), "HH:mm")}>
                <select name="priority" id="priority-input">
                    <option value="">--Select the priority--</option>
                </select>
				<select name="todo-folder" id="folder-input">
                    <option value="📬 Inbox">📬 Inbox</option>
                </select>

                <form method="dialog">
                    <button type="submit" id="submit-todo-input">Add Todo</button>
                    <button>Close</button>
                </form>
            </dialog>`;
	target.innerHTML = dialog;
};

const createFolderInputDialog = (target) => {
	const dialog = `<dialog role="dialog" id="new-folder-input-dialog">
                <input type="text" name="folder-title" id="folder-title-input" placeholder="Folder Name">
                <input type="color" name="folder-color" id="folder-color-input" placeholder="Folder Color">

                <form method="dialog">
                    <button type="submit" id="submit-folder-input">Add Folder</button>
                    <button>Close</button>
                </form>
            </dialog>`;
	target.innerHTML = dialog;
};

const canUpdateFolderOption = (state) => {
	return {
		updateFolderOption: (newFolderOption) => {
			let newOption = document.createElement("option");
			newOption.value = newFolderOption.name;
			newOption.innerText = newFolderOption.name;

			state.newTodoFolderInput.appendChild(newOption);
		},
	};
};

const canCleanTodoContainer = (state) => {
	return {
		cleanTodoContainer: () => state.todoList.innerHTML = "",
	};
};

export const initializeDom = () => {
	let state = {
		allBtn: document.getElementById("all-btn"),
		todayBtn: document.getElementById("today-btn"),
		tomorrowBtn: document.getElementById("tomorrow-btn"),
		foldersSect: document.getElementById("folders"),
		newTodoBtn: document.getElementById("new-todo-btn"),
		todoList: document.getElementById("todo-list"),
		newFolderBtn: document.getElementById("new-folder-btn"),
		inputDialogContainer: document.getElementById(
			"new-todo-input-dialog-container"
		),
		folderInputDialogContainer: document.getElementById(
			"new-folder-input-dialog-container"
		),

		defaultPriority: new Map([
			["🔴High", "red"],
			["🟡Medium", "yellow"],
			["🟢Low", "green"],
			["⚪Neutral", "white"],
		]),
		currentView: "all", // or "tomorrow", or "today", or what folder is opened
	};

	createTodoInputDialog(state.inputDialogContainer);
	state.newTodoInput = document.getElementById("new-todo-input-dialog");
	state.newTodoTitleInput = document.getElementById("title-input");
	state.newTodoDescInput = document.getElementById("desc-input");
	state.newTodoDuedateInput = document.getElementById("duedate-input");
	state.newTodoPriorityInput = document.getElementById("priority-input");
	state.newTodoFolderInput = document.getElementById("folder-input");
	state.submitTodoInput = document.getElementById("submit-todo-input");

	createFolderInputDialog(state.folderInputDialogContainer);
	state.newFolderInput = document.getElementById("new-folder-input-dialog");
	state.newFolderTitleInput = document.getElementById("folder-title-input");
	state.newFolderColorInput = document.getElementById("folder-color-input");
	state.submitFolderInput = document.getElementById("submit-folder-input");

	for (const [key, value] of state.defaultPriority) {
		const newOption = document.createElement("option");
		newOption.value = value;
		newOption.innerText = key;
		state.newTodoPriorityInput.appendChild(newOption);
	}

	state.newTodoBtn.addEventListener("click", () => {
		state.newTodoInput.showModal();
	});

	state.newFolderBtn.addEventListener("click", () => {
		state.newFolderInput.showModal();
	});

	return {
		get state() {
			return state;
		},
		get currentView() {
			return state.currentView;
		},
		set currentView(newView) {
			state.currentView = newView;
		},

		...canCreateTodoDom(state),
		...canCreateFolderDom(state),
		...canUpdateFolderOption(state),
		...canCleanTodoContainer(state),
	};
};
