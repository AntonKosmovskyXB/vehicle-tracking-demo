import cards from "../models/cards";

export default function filterCards(formValues, searchValue) {
	if (formValues.model === "") {
		delete formValues.model;
	}
	if (formValues.group === "") {
		delete formValues.group;
	}
	if (formValues.status === "Все") {
		delete formValues.status;
	}
	if (formValues.tracker === "Все") {
		delete formValues.tracker;
	}
	if (searchValue) {
		formValues.stateNumber = searchValue;
	}

	const cardsIds = {
		show: [],
		hide: []
	};

	for (let i = 0; i < cards.length; i++) {
		const keys = Object.keys(formValues);
		keys.forEach((item) => {
			if ((item === "stateNumber" && cards[i].stateNumber.indexOf(searchValue) === -1) || formValues[item] !== cards[i][item]) {
				cardsIds.hide.push(i);
			}
			else if (!cards[i].deleted) {
				cardsIds.show.push(i);
			}
		});
	}

	cardsIds.show.forEach(i => $$(`card${i}`).show());
	cardsIds.hide.forEach(i => $$(`card${i}`).hide());
}
