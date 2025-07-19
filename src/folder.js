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

export const createFolder = (name) => {
	let state = {
		name,
		items: [],
	};

	return {
		get name() {
			return state.name;
		},
		get items() {
			return state.items;
		},

		...canAddItem(state),
		...canDeleteItem(state)
	};
};
