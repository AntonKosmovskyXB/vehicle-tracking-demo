import {JetView} from "webix-jet";

import cars from "../models/cars";
import trackers from "../models/trackers";

export default class TrackersView extends JetView {
	config() {
		const newTracker = {
			view: "form",
			localId: "trackerForm",
			css: "newTrackerForm",
			width: 300,
			height: 1500,
			elements: [
				{
					view: "label",
					label: "Новый трекер",
					css: "headLabel"
				},
				{
					view: "combo",
					options: ["Глонасс", "GPS"],
					label: "Тип",
					labelPosition: "top",
					name: "type",
					required: true
				},
				{
					view: "text",
					label: "Модель",
					labelPosition: "top",
					name: "model",
					required: true
				},
				{
					view: "text",
					label: "Серийный номер",
					labelPosition: "top",
					name: "serialNumber",
					required: true
				},
				{
					view: "label",
					css: "headLabel",
					label: "Прикрепить к транспорту"
				},
				{
					view: "combo",
					options: ["Volvo", "Man", "Scania"],
					label: "Марка автомобиля",
					labelPosition: "top",
					name: "brand",
					required: true
				},
				{
					view: "combo",
					options: [],
					localId: "stateNumberSelect",
					label: "Гос.номер",
					labelPosition: "top",
					name: "stateNumber",
					required: true
				},
				{
					cols: [
						{
							view: "button",
							label: "Отмена",
							click: () => {
								this.form.clear();
								this.form.clearValidation();
							}
						},
						{
							view: "button",
							label: "Добавить",
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
									this.form.clear();
									this.form.clearValidation();
								}
								else {
									webix.message("Please, fill all fields in the form");
								}
							}
						}
					]
				}
			]
		};

		const trackersList = {
			minWidth: 700,
			rows: [
				{
					view: "toolbar",
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
							width: 120,
							click: () => {
								const selectedTrackers = Array.from(this.selectedTrackers);
								if (selectedTrackers.length) {
									webix.confirm({
										text: "Удалить все выбранные трекеры?"
									}).then(() => {
										for (let i = 0; i < selectedTrackers.length; i++) {
											trackers.remove(selectedTrackers[i]);
											this.selectedTrackers.delete(selectedTrackers[i]);
										}
									});
								}
							}
						},
						{
							view: "button",
							label: "Редактировать",
							width: 200,
							css: "webix_primary",
							click: () => {
								this.form.clear();
								this.form.clearValidation();
								const selectedTracker = this.trackersList.getSelectedItem();
								this.form.parse(selectedTracker);
							}
						}
					]
				},
				{
					view: "datatable",
					localId: "trackersList",
					borderless: true,
					select: true,
					rowHeight: 45,
					headerRowHeight: 40,
					scroll: "y",
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
			paddingX: 15,
			paddingY: 15,
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

		const stateNumbersList = cars.serialize().map(elem => elem.stateNumber);
		this.$$("stateNumberSelect").define("options", stateNumbersList);
	}
}
