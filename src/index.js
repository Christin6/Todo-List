import "./styles.css";
import { format } from "date-fns";
import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";
import { initializeDom } from "./domControl.js";

const domState = initializeDom();

let folderContainer = [];
folderContainer.push(createFolder("inbox", "red"));

const checkTodoTitleInput = () => {
    if (domState.state.newTodoTitleInput.value === "") {
        return "New Todo"
    };
    return domState.state.newTodoTitleInput.value
};

const checkTodoPriorityInput = () => {
    if (domState.state.newTodoPriorityInput.value === "") {
        return "white"
    };
    return domState.state.newTodoPriorityInput.value
};

const checkFolderTitleInput = () => {
    if (domState.state.newFolderTitleInput.value === "") {
        return "New Folder"
    }
    return domState.state.newFolderTitleInput.value
};

const searchFolder = (folderName) => {
    for (let folder of folderContainer) {
        if (folder.name === folderName) {
            return folder
        }
    }
    console.log("No folder titled " + folderName);
};

function checkFolderItems() { // for debugging
    for (let folder of folderContainer) {
        console.log("Folder " + folder.name + " items:")
        for (let item of folder.items) {
            console.log(`${item.title}`);
        }
    }
}

domState.state.submitTodoInput.addEventListener("click", () => {
    let item = createToDo(
        checkTodoTitleInput(), 
        domState.state.newTodoDescInput.value, 
        domState.state.newTodoDuedateInput.value, 
        checkTodoPriorityInput(),
        domState.state.newTodoFolderInput.value
    );
    let storeToFolder = searchFolder(item.folder);
    storeToFolder.addItem(item);
    domState.createTodoDom(item, storeToFolder);
    checkFolderItems();
});

domState.state.submitFolderInput.addEventListener("click", () => {
    let folder = createFolder(
        checkFolderTitleInput(),
        domState.state.newFolderColorInput.value
    );
    folderContainer.push(folder);
    domState.createFolderDom(folder);
    domState.updateFolderOption(folder);
});

// initial/example todo item
const todo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "red");
domState.createTodoDom(todo, folderContainer[0]);