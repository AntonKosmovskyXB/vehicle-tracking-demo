export default function filterCards() {
	const formValues = $$("filterForm").getValues();
	const searchValue = $$("numberSearch").getValue()
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

	for (let i = 0; i < cards.length; i++) {
		if (!cards[i].deleted) {
			$$(`card${i}`).show();
		}
		const keys = Object.keys(formValues);
		keys.forEach(item => {
			if (item === "stateNumber") {
				cards[i].stateNumber.indexOf(searchValue) === -1 ? $$(`card${i}`)?.hide() : "";
			}
			else {
				if (formValues[item] !== cards[i][item]) {
					$$(`card${i}`)?.hide();
				}
			}
		});
	}
}

