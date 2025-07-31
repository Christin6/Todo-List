const canAddItem = (state) => {
	return {
		addItem: (...item) => state.items.push(...item),
	};
};

const canDeleteItem = (state) => {
	return {
		deleteItem: (itemToRemove) => {
			const index = state.items.findIndex(
				(item) => item === itemToRemove
			);
			if (index !== -1) {
				state.items.splice(index, 1);
			}
		},
	};
};

export const createFolder = (name, color) => {
	let state = {
		name,
		color,
		items: [],
	};

	return {
		get name() {
			return state.name;
		},
		get items() {
			return state.items;
		},
		get color() {
			return state.color;
		},

		set name(newName) {
			state.name = newName;
		},
		set color(newColor) {
			state.color = newColor;
		},

		...canAddItem(state),
		...canDeleteItem(state)
	};
};
