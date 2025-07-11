const canPrintOut = (text) => {
    return {
        printOut: () => console.log(text)
    };
};

export const createToDo = (title, description, dueDate, priority, notes) => {
    let state = {
        title,
        description, 
        dueDate, 
        folder, 
        priority, 
        notes
    };
    return {
        ...state,
        ...canPrintOut(state.title)
    }
};