const canPrintOut = (text) => {
	return {
		printOut: () => console.log(text),
	};
};

const canChangeTitle = (state) => {
	return {
		changeTitle: (newTitle) => state.title = newTitle,
	};
};

const canChangeDescription = (state) => {
	return {
		changeDescription: (newDesc) => state.description = newDesc,
	};
};

const canChangeDueDate = (state) => {
	return {
		changeDueDate: (newDueDate) => state.dueDate = newDueDate,
	};
};

const canChangePriority = (state) => {
	return {
		changePriority: (newPriority) => state.priority = newPriority,
	};
};

const canChangeNotes = (state) => {
	return {
		changeNotes: (newNotes) => state.notes = newNotes,
	};
};

export const createToDo = (title, description, dueDate, priority, notes) => {
	let state = {
		title,
		description,
		dueDate,
		priority,
		notes,
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
		get notes() {
			return state.notes;
		},
        get checked() {
			return state.checked;
		},

		...canChangeTitle(state),
		...canChangeDescription(state),
		...canChangeDueDate(state),
		...canChangePriority(state),
		...canChangeNotes(state),

		...canPrintOut(state.title),
	};
};
