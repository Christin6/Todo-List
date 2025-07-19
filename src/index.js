import "./styles.css";
import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";
import { initializeDom } from "./domControl.js";

const domState = initializeDom();

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

let folderContainer = [];
folderContainer.push(createFolder("test", "red"));

const todo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "red");
domState.createTodoDom(todo, folderContainer[0]);

domState.state.submitTodoInput.addEventListener("click", () => {
    let item = createToDo(
        checkTodoTitleInput(), 
        domState.state.newTodoDescInput.value, 
        domState.state.newTodoDuedateInput.value, 
        checkTodoPriorityInput()
    );
    folderContainer[0].addItem(item);
    domState.createTodoDom(item, folderContainer[0]);
});

domState.state.submitFolderInput.addEventListener("click", () => {
    let item = createFolder(
        checkFolderTitleInput(),
        domState.state.newFolderColorInput.value
    );
    folderContainer.push(item);
    domState.createFolderDom(item);
});