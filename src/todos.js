const canPrintOut = (text) => {
	return {
		printOut: () => console.log(text),
	};
};

export const createToDo = (title, description, dueDate, priority) => {
	let state = {
		title,
		description,
		dueDate,
		priority,
        checked: false
	};

	return {
		get title() {
			return state.title;
		},
		get description() {
			return state.description;
		},
		get dueDate() {
			return state.dueDate;
		},
		get priority() {
			return state.priority;
		},
        get checked() {
			return state.checked;
		},

		set title(newTitle) {
			state.title = newTitle;
		},
		set description(newDesc) {
			state.description = newDesc;
		},
		set dueDate(newDueDate) {
			state.dueDate = newDueDate;
		},
		set priority(newPriority) {
			state.priority = newPriority;
		},
		set checked(newChecked) {
			state.checked = newChecked;
		},

		...canPrintOut(state.title),
	};
};
