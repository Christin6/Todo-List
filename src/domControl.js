import { format } from "date-fns";

const canCreateTodoDom = (state) => {
	return {
		createTodoDom: (todo, folder) => {
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

			let delBtn = document.createElement("button");
			delBtn.classList.add("todo-del-btn");
			delBtn.innerHTML = "🗑️";

			let div = document.createElement("div");
			div.classList.add("todo-info-div");
			div.append(titleP, descP, dueDateP);

			let container = document.createElement("div");
			container.classList.add("todo-container");
			container.append(checkBox, div, delBtn);

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

			delBtn.addEventListener("click", () => {
				folder.deleteItem(todo);
				state.todoList.removeChild(container);
			});

			state.todoList.appendChild(container);
		}
	};
};

const canCreateFolderDom = (state) => {
	return {
		createFolderDom: (folder) => {
			let titleBtn = document.createElement("button");
			titleBtn.id = `${folder.name}-btn`;
			titleBtn.innerText = folder.name;

			titleBtn.style.borderLeft = `5px solid ${folder.color}`;

			state.foldersSect.appendChild(titleBtn);
		}
	};
};

const createTodoInputDialog = (target) => {
	const dialog = `<dialog role="dialog" id="new-todo-input-dialog">
                <input type="text" name="title" id="title-input" placeholder="Title">
                <input type="text" name="desc" id="desc-input" placeholder="Description">
                <input type="datetime-local" name="due-date" id="duedate-input" value=${format(Date(), "yyyy-MM-dd")}T${format(Date(), "HH:mm")}>
                <select name="priority" id="priority-input">
                    <option value="">--Select the priority--</option>
                </select>
				<select name="todo-folder" id="folder-input">
                    <option value="inbox">Inbox</option>
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
		}
	}
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

		...canCreateTodoDom(state),
		...canCreateFolderDom(state),
		...canUpdateFolderOption(state)
	};
};
