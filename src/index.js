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
    addFolder
} from "./storage.js";

const domControl = initializeDom();

const initializeFolders = () => {
	const folderContainer = getFolderContainer();

	folderContainer.forEach(folder => {
		domControl.createFolderDom(folder, folderContainer);
	});

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
		if (folder) {
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


domControl.state.submitTodoInput.addEventListener("click", () => {
	let todo = addTodo(
		checkTodoTitleInput(domControl.state.newTodoTitleInput.value),
		domControl.state.newTodoDescInput.value,
		domControl.state.newTodoDuedateInput.value,
		checkTodoPriorityInput(domControl.state.newTodoPriorityInput.value),
		domControl.state.newTodoFolderInput.value
	);

	let shouldShowTodo = false;
	const folderContainer = getFolderContainer();
	let storeToFolder = searchFolder(todo.folder, folderContainer);

	if (domControl.currentView === "all") {
		shouldShowTodo = true;
	} else if (domControl.currentView === "today") {
		let todayDate = format(new Date(), "dd/MM/yyyy");
		let todoDate = format(todo.dueDate, "dd/MM/yyyy");
		shouldShowTodo = todoDate === todayDate;
	} else if (domControl.currentView === "tomorrow") {
		let currentDate = new Date();
		let tomorrow = new Date(currentDate);
		tomorrow.setDate(currentDate.getDate() + 1);
		let tomorrowDate = format(tomorrow, "dd/MM/yyyy");
		let todoDate = format(todo.dueDate, "dd/MM/yyyy");
		shouldShowTodo = todoDate === tomorrowDate;
	} else {
		shouldShowTodo = todo.folder === domControl.currentView;
	}

	if (shouldShowTodo) {
		domControl.createTodoDom(
			todo,
			storeToFolder,
			domControl.state.todoList,
			folderContainer
		);
	}
});

domControl.state.submitFolderInput.addEventListener("click", () => {
	let folder = addFolder(
		checkFolderTitleInput(domControl.state.newFolderTitleInput.value),
		domControl.state.newFolderColorInput.value
	);
	const folderContainer = getFolderContainer();
	domControl.createFolderDom(folder, folderContainer);
	domControl.updateFolderOption(folder);
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