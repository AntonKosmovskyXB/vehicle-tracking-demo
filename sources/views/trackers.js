import {JetView} from "webix-jet";

import cars from "../models/cars";
import trackers from "../models/trackers";

const editTrackerText = "Редактировать трекер";
const newTrackerText = "Новый трекер";

export default class TrackersView extends JetView {
	config() {
		const newTracker = {
			view: "form",
			localId: "trackerForm",
			css: "newTrackerForm",
			width: 262,
			margin: 0,
			paddingY: 9,
			paddingX: 13,
			elements: [
				{
					view: "label",
					label: "Новый трекер",
					css: "headLabel",
					localId: "headLabel"
				},
				{
					view: "scrollview",
					scroll: "y",
					css: "carMenuScroll",
					width: 290,
					body: {
						rows: [
							{height: 7},
							{
								view: "richselect",
								options: ["Глонасс", "GPS"],
								label: "Тип",
								placeholder: "Выбрать",
								labelPosition: "top",
								name: "type",
								required: true
							},
							{height: 10},
							{
								view: "text",
								label: "Модель",
								labelPosition: "top",
								name: "model",
								required: true
							},
							{height: 15},
							{
								view: "text",
								label: "Серийный номер",
								labelPosition: "top",
								name: "serialNumber",
								required: true
							},
							{height: 25},
							{
								view: "label",
								css: "headLabel",
								label: "Прикрепить к транспорту"
							},
							{height: 7},
							{
								view: "richselect",
								options: [],
								label: "Марка автомобиля",
								labelPosition: "top",
								localId: "modelSelect",
								name: "brand",
								required: true,
								on: {
									onChange: (value) => {
										let numbersList;
										if (value) {
											numbersList = cars.serialize()
												.filter(elem => elem.model === value && !elem.tracker)
												.map(elem => elem.stateNumber);
										}
										else {
											numbersList = cars.serialize().filter(elem => !elem.tracker)
												.map(elem => elem.stateNumber);
										}

										this.defineDefaultCarOptions(null, numbersList);
									}
								}
							},
							{height: 10},
							{
								view: "richselect",
								options: [],
								localId: "stateNumberSelect",
								label: "Гос.номер",
								labelPosition: "top",
								name: "stateNumber",
								required: true
							},
							{height: 33},
							{
								cols: [
									{
										view: "button",
										label: "Отмена",
										click: () => {
											this.clearForm();
											this.refreshLabels();
											this.getCurrentCarsInfo();
										}
									},
									{width: 7},
									{
										view: "button",
										label: "Сохранить",
										css: "webix_primary",
										click: () => {
											if (this.form.validate()) {
												const formValues = this.form.getValues();
												if (formValues.id) {
													this.trackersList.updateItem(formValues.id, formValues);
												}
												else {
													trackers.add(formValues);
												}
												const selectedCar = cars
													.find(elem => elem.stateNumber === formValues.stateNumber);

												if (selectedCar) {
													selectedCar[0].tracker = formValues.type;
												}

												this.clearForm();
												this.refreshLabels();
												this.getCurrentCarsInfo();
											}
											else {
												webix.message("Пожалуйста, заполните все необходимые поля");
											}
										}
									}
								]
							}
						]
					}
				}
			]
		};

		const trackersList = {
			minWidth: 700,
			rows: [
				{
					view: "toolbar",
					css: "datatableToolbar",
					cols: [
						{
							view: "label",
							label: "Все трекеры",
							css: "headTableLabel"
						},
						{},
						{
							view: "button",
							label: "Удалить",
							width: 102,
							click: () => {
								const selectedTrackers = Array.from(this.selectedTrackers);
								if (selectedTrackers.length) {
									webix.confirm({
										text: "Удалить все выбранные трекеры?"
									}).then(() => {
										for (let i = 0; i < selectedTrackers.length; i++) {
											trackers.remove(selectedTrackers[i]);
										}
										this.selectedTrackers.clear();
									});
								}
								else {
									webix.message("Пожалуйста, отметьте трекеры, которые вы хотите удалить");
								}
							}
						},
						{
							view: "button",
							label: "Редактировать",
							width: 154,
							css: "webix_primary",
							click: () => {
								this.clearForm();
								const selectedTracker = this.trackersList.getSelectedItem();
								if (selectedTracker) {
									this.form.parse(selectedTracker);
									this.refreshLabels("edit");
								}
								else {
									webix.message("Пожалуйста, выберите трекер для редактирования");
								}
							}
						},
						{width: 7}
					]
				},
				{
					view: "datatable",
					localId: "trackersList",
					css: "carsDatatable",
					borderless: true,
					select: true,
					rowHeight: 36,
					headerRowHeight: 44,
					scroll: true,
					data: trackers,
					columns: [
						{header: {content: "masterCheckbox", contentId: "selectAll"}, id: "ch", template: "{common.checkbox()}", width: 40},
						{
							header: "Тип",
							id: "type",
							minWidth: 150,
							fillspace: true
						},
						{
							header: "Модель",
							id: "model",
							width: 150,
							fillspace: true
						},
						{
							header: "Серийный номер",
							id: "serialNumber",
							width: 150,
							fillspace: true
						},
						{
							header: "Марка",
							id: "brand",
							width: 150,
							fillspace: true
						},
						{
							header: "Гос.номер",
							id: "stateNumber",
							width: 150,
							fillspace: true
						}
					]
				}
			]
		};

		return {
			paddingX: 16,
			paddingY: 16,
			cols: [newTracker, {width: 15}, trackersList]
		};
	}

	init() {
		this.selectedTrackers = new Set();
		this.form = this.$$("trackerForm");
		this.trackersList = this.$$("trackersList");
		this.trackersList.attachEvent("onCheck", (rowId, colId, state) => {
			if (state === 1) {
				this.selectedTrackers.add(rowId);
			}
			if (state === 0) {
				this.selectedTrackers.delete(rowId);
			}
		});

		const modelsList = cars.serialize().filter(elem => !elem.tracker).map(elem => elem.model);
		const stateNumbersList = cars.serialize()
			.filter(elem => !elem.tracker).map(elem => elem.stateNumber);
		this.defineDefaultCarOptions(modelsList, stateNumbersList);
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
	}

	refreshLabels(editMode) {
		if (editMode) {
			this.$$("headLabel").define("label", editTrackerText);
			this.$$("headLabel").refresh();
			this.$$("modelSelect").disable();
			this.$$("stateNumberSelect").disable();
		}
		else {
			this.$$("headLabel").define("label", newTrackerText);
			this.$$("headLabel").refresh();
			this.$$("modelSelect").enable();
			this.$$("stateNumberSelect").enable();
		}
	}

	defineDefaultCarOptions(model, number) {
		if (model) {
			this.$$("modelSelect").define("options", model);
		}
		if (number) {
			this.$$("stateNumberSelect").define("options", number);
		}
		if (!model && !number) {
			this.$$("modelSelect").define("options", []);
			this.$$("stateNumberSelect").define("options", []);
		}
		this.$$("modelSelect").refresh();
		this.$$("stateNumberSelect").refresh();
	}

	getCurrentCarsInfo() {
		const modelsList = cars.serialize().filter(elem => !elem.tracker).map(elem => elem.model);
		const stateNumbersList = cars.serialize()
			.filter(elem => !elem.tracker).map(elem => elem.stateNumber);
		this.defineDefaultCarOptions(modelsList, stateNumbersList);
	}
}
