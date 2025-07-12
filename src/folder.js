const canAddItem = (state) => {
	return {
		addItem: (...item) => state.items.push(...item)
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
	};
};
