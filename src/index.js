import "./styles.css";
import { format } from "date-fns";
import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";
import { initializeDom } from "./domControl.js";

const domControl = initializeDom();

let folderContainer = [];
folderContainer.push(createFolder("inbox", "red"));

const inputChecker = (function () {
	const checkTodoTitleInput = () => {
		if (domControl.state.newTodoTitleInput.value === "") {
			return "New Todo";
		}
		return domControl.state.newTodoTitleInput.value;
	};
	const checkTodoPriorityInput = () => {
		if (domControl.state.newTodoPriorityInput.value === "") {
			return "white";
		}
		return domControl.state.newTodoPriorityInput.value;
	};
	const checkFolderTitleInput = () => {
		if (domControl.state.newFolderTitleInput.value === "") {
			return "New Folder";
		}
		return domControl.state.newFolderTitleInput.value;
	};

    return { checkTodoTitleInput, checkTodoPriorityInput, checkFolderTitleInput };
})();

const searchFolder = (folderName) => {
	for (let i = 0; i < folderContainer.length; i++) {
		if (folderContainer[i].name === folderName) {
			return folderContainer[i];
		}
	}
	console.log("No folder titled " + folderName);
};

const cleanTodoContainer = () => {
	domControl.state.todoList.innerHTML = "";
};

function checkFolderItems() {
	// for debugging
	for (let i = 0; i < folderContainer.length; i++) {
		console.log("Folder " + folderContainer[i].name + " items:");
		for (let p = 0; p < folderContainer[i].items.length; p++) {
			console.log(`${folderContainer[i].items[p].title}`);
		}
	}
}

domControl.state.submitTodoInput.addEventListener("click", () => {
	let item = createToDo(
		inputChecker.checkTodoTitleInput(),
		domControl.state.newTodoDescInput.value,
		domControl.state.newTodoDuedateInput.value,
		inputChecker.checkTodoPriorityInput(),
		domControl.state.newTodoFolderInput.value
	);
	let storeToFolder = searchFolder(item.folder);
	storeToFolder.addItem(item);
	domControl.createTodoDom(item, storeToFolder, domControl.state.todoList);
	checkFolderItems();
});

domControl.state.submitFolderInput.addEventListener("click", () => {
	let folder = createFolder(
		inputChecker.checkFolderTitleInput(),
		domControl.state.newFolderColorInput.value
	);
	folderContainer.push(folder);
	domControl.createFolderDom(folder);
	domControl.updateFolderOption(folder);
});

domControl.state.todayBtn.addEventListener("click", () => {

});

domControl.state.tomorrowBtn.addEventListener("click", () => {

});

(() => {
	let target = document.getElementsByClassName("folder-btn");
	for (let i = 0; i < target.length; i++) {
		target[i].addEventListener("click", () => {
            
        });
	}
})();

// initial/example todo item
const todo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "red");
domControl.createTodoDom(
	todo,
	searchFolder("inbox"),
	domControl.state.todoList
);
searchFolder("inbox").addItem(todo);
