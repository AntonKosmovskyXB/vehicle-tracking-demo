import {JetView} from "webix-jet";
import serverUrl from "../constants/server";

const editDriverText = "Редактировать данные";
const newDriverText = "Новый водитель";

export default class DriversView extends JetView {
	config() {
		const newDriver = {
			view: "form",
			localId: "driverForm",
			css: "newCarsForm",
			paddingY: 9,
			paddingX: 13,
			width: 262,
			rules: {
				email: webix.rules.isEmail
			},
			elements: [
				{
					view: "label",
					label: "Новый водитель",
					css: "headLabel",
					localId: "headLabel"
				},
				{
					view: "scrollview",
					scroll: "y",
					css: "carMenuScroll",
					width: 290,
					body: {
						rows: [{
							view: "text",
							label: "Имя",
							labelPosition: "top",
							name: "firstName",
							required: true
						},
						{height: 10},
						{
							view: "text",
							label: "Фамилия",
							labelPosition: "top",
							name: "lastName",
							required: true
						},
						{height: 10},
						{
							view: "text",
							label: "Телефон",
							labelPosition: "top",
							name: "phoneNumber",
							required: true
						},
						{height: 10},
						{
							view: "text",
							label: "Почта",
							labelPosition: "top",
							name: "email",
							required: true
						},
						{height: 10},
						{
							view: "text",
							label: "Пароль",
							type: "password",
							labelPosition: "top",
							name: "password",
							required: true
						},
						{height: 20},
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
											formValues.role = "Driver";
											formValues.companyId = 1;
											if (formValues.id) {
												this.driversList.updateItem(formValues.id, formValues);
											}
											else {
												webix.ajax().post(`${serverUrl}users`, formValues).then((res) => {
													const result = res.json();
													this.driversList.add(result);
												});
											}
											this.clearForm();
											this.refreshLabels();
										}
										else {
											webix.message("Пожалуйста, заполните все необходимые поля");
										}
									}
								}
							]
						}]
					}
				}
			]
		};

		const driversList = {
			minWidth: 700,
			rows: [
				{
					view: "toolbar",
					css: "datatableToolbar",
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
							width: 102,
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
								else {
									webix.message("Пожалуйста, отметьте водителей, которых вы хотите удалить");
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
								const selectedDriver = this.driversList.getSelectedItem();
								if (selectedDriver) {
									this.form.parse(selectedDriver);
									this.refreshLabels("edit");
								}
								else {
									webix.message("Пожалуйста выберите водителя для редактирования");
								}
							}
						},
						{width: 7}
					]
				},
				{
					view: "datatable",
					localId: "driversList",
					css: "carsDatatable",
					borderless: true,
					select: true,
					rowHeight: 36,
					headerRowHeight: 44,
					scroll: "y",
					columns: [
						{header: {content: "masterCheckbox", contentId: "selectAll"}, id: "ch", template: "{common.checkbox()}", width: 40},
						{
							header: "Имя",
							id: "name",
							minWidth: 200,
							fillspace: true,
							template: obj => `${obj.firstName} ${obj.lastName}`
						},
						{
							header: "Телефон",
							id: "phoneNumber",
							width: 150,
							fillspace: true
						},
						{
							header: "Почта",
							id: "email",
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
			cols: [newDriver, {width: 15}, driversList]
		};
	}

	init() {
		this.selectedDrivers = new Set();
		this.form = this.$$("driverForm");
		this.driversList = this.$$("driversList");
		this.headLabel = this.$$("headLabel");
		this.driversList.attachEvent("onCheck", (rowId, colId, state) => {
			if (state === 1) {
				this.selectedDrivers.add(rowId);
			}
			if (state === 0) {
				this.selectedDrivers.delete(rowId);
			}
		});
		webix.ajax().get(`${serverUrl}users`).then((res) => {
			const result = res.json();
			const drivers = result.filter(item => item.role === "Driver");
			this.driversList.parse(drivers);
		});
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
	}

	refreshLabels(editMode) {
		if (editMode) {
			this.headLabel.define("label", editDriverText);
		}
		else {
			this.headLabel.define("label", newDriverText);
		}

		this.headLabel.refresh();
	}
}
