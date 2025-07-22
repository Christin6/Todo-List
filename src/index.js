import "./styles.css";
import { format } from "date-fns";
import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";
import { initializeDom } from "./domControl.js";
import {
	checkTodoTitleInput,
	checkTodoPriorityInput,
	checkFolderTitleInput,
	searchFolder,
	showAllItems,
	searchTodoBasedOnDate,
} from "./util.js";

const domControl = initializeDom();

let folderContainer = [];
folderContainer.push(createFolder("📬 Inbox", "red"));
domControl.createFolderDom(folderContainer[0], folderContainer)

domControl.state.submitTodoInput.addEventListener("click", () => {
	let item = createToDo(
		checkTodoTitleInput(domControl.state.newTodoTitleInput.value),
		domControl.state.newTodoDescInput.value,
		domControl.state.newTodoDuedateInput.value,
		checkTodoPriorityInput(domControl.state.newTodoPriorityInput.value),
		domControl.state.newTodoFolderInput.value
	);
	let shouldShowTodo = false;

	let storeToFolder = searchFolder(item.folder, folderContainer);
	storeToFolder.addItem(item);

	if (domControl.currentView === "all") {
		shouldShowTodo = true;
	} else if (domControl.currentView === "today") {
		let todayDate = format(new Date(), "dd/MM/yyyy");
		let todoDate = format(item.dueDate, "dd/MM/yyyy");
		shouldShowTodo = todoDate === todayDate;
	} else if (domControl.currentView === "tomorrow") {
		let currentDate = new Date();
		let tomorrow = new Date(currentDate);
		tomorrow.setDate(currentDate.getDate() + 1);
		let tomorrowDate = format(tomorrow, "dd/MM/yyyy");
		let todoDate = format(item.dueDate, "dd/MM/yyyy");
		shouldShowTodo = todoDate === tomorrowDate;
	} else {
		shouldShowTodo = item.folder === domControl.currentView;
	}

	if (shouldShowTodo) {
		domControl.createTodoDom(
			item,
			storeToFolder,
			domControl.state.todoList
		);
	}
});

domControl.state.submitFolderInput.addEventListener("click", () => {
	let folder = createFolder(
		checkFolderTitleInput(domControl.state.newFolderTitleInput.value),
		domControl.state.newFolderColorInput.value
	);
	folderContainer.push(folder);
	domControl.createFolderDom(folder, folderContainer);
	domControl.updateFolderOption(folder);
});

domControl.state.allBtn.addEventListener("click", () => {
	domControl.currentView = "all";
	domControl.cleanTodoContainer();
	showAllItems(folderContainer, domControl.createTodoDom, domControl.state.todoList);
});

domControl.state.todayBtn.addEventListener("click", () => {
	domControl.currentView = "today";
	domControl.cleanTodoContainer();
	let todo = searchTodoBasedOnDate(
		format(new Date(), "dd/MM/yyyy"),
		folderContainer
	);
	for (let i = 0; i < todo.length; i++) {
		domControl.createTodoDom(
			todo[i],
			searchFolder(todo[i].folder, folderContainer),
			domControl.state.todoList
		);
	}
});

domControl.state.tomorrowBtn.addEventListener("click", () => {
	domControl.currentView = "tomorrow";
	domControl.cleanTodoContainer();
	let currentDate = new Date();
	let tomorrow = currentDate.setDate(currentDate.getDate() + 1);
	let todo = searchTodoBasedOnDate(
		format(tomorrow, "dd/MM/yyyy"),
		folderContainer
	);
	for (let i = 0; i < todo.length; i++) {
		domControl.createTodoDom(
			todo[i],
			searchFolder(todo[i].folder, folderContainer),
			domControl.state.todoList
		);
	}
});

// initial/example todo item
const todo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "red");
domControl.createTodoDom(
	todo,
	searchFolder("📬 Inbox", folderContainer),
	domControl.state.todoList
);
searchFolder("📬 Inbox", folderContainer).addItem(todo);
