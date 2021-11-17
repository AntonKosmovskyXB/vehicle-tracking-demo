import {JetView} from "webix-jet";

import drivers from "../models/drivers";

export default class DriversView extends JetView {
	config() {
		const newDriver = {
			view: "form",
			localId: "driverForm",
			css: "newTrackerForm",
			width: 300,
			height: 5000,
			elements: [
				{
					view: "label",
					label: "Новый водитель",
					css: "headLabel"
				},
				{
					view: "text",
					label: "Имя",
					labelPosition: "top",
					name: "name",
					required: true
				},
				{
					view: "text",
					label: "Телефон",
					labelPosition: "top",
					name: "phone",
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
							label: "Сохранить",
							css: "webix_primary",
							click: () => {
								if (this.form.validate()) {
									const formValues = this.form.getValues();
									if (formValues.id) {
										this.driversList.updateItem(formValues.id, formValues);
									}
									else {
										drivers.add(formValues);
									}
									this.form.clear();
									this.form.clearValidation();
								}
								else {
									webix.message("Пожалуйста, заполните все необходимые поля");
								}
							}
						}
					]
				}
			]
		};

		const driversList = {
			minWidth: 700,
			rows: [
				{
					view: "toolbar",
					cols: [
						{
							view: "label",
							label: "Все водители",
							css: "headTableLabel"
						},
						{},
						{
							view: "button",
							label: "Удалить",
							width: 120,
							click: () => {
								const selectedDrivers = Array.from(this.selectedDrivers);
								if (selectedDrivers.length) {
									webix.confirm({
										text: "Удалить всех выбранных водителей?"
									}).then(() => {
										for (let i = 0; i < selectedDrivers.length; i++) {
											drivers.remove(selectedDrivers[i]);
										}
										this.selectedDrivers.clear();
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
								const selectedDriver = this.driversList.getSelectedItem();
								if (selectedDriver) {
									this.form.parse(selectedDriver);
								}
							}
						}
					]
				},
				{
					view: "datatable",
					localId: "driversList",
					borderless: true,
					select: true,
					rowHeight: 45,
					headerRowHeight: 40,
					scroll: "y",
					data: drivers,
					columns: [
						{header: {content: "masterCheckbox", contentId: "selectAll"}, id: "ch", template: "{common.checkbox()}", width: 40},
						{
							header: "Имя",
							id: "name",
							minWidth: 200,
							fillspace: true
						},
						{
							header: "Телефон",
							id: "phone",
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
			cols: [newDriver, {width: 15}, driversList]
		};
	}

	init() {
		this.selectedDrivers = new Set();
		this.form = this.$$("driverForm");
		this.driversList = this.$$("driversList");

		this.driversList.attachEvent("onCheck", (rowId, colId, state) => {
			if (state === 1) {
				this.selectedDrivers.add(rowId);
			}
			if (state === 0) {
				this.selectedDrivers.delete(rowId);
			}
		});
	}
}
