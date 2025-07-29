import { createToDo } from "./todos.js";
import { createFolder } from "./folder.js";

const STORAGE_KEYS = {
    FOLDERS: "todoApp_folders"
};

export const getFolderContainer = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FOLDERS);
        if (!stored) { // initialize with "inbox" folder if nothing exists yet
            const defaultFolder = createFolder("📬 Inbox", "red");
            const exampleTodo = createToDo("Buy milk", "Get 2% milk", "2024-01-15", "red", "📬 Inbox");
            defaultFolder.addItem(exampleTodo);

            const initialData = [defaultFolder];
            saveFolderContainer(initialData);
            return initialData;
        }

        const foldersData = JSON.parse(stored);
        const folderContainer = [];

        foldersData.forEach(folderData => {
            const folder = createFolder(folderData.name, folderData.color);
            
            folderData.items.forEach(
                todoData => {
                    const todo = createToDo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority,
                    todoData.folder
                );
                todo.checked = todoData.checked;
                folder.addItem(todo);
                }
            );

            folderContainer.push(folder);
        });
        return folderContainer;
    } catch (error) {
        console.error("Error loading folders from localStorage:", error);
        // return default folder on error
        const defaultFolder = createFolder("📬 Inbox", "red");
        return [defaultFolder];
    }
};

export const saveFolderContainer = (folderContainer) => {
    try {
        const foldersData = folderContainer.map(folder => ({
            name: folder.name,
            color: folder.color,
            items: folder.items.map(todo => ({
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate.toISOString(),
                priority: todo.priority,
                checked: todo.checked,
                folder: todo.folder
            }))
        }));
        localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(foldersData));
    } catch (error) {
        console.error('Error saving folders to localStorage:', error);
    }
};

let saveTimeout;
export const autoSave = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout( () => {
        const folderContainer = getFolderContainer();
        saveFolderContainer(folderContainer);
    }, 500); // autosave every 500 ms
};

export const addTodo = (title, description, dueDate, priority, folderName) => {
    const folderContainer = getFolderContainer();
    const todo = createToDo(title, description, dueDate, priority, folderName);

    const targetFolder = folderContainer.find(folder => folder.name === folderName);
    if (targetFolder) {
        targetFolder.addItem(todo);
        saveFolderContainer(folderContainer);
    }

    return todo;
};

export const addFolder = (name, color) => {
    const folderContainer = getFolderContainer();
    const folder = createFolder(name, color);
    folderContainer.push(folder);
    saveFolderContainer(folderContainer);
    return folder;
};

export const deleteTodo = (todoToDelete) => {
    const folderContainer = getFolderContainer();

    for (let folder of folderContainer) {
        const todoIndex = folder.items.findIndex(
            todo => todo.title === todoToDelete.title && 
            todo.dueDate.getTime() === todoToDelete.dueDate.getTime()
        );
        if (todoIndex !== -1) {
            folder.items.splice(todoIndex, 1);
            saveFolderContainer(folderContainer);
            break;
        }
    }
};

export const updateTodoChecked = (todoToUpdate, newCheckedStatus) => {
    const folderContainer = getFolderContainer();

    for (let folder of folderContainer) {
        const todo = folder.items.find(todo => 
            todo.title === todoToUpdate.title && 
            todo.dueDate.getTime() === todoToUpdate.dueDate.getTime()
        );
        if (todo) {
            todo.checked = newCheckedStatus;
            saveFolderContainer(folderContainer);
            break;
        }
    }
};

// for edit functionality
export const updateTodo = (oldTodo, newData) => {
    const folderContainer = getFolderContainer();
    
    let oldFolder = null;
    for (let folder of folderContainer) {
        const todoIndex = folder.items.findIndex(todo => 
            todo.title === oldTodo.title && 
            todo.dueDate.getTime() === oldTodo.dueDate.getTime()
        );
        if (todoIndex !== -1) {
            folder.items.splice(todoIndex, 1);
            oldFolder = folder;
            break;
        }
    }
    
    const updatedTodo = createToDo(
        newData.title,
        newData.description,
        newData.dueDate,
        newData.priority,
        newData.folder
    );
    updatedTodo.checked = newData.checked;
    
    const newFolder = folderContainer.find(folder => folder.name === newData.folder);
    if (newFolder) {
        newFolder.addItem(updatedTodo);
    }
    
    saveFolderContainer(folderContainer);
    return { updatedTodo, oldFolder: oldFolder?.name, newFolder: newFolder?.name };
};

export const clearStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.FOLDERS);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};