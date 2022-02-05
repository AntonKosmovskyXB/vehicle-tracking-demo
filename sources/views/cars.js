import {JetView} from "webix-jet";

import serverUrl from "../constants/server";

const editCarText = "Редактировать автомобиль";
const newCarText = "Новый автомобиль";

export default class CarsView extends JetView {
	config() {
		const newTracker = {
			view: "form",
			localId: "carsForm",
			css: "newCarsForm",
			paddingY: 9,
			paddingX: 13,
			width: 262,
			elements: [
				{
					view: "label",
					localId: "headLabel",
					label: "Новый автомобиль",
					css: "headLabel"
				},
				{
					view: "scrollview",
					scroll: "y",
					css: "carMenuScroll",
					width: 290,
					body: {
						rows: [
							{
								localId: "carPhoto",
								css: "carPhoto",
								name: "image",
								width: 230,
								height: 134,
								borderless: true,
								template: obj => `<div class="car-photo"><img src=${obj.Photo || "../sources/assets/photo/default.png"}></div>`
							},
							{height: 10},
							{
								view: "uploader",
								localId: "photoUploader",
								width: 234,
								height: 38,
								value: "Загрузить фото",
								css: "webix_primary",
								autosend: false,
								on: {
									onBeforeFileAdd: (obj) => {
										const reader = new FileReader();
										reader.readAsDataURL(obj.file);
										reader.onloadend = () => {
											this.$$("carPhoto").setValues({Photo: reader.result});
										};
										this.photoUploader.define("value", "Сменить фото");
										this.photoUploader.refresh();
										// return false;
									}
								}
							},
							{height: 30},
							{
								view: "text",
								label: "Марка автомобиля",
								labelPosition: "top",
								name: "model",
								required: true
							},
							{height: 14},
							{
								view: "text",
								label: "Гос. номер",
								labelPosition: "top",
								name: "state_number",
								required: true
							},
							{height: 20},
							// {
							// 	view: "counter",
							// 	label: "Масса (т)",
							// 	name: "weight",
							// 	labelWidth: 128,
							// 	required: true
							// },
							// {height: 26},
							// {
							// 	view: "richselect",
							// 	options: ["Автоцистерна", "Фургон", "Рефрижератор", "Бортовой"],
							// 	label: "Группа",
							// 	labelPosition: "top",
							// 	name: "group",
							// 	required: true
							// },
							// {height: 13},
							// {
							// 	view: "richselect",
							// 	label: "Количество осей",
							// 	options: ["Двухосные", "Трехосные"],
							// 	labelPosition: "top"
							// },
							// {height: 13},
							// {
							// 	view: "richselect",
							// 	label: "Состав",
							// 	options: ["Автомобиль-прицеп", "Одиночное транспортное средство"],
							// 	labelPosition: "top",
							// 	name: "squad",
							// 	required: true
							// },
							// {height: 15},
							// {
							// 	view: "richselect",
							// 	label: "Грузоподъемность",
							// 	options: ["От 1,5 до 16 тонн", "Свыше 16 тонн"],
							// 	labelPosition: "top",
							// 	name: "capacity",
							// 	required: true
							// },
							// {height: 21},
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
												const formData = new FormData();
												formData.append("model", formValues.model);
												formData.append("state_number", formValues.state_number);
												const updoadedPhoto = this.$$("photoUploader").files.data.pull[this.$$("photoUploader").files.data.order[0]];
												if (updoadedPhoto) {
													formData.append("image", updoadedPhoto.file, updoadedPhoto.name);
												}
												if (formValues.id) {
													webix.ajax().patch(`${serverUrl}cars/${formValues.id}`, formValues).then((res) => {
														this.carsList.updateItem(formValues.id, formValues);
														this.clearForm();
														this.refreshLabels();
													});
												}
												else {
													webix.ajax().post(`${serverUrl}cars`, formData).then((res) => {
														const result = res.json();
														this.carsList.add(result);
														this.clearForm();
														this.refreshLabels();
														this.$$("photoUploader").files.data.pull.length = 0;
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

		const carsList = {
			minWidth: 700,
			rows: [
				{
					view: "toolbar",
					css: "datatableToolbar",
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
							width: 102,
							click: () => {
								const selectedCars = Array.from(this.selectedCars);
								if (selectedCars.length) {
									webix.confirm({
										text: "Удалить все выбранные автомобили?"
									}).then(() => {
										for (let i = 0; i < selectedCars.length; i++) {
											webix.ajax().del(`${serverUrl}cars/${selectedCars[i]}`).then(() => {
												this.carsList.remove(selectedCars[i]);
											});
										}
										this.selectedDrivers.clear();
										this.selectedCars.clear();
									});
								}
								else {
									webix.message("Пожалуйста, отметьте автомобили, которые вы хотите удалить");
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
								const selectedCar = this.carsList.getSelectedItem();
								if (selectedCar) {
									this.form.parse(selectedCar);
									this.refreshLabels("edit");
									if (selectedCar.image) {
										this.carPhoto.setValues({Photo: `./server/attachments/${selectedCar.image.file_name}`});
									}
								}
								else {
									webix.message("Пожалуйста выберите автомобиль для редактирования");
								}
							}
						},
						{width: 7}
					]
				},
				{
					view: "datatable",
					minWidth: 1074,
					localId: "carsList",
					css: "carsDatatable",
					borderless: true,
					rowHeight: 36,
					headerRowHeight: 44,
					scroll: true,
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
							id: "image",
							template: (obj) => obj.image ? `<div class="carSmallCard"><img src="./server/attachments/${obj.image.file_name}"></div>` : "",
							width: 55
						},
						{
							header: "Марка",
							id: "model",
							fillspace: true
						},
						{
							header: "Гос.номер",
							id: "state_number",
							fillspace: true
						},
						{
							header: "Трекер",
							id: "tracker",
							fillspace: true,
							template: obj => obj.track ? obj.track.type : ""
						}
						// {
						// 	header: "Масса (т)",
						// 	id: "weight",
						// 	width: 90
						// },
						// {
						// 	header: "Группа",
						// 	id: "group",
						// 	width: 150
						// },
						// {
						// 	header: "Состав",
						// 	id: "squad",
						// 	width: 150,
						// 	fillspace: true
						// },
						// {
						// 	header: "Грузоподъемность",
						// 	id: "capacity",
						// 	width: 150,
						// 	fillspace: true
						// }
					]
				}
			]
		};

		return {
			paddingX: 16,
			paddingY: 16,
			cols: [newTracker, {width: 15}, carsList]
		};
	}

	init() {
		this.selectedCars = new Set();
		this.form = this.$$("carsForm");
		this.carsList = this.$$("carsList");
		this.photoUploader = this.$$("photoUploader");
		this.headLabel = this.$$("headLabel");
		this.carPhoto = this.$$("carPhoto");
		this.carsList.attachEvent("onCheck", (rowId, colId, state) => {
			if (state === 1) {
				this.selectedCars.add(rowId);
			}
			if (state === 0) {
				this.selectedCars.delete(rowId);
			}
		});
		webix.ajax().get(`${serverUrl}cars`).then((res) => {
			const cars = res.json();
			this.carsList.parse(cars);
		});
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
		this.carPhoto.setValues({Photo: "../sources/assets/photo/default.png"});
	}

	refreshLabels(editMode) {
		if (editMode) {
			this.headLabel.define("label", editCarText);
			this.photoUploader.define("value", "Сменить фото");
		}
		else {
			this.headLabel.define("label", newCarText);
			this.photoUploader.define("value", "Загрузить фото");
		}
		this.photoUploader.refresh();
		this.headLabel.refresh();
	}
}
