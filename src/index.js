import "./styles.css";
import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";
import { initializeDom } from "./domControl.js";

const domState = initializeDom();

const checkTitleInput = () => {
    if (domState.state.newTodoTitleInput.value === "") {
        return "New Todo"
    };
    return domState.state.newTodoTitleInput.value
};

const checkPriorityInput = () => {
    if (domState.state.newTodoPriorityInput.value === "") {
        return "white"
    };
    return domState.state.newTodoPriorityInput.value
};

let folderContainer = [];
folderContainer.push(createFolder("test"));

const todo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "red");
domState.createTodoDom(todo, folderContainer[0]);

domState.state.submitTodoInput.addEventListener("click", () => {

    let item = createToDo(
        checkTitleInput(), 
        domState.state.newTodoDescInput.value, 
        domState.state.newTodoDuedateInput.value, 
        checkPriorityInput()
    );
    folderContainer[0].addItem(item);
    domState.createTodoDom(item, folderContainer[0]);
});