import "./styles.css";
import { format } from "date-fns";
import { initializeDom } from "./domControl.js";
import {
	checkTodoTitleInput,
	checkTodoPriorityInput,
	checkFolderTitleInput,
	searchFolder,
	showAllItems,
	searchTodoBasedOnDate,
} from "./util.js";
import { 
    getFolderContainer,
    addTodo,
    addFolder,
	clearStorage
} from "./storage.js";

const domControl = initializeDom();

const initializeFolders = () => {
	const folderContainer = getFolderContainer();

	domControl.state.foldersSect.innerHTML = "";

	folderContainer.forEach(folder => {
		domControl.createFolderDom(folder, folderContainer);
	});

	domControl.state.newTodoFolderInput.innerHTML = "";
	for (let folder of folderContainer) {
		domControl.updateFolderOption(folder);
	}

	refreshCurrentView();
};

const refreshCurrentView = () => {
	const folderContainer = getFolderContainer();
	domControl.cleanTodoContainer();
	
	if (domControl.currentView === "all") {
		showAllItems(folderContainer, (todo, folder) => {
			domControl.createTodoDom(todo, folder, domControl.state.todoList, folderContainer);
		}, domControl.state.todoList, folderContainer);
	} else if (domControl.currentView === "today") {
		let todayDate = format(new Date(), "dd/MM/yyyy");
		let todos = searchTodoBasedOnDate(todayDate, folderContainer);
		for (let todo of todos) {
			domControl.createTodoDom(
				todo,
				searchFolder(todo.folder, folderContainer),
				domControl.state.todoList,
				folderContainer
			);
		}
	} else if (domControl.currentView === "tomorrow") {
		let currentDate = new Date();
		let tomorrow = new Date(currentDate);
		tomorrow.setDate(currentDate.getDate() + 1);
		let tomorrowDate = format(tomorrow, "dd/MM/yyyy");
		let todos = searchTodoBasedOnDate(tomorrowDate, folderContainer);
		for (let todo of todos) {
			domControl.createTodoDom(
				todo,
				searchFolder(todo.folder, folderContainer),
				domControl.state.todoList,
				folderContainer
			);
		}
	} else {
		// Folder view
		let folder = searchFolder(domControl.currentView, folderContainer);
		if (folder && folder.items) {
			for (let todo of folder.items) {
				domControl.createTodoDom(
					todo,
					folder,
					domControl.state.todoList,
					folderContainer
				);
			}
		}
	}
};

initializeFolders();

// Listen for todo updates from the edit dialog
window.addEventListener('todoUpdated', (event) => {
	refreshCurrentView();
});

window.addEventListener("folderDeleted", (event) => {
	refreshCurrentView();
});


domControl.state.submitTodoInput.addEventListener("click", () => {
	addTodo(
		checkTodoTitleInput(domControl.state.newTodoTitleInput.value),
		domControl.state.newTodoDescInput.value,
		domControl.state.newTodoDuedateInput.value,
		checkTodoPriorityInput(domControl.state.newTodoPriorityInput.value),
		domControl.state.newTodoFolderInput.value
	);

	initializeFolders();
});

domControl.state.submitFolderInput.addEventListener("click", () => {
	let folder = addFolder(
		checkFolderTitleInput(domControl.state.newFolderTitleInput.value),
		domControl.state.newFolderColorInput.value
	);
	
	initializeFolders();
});

domControl.state.allBtn.addEventListener("click", () => {
	domControl.currentView = "all";
	refreshCurrentView();
});

domControl.state.todayBtn.addEventListener("click", () => {
	domControl.currentView = "today";
	refreshCurrentView();
});

domControl.state.tomorrowBtn.addEventListener("click", () => {
	domControl.currentView = "tomorrow";
	refreshCurrentView();
});