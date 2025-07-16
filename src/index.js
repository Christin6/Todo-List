import "./styles.css";
import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";
import { initializeDom } from "./domControl.js";

const domState = initializeDom()

const todo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "high");
domState.createTodoDom("Buy milk", "Get 2% milk", "2024-01-15", "high");

const todo2 = createToDo("Buy sauce", "Get 2% milk", "2024-01-15", "high");

todo.printOut();

let myTodoList = createFolder("My Todo List");
myTodoList.addItem(todo, todo2);
todo.changeTitle("nex");

console.log(myTodoList.items);
console.log(myTodoList.items[0].title);