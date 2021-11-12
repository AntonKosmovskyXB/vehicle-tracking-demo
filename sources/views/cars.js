import {JetView} from "webix-jet";

import cars from "../models/cars";

export default class CarsView extends JetView {
	config() {
		const newTracker = {
			view: "form",
			localId: "carsForm",
			css: "newTrackerForm",
			width: 300,
			height: 1500,
			elements: [
				{
					view: "label",
					label: "Новый автомобиль",
					css: "headLabel"
				},
				{
					localId: "carPhoto",
					css: "carPhoto",
					width: 270,
					height: 200,
					borderless: true,
					template: obj => `<div class="car-photo"><img src=${obj.Photo || "../sources/assets/photo/default.png"}></div>`
				},
				{
					view: "uploader",
					localId: "photoUploader",
					value: "Загрузить фото",
					autosend: false,
					on: {
						onBeforeFileAdd: (obj) => {
							const reader = new FileReader();
							reader.readAsDataURL(obj.file);
							reader.onloadend = () => {
								this.$$("carPhoto").setValues({Photo: reader.result});
							};
							return false;
						}
					}
				},
				{
					view: "combo",
					options: ["Volvo", "Man", "Scania"],
					label: "Марка автомобиля",
					labelPosition: "top",
					name: "model",
					required: true
				},
				{
					view: "text",
					label: "Гос.номер",
					labelPosition: "top",
					name: "stateNumber",
					required: true
				},
				{
					view: "counter",
					label: "Масса (т)",
					name: "weight",
					labelWidth: 90,
					required: true
				},
				{
					view: "combo",
					options: ["Автоцистерна", "Фургон", "Рефрижератор", "Бортовой"],
					label: "Группа",
					labelPosition: "top",
					name: "group",
					required: true
				},
				{
					view: "combo",
					label: "Количество осей",
					options: ["Двухосные", "Трехосные"],
					labelPosition: "top"
				},
				{
					view: "combo",
					label: "Состав",
					options: ["Автомобиль-прицеп", "Одиночное транспортное средство"],
					labelPosition: "top",
					name: "squad",
					required: true
				},
				{
					view: "combo",
					label: "Грузоподъемность",
					options: ["От 1,5 до 16 тонн", "Свыше 16 тонн"],
					labelPosition: "top",
					name: "capacity",
					required: true
				},
				{
					cols: [
						{
							view: "button",
							label: "Отмена",
							click: () => {
								this.clearForm();
							}
						},
						{
							view: "button",
							label: "Добавить",
							css: "webix_primary",
							click: () => {
								if (this.form.validate()) {
									const formValues = this.form.getValues();
									formValues.photo = this.$$("carPhoto").getValues().Photo;
									if (formValues.id) {
										this.carsList.updateItem(formValues.id, formValues);
									}
									else {
										cars.add(formValues);
									}
									this.clearForm();
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

		const carsList = {
			minWidth: 700,
			rows: [
				{
					view: "toolbar",
					cols: [
						{
							view: "label",
							label: "Все автомобили",
							css: "headTableLabel"
						},
						{},
						{
							view: "button",
							label: "Удалить",
							width: 120,
							click: () => {
								const selectedCars = Array.from(this.selectedCars);
								if (selectedCars.length) {
									webix.confirm({
										text: "Удалить все выбранные автомобили?"
									}).then(() => {
										for (let i = 0; i < selectedCars.length; i++) {
											cars.remove(selectedCars[i]);
											this.selectedCars.delete(selectedCars[i]);
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
								this.clearForm();
								const selectedCar = this.carsList.getSelectedItem();
								this.form.parse(selectedCar);
								this.$$("carPhoto").setValues({Photo: selectedCar.photo});
								return false;
							}
						}
					]
				},
				{
					view: "datatable",
					localId: "carsList",
					borderless: true,
					rowHeight: 45,
					headerRowHeight: 40,
					scroll: "y",
					data: cars,
					select: true,
					columns: [
						{
							header: {content: "masterCheckbox", contentId: "selectAll"},
							id: "ch",
							template: "{common.checkbox()}",
							width: 40
						},
						{
							header: "",
							id: "photo",
							template: obj => `<div class='carSmallCard'><img src='${obj.photo}'></div>`,
							width: 55
						},
						{
							header: "Марка",
							id: "model",
							minWidth: 150
						},
						{
							header: "Гос.номер",
							id: "stateNumber",
							width: 150
						},
						{
							header: "Трекер",
							id: "tracker",
							width: 150
						},
						{
							header: "Масса",
							id: "weight",
							width: 150
						},
						{
							header: "Группа",
							id: "group",
							width: 150,
							fillspace: true
						},
						{
							header: "Состав",
							id: "squad",
							width: 150,
							fillspace: true
						},
						{
							header: "Грузоподъемность",
							id: "capacity",
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
			cols: [newTracker, {width: 15}, carsList]
		};
	}

	init() {
		this.selectedCars = new Set();
		this.form = this.$$("carsForm");
		this.carsList = this.$$("carsList");

		this.carsList.attachEvent("onCheck", (rowId, colId, state) => {
			if (state === 1) {
				this.selectedCars.add(rowId);
			}
			if (state === 0) {
				this.selectedCars.delete(rowId);
			}
		});
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
		this.$$("carPhoto").setValues({Photo: "../sources/assets/photo/default.png"});
	}
}
