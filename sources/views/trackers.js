import {JetView} from "webix-jet";

import serverUrl from "../constants/server";

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
								name: "serial_number",
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
								label: "Автомобиль",
								labelPosition: "top",
								localId: "modelSelect",
								name: "carId",
								required: true
							},
							{height: 10},
							{
								cols: [
									{
										view: "button",
										label: "Отмена",
										click: () => {
											this.clearForm();
											this.refreshLabels();
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
													webix.ajax().patch(`${serverUrl}tracks/${formValues.id}`, formValues).then(() => {
														this.trackersList.updateItem(formValues.id, formValues);
														this.clearForm();
														this.refreshLabels();
													});
												}
												else {
													webix.ajax().post(`${serverUrl}tracks`, formValues).then((res) => {
														const result = res.json();
														this.trackersList.add(result);
														this.clearForm();
														this.refreshLabels();
													});
												}
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
											webix.ajax().del(`${serverUrl}tracks/${selectedTrackers[i]}`).then(() => {
												this.trackersList.remove(selectedTrackers[i]);
											});
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
							id: "serial_number",
							width: 150,
							fillspace: true
						},
						{
							header: "Марка",
							width: 150,
							fillspace: true,
							template: obj => obj.car ? obj.car.model : ""
						},
						{
							header: "Гос.номер",
							id: "stateNumber",
							width: 150,
							fillspace: true,
							template: obj => obj.car ? obj.car.state_number : ""
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
		this.headLabel = this.$$("headLabel");
		this.modelSelect = this.$$("modelSelect");
		this.stateNumbersSelect = this.$$("stateNumberSelect");
		this.trackersList.attachEvent("onCheck", (rowId, colId, state) => {
			if (state === 1) {
				this.selectedTrackers.add(rowId);
			}
			if (state === 0) {
				this.selectedTrackers.delete(rowId);
			}
		});

		webix.ajax().get(`${serverUrl}tracks`).then((res) => {
			const trackers = res.json();
			this.trackersList.parse(trackers);
		});
		webix.ajax().get(`${serverUrl}cars`).then((res) => {
			const cars = res.json();
			const untrackedCars = cars.filter(car => !car.track);
			this.modelSelect.define("options", {
				view: "suggest",
				body: {
					view: "list",
					data: untrackedCars,
					template: "#model#, #state_number#"
				}
			});
		});
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
	}

	refreshLabels(editMode) {
		if (editMode) {
			this.headLabel.define("label", editTrackerText);
			this.modelSelect.disable();
		}
		else {
			this.headLabel.define("label", newTrackerText);
			this.modelSelect.enable();
		}
		this.headLabel.refresh();
	}

	defineDefaultCarOptions(model) {
		if (model) {
			this.modelSelect.define("options", model);
		}
		else {
			this.modelSelect.define("options", []);
		}
		this.modelSelect.refresh();
	}
}
