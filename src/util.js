import { format } from "date-fns";

export const checkTodoTitleInput = (target) => {
	if (target === "") {
		return "New Todo";
	}
	return target;
};
export const checkTodoPriorityInput = (target) => {
	if (target === "") {
		return "white";
	}
	return target;
};
export const checkFolderTitleInput = (target) => {
	if (target === "") {
		return "New Folder";
	}
	return target;
};

export const searchFolder = (folderName, container) => { // get folder from container
	for (let i = 0; i < container.length; i++) {
		if (container[i].name === folderName) {
			return container[i];
		}
	}
	console.log("No folder titled " + folderName);
};

export const searchTodoBasedOnDate = (dateToSearch, container) => {
    let todo = [];
    for (let i = 0; i < container.length; i++) {
        for (let p=0; p < container[i].items.length; p++) {
            if (format(container[i].items[p].dueDate, "dd/MM/yyyy") === dateToSearch) {
                todo.push(container[i].items[p]);
            }
        }
	}
    return todo;
};

export const searchTodoBasedOnFolder = (folderName, container) => {
    let folder = searchFolder(folderName, container);
    if (folder) {
        return folder.items;
    }
    return [];
};

export function showAllItems(target, fun, dom) {
	for (let i = 0; i < target.length; i++) {
		for (let p = 0; p < target[i].items.length; p++) {
			fun(target[i].items[p], target[i], dom);
		}
	}
}
