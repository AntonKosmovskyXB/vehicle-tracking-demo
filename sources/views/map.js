import L from "leaflet";
import {JetView} from "webix-jet";

import cards from "../models/cards";
import NewRoutePopup from "./newRoutePopup";

function filterCards() {
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
		$$(`card${i}`)?.show();
		const keys = Object.keys(formValues);
		keys.forEach(item => {
			if (item === "stateNumber") {
				cards[i].stateNumber.indexOf(searchValue) === -1 ? $$(`card${i}`)?.hide() : "";
			}
			else {
				formValues[item] !== cards[i][item] ? $$(`card${i}`)?.hide() : "";
			}
		});
	}
}

webix.ui({
	view: "popup",
	id: "filterCardsPopup",
	width: 262,
	height: 505,
	body: {
		view: "form",
		paddingX: 16,
		id: "filterForm",
		rows: [
			{
				view: "richselect",
				label: "Марка автомобиля",
				name: "model",
				labelPosition: "top",
				options: ["Volvo", "Scania", "Man"]
			},
			{
				view: "richselect",
				label: "Группа",
				labelPosition: "top",
				css: "filterPopupElem",
				name: "group",
				options: ["Автоцистерна", "Фургон", "Рефрижератор", "Бортовой"]
			},
			{
				view: "label",
				label: "Маршрут",
				css: "filterPopupElem",
			},
			{
				view: "radio",
				vertical: true,
				align: "left",
				css: "filterPopupElem",
				name: "status",
				id: "routeOption",
				options: ["Все", "В пути", "C маршрутом", "Отклонился от маршрута"],
				value: "Все"
			},
			{
				view: "label",
				label: "Тип трекера",
				css: "filterPopupElem",
			},
			{
				view: "radio",
				vertical: true,
				align: "left",
				name: "tracker",
				css: "filterPopupElem",
				id: "trackerOption",
				options: ["Все", "GPS", "Глонасс"],
				value: "Все"
			},
			{
				css: "filterPopupElem",
				cols: [
					{
						view: "button",
						label: "Сбросить",
						click: () => {
							$$("filterForm").clear();
							$$("routeOption").setValue("Все");
							$$("trackerOption").setValue("Все");
							$$("numberSearch").setValue("");
							for (let i = 0; i < cards.length; i++) {
								if ($$(`card${i}`)) {
									$$(`card${i}`).show();
								}
							}
						}
					},
					{
						view: "button",
						css: "webix_primary",
						label: "Применить",
						click: () => {
							filterCards();
						}
					}
				]
			}
		]
	}
});

export default class MainView extends JetView {
	config() {
		const self = this;
		const newDriver = {
			css: "travelCards",
			rows: [
				{
					height: 38,
					cols: [
						{
							view: "search",
							localId: "numberSearch",
							id: "numberSearch",
							css: "numberSearch",
							placeholder: "Поиск",
							width: 256,
							on: {
								onTimedKeyPress: () => {
									filterCards();
								}
							}
						},
						{width: 4},
						{
							view: "button",
							type: "icon",
							icon: "mdi mdi-filter-variant",
							css: "webix_primary filter-button",
							popup: "filterCardsPopup",
							width: 36
						}
					]
				},
				{height: 12},
				{
					view: "scrollview",
					localId: "scrollview",
					id: "scrollview",
					css: "cardsScrollview",
					scroll: "y",
					body: {
						rows: [
							{
								css: "travelCard",
								localId: "card0",
								id: "card0",
								height: 268,
								data: cards[0],
								onClick: {
									"mdi-delete": function () {
										webix.confirm({
											cancel: "Отменить",
											text: "Вы хотите удалить эту карточку?"
										}).then(() => {
											this.destructor();
											cards.splice(0, 1);
										});
									},
									"mdi-map-marker": function() {
										self.checkIsCardEditing();
										if (this.data.status === "В пути" || this.data.status === "С маршрутом") {
											webix.message("Маршрут уже задан для данного автомобиля");
										}
										if (this.data.status === "Без маршрута") {
											this.editMode = false;
											this.refresh();
											self.setRoutePopupPosition(this.$view);
											self.addRoutePopup.showPopup(0);
										}
									},
									"mdi-pencil": function () {
										if (self.editMode && self.currentEditableCard !== this) {
											webix.message("Пожалуйста, завершите редактирование другой карточки");
										}
										else {
											self.editCard(this);
										}
									}
								},
								on: {
									onFocus: function () {
										self.$$("map").getMap(true).then((map) => {
											// map.removeObject(self.startMarker);
											// map.removeObject(self.endMarker);
											map.removeObjects(map.getObjects(self.startMarker, self.endMarker))
											map.setCenter({lat:this.data.startCoord[0], lng:this.data.startCoord[1]});
											self.startMarker = new H.map.Marker({lat: this.data.startCoord[0], lng: this.data.startCoord[1]});
											self.endMarker = new H.map.Marker({lat: this.data.endCoord[0], lng: this.data.endCoord[1]});
											map.addObject(self.startMarker);
											map.addObject(self.endMarker);
											self.getRoute(this);
										});
									}
								},
								template: obj =>
									`<div>
										<div class="card-header">
											<div class="carSmallCard"><img src=${obj.photo}></div>
											<div class="carInfo">
												<div class="cardCarName">${obj.model}</div>
												<div class="cardCarNumber">${obj.stateNumber}</div>
											</div>
											<div class="cardTrackerGPS">${obj.tracker}</div>
											<div class="card-icons">
												<span class="mdi mdi-map-marker"></span>
												<span class="mdi mdi-pencil"></span>
												<span class="mdi mdi-delete"></span>
											</div>
										</div>
										${obj.readyRoute ? `<div class="route-info">
										<div class="route">
											<b>Маршрут: </b>
											${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.startPoint}<span class="tooltiptext startCityTooltip">${obj.startCountry}, г.${obj.startPoint}<br><span class='tooltipCoordinates'>Координаты: ${obj.startCoord[0]}, ${obj.startCoord[1]}</span></span></span>` }
											 - ${this.editMode ? `<input type='text' class="routeEndPointInput">` : `<span class="cityName">${obj.endPoint}<span class="tooltiptext startCityTooltip">${obj.endCountry}, г.${obj.endPoint}<br><span class='tooltipCoordinates'>Координаты: ${obj.endCoord[0]}, ${obj.endCoord[1]}</span></span></span>` }
										</div>
										<div class="route-distance">
											<div>${obj.distance} км</div>
											<div>${obj.fullDistanceTime}</div>
										</div>
										<div class="routeLine">
											<div class="routeDonePercent" style="width: ${(obj.doneDistance / obj.distance) * 100}%"></div>
										</div>
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo speed"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} км со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
										<div class="cardRow"><b>Водитель:${this.editMode ? `<input type='text' class='driverNameInput'>` : `</b><span class="cardRowInfo"> ${obj.driver}</span></div>`}
										<div class="cardRow"><b>Номер телефона:${this.editMode ? `<input type='text' class='driverPhoneInput'>` : `</b><span class="cardRowInfo"> ${obj.phone}</span></div>`}
									</div>`
							},
							{
								css: "travelCard",
								localId: "card1",
								id: "card1",
								width: 280,
								height: 268,
								data: cards[1],
								onClick: {
									"mdi-delete": function() {
										webix.confirm({
											cancel: "Отменить",
											text: "Вы хотите удалить эту карточку?"
										}).then(() => {
											this.destructor();
											cards.splice(1, 1);
										});
									},
									"mdi-map-marker": function() {
										self.checkIsCardEditing();
										if (this.data.status === "В пути" || this.data.status === "С маршрутом") {
											webix.message("Маршрут уже задан для данного автомобиля");
										}
										if (this.data.status === "Без маршрута") {
											this.editMode = false;
											this.refresh();
											self.setRoutePopupPosition(this.$view);
											self.addRoutePopup.showPopup(1);
										}
									},
									"mdi-pencil": function () {
										if (self.editMode && self.currentEditableCard !== this) {
											webix.message("Пожалуйста, завершите редактирование другой карточки");
										}
										else {
											self.editCard(this);
										}
									}
								},
								on: {
									onFocus: function () {
										self.$$("map").getMap(true).then((map) => {
											// map.removeObject(self.startMarker);
											// map.removeObject(self.endMarker);
											map.removeObjects(map.getObjects(self.startMarker, self.endMarker))
											map.setCenter({lat:this.data.startCoord[0], lng:this.data.startCoord[1]});
											self.startMarker = new H.map.Marker({lat: this.data.startCoord[0], lng: this.data.startCoord[1]});
											self.endMarker = new H.map.Marker({lat: this.data.endCoord[0], lng: this.data.endCoord[1]});
											map.addObject(self.startMarker);
											map.addObject(self.endMarker);
											self.getRoute(this);
										});

										const cardData = this.data;
										const timeFormat = webix.Date.dateToStr("%H:%i");
										const currentTime = timeFormat(new Date());
										webix.message({
											text: `
											<span>${currentTime}</span><br>
											<span class="cardCarName">${cardData.model}</span>
											<span class="cardCarNumber">${cardData.stateNumber}</span><br>
											<span style="color: #FD0000">Отклонился от маршрута</span>`,
											expire: -1
										});
									}
								},
								template: obj =>
									`<div>
										<div class="card-header">
											<div class="carSmallCard"><img src=${obj.photo}></div>
											<div class="carInfo">
												<div class="cardCarName">${obj.model}</div>
												<div class="cardCarNumber">${obj.stateNumber}</div>
											</div>
											<div class="cardTrackerGlonass">${obj.tracker}</div>
											<div class="card-icons">
												<span class="mdi mdi-map-marker"></span>
												<span class="mdi mdi-pencil"></span>
												<span class="mdi mdi-delete"></span>
											</div>
										</div>
										${obj.readyRoute ? `<div class="route-info">
										<div class="route">
											<b>Маршрут: </b>
											${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.startPoint}<span class="tooltiptext startCityTooltip">${obj.startCountry}, г.${obj.startPoint}<br><span class='tooltipCoordinates'>Координаты: ${obj.startCoord[0]}, ${obj.startCoord[1]}</span></span></span>` }
											 - ${this.editMode ? `<input type='text' class="routeEndPointInput">` : `<span class="cityName">${obj.endPoint}<span class="tooltiptext startCityTooltip">${obj.endCountry}, г.${obj.endPoint}<br><span class='tooltipCoordinates'>Координаты: ${obj.endCoord[0]}, ${obj.endCoord[1]}</span></span></span>` }
										</div>
										<div class="route-distance">
											<div>${obj.distance} км</div>
											<div>${obj.fullDistanceTime}</div>
										</div>
										<div class="routeLine">
											<div class="routeDonePercent" style="width: ${(obj.doneDistance / obj.distance) * 100}%"></div>
										</div>
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo outOfspeed"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} км со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
										<div class="cardRow"><b>Водитель:${this.editMode ? `<input type='text' class='driverNameInput'>` : `</b><span class="cardRowInfo"> ${obj.driver}</span></div>`}
										<div class="cardRow"><b>Номер телефона:${this.editMode ? `<input type='text' class='driverPhoneInput'>` : `</b><span class="cardRowInfo"> ${obj.phone}</span></div>`}
									</div>`
							},
							{
								css: "travelCard tiltAngleCar",
								localId: "card2",
								id: "card2",
								width: 280,
								height: 300,
								data: cards[2],
								onClick: {
									"mdi-delete": function () {
										webix.confirm({
											cancel: "Отменить",
											text: "Вы хотите удалить эту карточку?"
										}).then(() => {
											this.destructor();
											cards.splice(2, 1);
										});
									},
									"mdi-map-marker": function() {
										self.checkIsCardEditing();
										if (this.data.status === "В пути" || this.data.status === "С маршрутом") {
											webix.message("Маршрут уже задан для данного автомобиля");
										}
										if (this.data.status === "Без маршрута") {
											this.editMode = false;
											this.refresh();
											self.setRoutePopupPosition(this.$view);
											self.addRoutePopup.showPopup(2);
										}
									},
									"mdi-pencil": function () {
										if (self.editMode && self.currentEditableCard !== this) {
											webix.message("Пожалуйста, завершите редактирование другой карточки");
										}
										else {
											self.editCard(this);
										}
									}
								},
								on: {
									onFocus: function () {
										self.$$("map").getMap(true).then((map) => {
											// map.removeObject(self.startMarker);
											// map.removeObject(self.endMarker);
											map.removeObjects(map.getObjects(self.startMarker, self.endMarker))
											map.setCenter({lat:this.data.startCoord[0], lng:this.data.startCoord[1]});
											self.startMarker = new H.map.Marker({lat: this.data.startCoord[0], lng: this.data.startCoord[1]});
											self.endMarker = new H.map.Marker({lat: this.data.endCoord[0], lng: this.data.endCoord[1]});
											map.addObject(self.startMarker);
											map.addObject(self.endMarker);
											self.getRoute(this);
										});
									}
								},
								template: obj =>
									`<div>
										<div class="card-header">
											<div class="carSmallCard"><img src=${obj.photo}></div>
											<div class="carInfo">
												<div class="cardCarName">${obj.model}</div>
												<div class="cardCarNumber">${obj.stateNumber}</div>
											</div>
											<div class="cardTrackerGPS">${obj.tracker}</div>
											<div class="card-icons">
												<span class="mdi mdi-map-marker"></span>
												<span class="mdi mdi-pencil"></span>
												<span class="mdi mdi-delete"></span>
											</div>
										</div>
										${obj.readyRoute ? `<div class="route-info">
										<div class="route">
											<b>Маршрут: </b>
											${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.startPoint}<span class="tooltiptext startCityTooltip">${obj.startCountry}, г.${obj.startPoint}<br><span class='tooltipCoordinates'>Координаты: ${obj.startCoord[0]}, ${obj.startCoord[1]}</span></span></span>` }
											 - ${this.editMode ? `<input type='text' class="routeEndPointInput">` : `<span class="cityName">${obj.endPoint}<span class="tooltiptext startCityTooltip">${obj.endCountry}, г.${obj.endPoint}<br><span class='tooltipCoordinates'>Координаты: ${obj.endCoord[0]}, ${obj.endCoord[1]}</span></span></span>` }
										</div>
										<div class="route-distance">
											<div>${obj.distance} км</div>
											<div>${obj.fullDistanceTime}</div>
										</div>
										<div class="routeLine">
											<div class="routeDonePercent" style="width: ${(obj.doneDistance / obj.distance) * 100}%"></div>
										</div>
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo speed"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} км со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
									<div class="cardRow"><b>Водитель:${this.editMode ? `<input type='text' class='driverNameInput'>` : `</b><span class="cardRowInfo"> ${obj.driver}</span></div>`}
									<div class="cardRow"><b>Номер телефона:${this.editMode ? `<input type='text' class='driverPhoneInput'>` : `</b><span class="cardRowInfo"> ${obj.phone}</span></div>`}
										<div class="cardRow tiltAngleNotification">Превышен угол наклона автомобиля</div>
									</div>`
							},
							{
								css: "travelCard",
								localId: "card3",
								id: "card3",
								width: 280,
								height: 118,
								data: cards[3],
								onClick: {
									"mdi-delete": function() {
										webix.confirm({
											cancel: "Отменить",
											text: "Вы хотите удалить эту карточку?"
										}).then(() => {
											this.destructor();
											cards.splice(3, 1);
										});
									},
									"mdi-map-marker": function() {
										self.checkIsCardEditing();
										if (this.data.status === "В пути" || this.data.status === "С маршрутом") {
											webix.message("Маршрут уже задан для данного автомобиля");
										}
										if (this.data.status === "Без маршрута") {
											this.editMode = false;
											this.refresh();
											self.setRoutePopupPosition(this.$view);
											self.addRoutePopup.showPopup(3);
										}
									},
									"mdi-pencil": function () {
										if (self.editMode && self.currentEditableCard !== this) {
											webix.message("Пожалуйста, завершите редактирование другой карточки");
										}
										else {
											self.editCard(this);
										}
									}
								},
								template: obj =>
									`<div>
										<div class="card-header">
											<div class="carSmallCard"><img src=${obj.photo}></div>
											<div class="carInfo">
												<div class="cardCarName">${obj.model}</div>
												<div class="cardCarNumber">${obj.stateNumber}</div>
											</div>
											<div class="cardTrackerGlonass">${obj.tracker}</div>
											<div class="card-icons">
												<span class="mdi mdi-map-marker"></span>
												<span class="mdi mdi-pencil"></span>
												<span class="mdi mdi-delete"></span>
											</div>
										</div>
										${obj.readyRoute ? `<div class="route-info">
										${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.startPoint}</span></span>` }
											 - ${this.editMode ? `<input type='text' class="routeEndPointInput">` : `<span class="cityName">${obj.endPoint}</span></span>` }
										<div class="route-distance">
											<div>${obj.distance} км</div>
											<div>${obj.fullDistanceTime}</div>
										</div>
										<div class="routeLine">
											<div class="routeDonePercent" style="width: ${(obj.doneDistance / obj.distance) * 100}%"></div>
										</div>
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} км со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
									<div class="cardRow"><b>Водитель:${this.editMode ? `<input type='text' class='driverNameInput'>` : `</b><span class="cardRowInfo"> ${obj.driver}</span></div>`}
									<div class="cardRow"><b>Номер телефона:${this.editMode ? `<input type='text' class='driverPhoneInput'>` : `</b><span class="cardRowInfo"> ${obj.phone}</span></div>`}
									</div>`
							},
							{
								css: "travelCard",
								localId: "card4",
								id: "card4",
								width: 280,
								height: 118,
								data: cards[4],
								onClick: {
									"mdi-delete": function() {
										webix.confirm({
											cancel: "Отменить",
											text: "Вы хотите удалить эту карточку?"
										}).then(() => {
											this.destructor();
											cards.splice(4, 1);
										});
									},
									"mdi-map-marker": function() {
										self.checkIsCardEditing();
										if (this.data.status === "В пути" || this.data.status === "С маршрутом") {
											webix.message("Маршрут уже задан для данного автомобиля");
										}
										if (this.data.status === "Без маршрута") {
											this.editMode = false;
											this.refresh();
											self.setRoutePopupPosition(this.$view);
											self.addRoutePopup.showPopup(4);
										}
									},
									"mdi-pencil": function () {
										if (self.editMode && self.currentEditableCard !== this) {
											webix.message("Пожалуйста, завершите редактирование другой карточки");
										}
										else {
											self.editCard(this);
										}
									}
								},
								template: obj =>
									`<div>
										<div class="card-header">
											<div class="carSmallCard"><img src=${obj.photo}></div>
											<div class="carInfo">
												<div class="cardCarName">${obj.model}</div>
												<div class="cardCarNumber">${obj.stateNumber}</div>
											</div>
											<div class="cardTrackerGPS">${obj.tracker}</div>
											<div class="card-icons">
												<span class="mdi mdi-map-marker"></span>
												<span class="mdi mdi-pencil"></span>
												<span class="mdi mdi-delete"></span>
											</div>
										</div>
										${obj.readyRoute ? `<div class="route-info">
										${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.startPoint}</span></span>` }
											 - ${this.editMode ? `<input type='text' class="routeEndPointInput">` : `<span class="cityName">${obj.endPoint}</span></span>` }
										<div class="route-distance">
											<div>${obj.distance} км</div>
											<div>${obj.fullDistanceTime}</div>
										</div>
										<div class="routeLine">
											<div class="routeDonePercent" style="width: ${(obj.doneDistance / obj.distance) * 100}%"></div>
										</div>
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} км со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
									<div class="cardRow"><b>Водитель:${this.editMode ? `<input type='text' class='driverNameInput'>` : `</b><span class="cardRowInfo"> ${obj.driver}</span></div>`}
									<div class="cardRow"><b>Номер телефона:${this.editMode ? `<input type='text' class='driverPhoneInput'>` : `</b><span class="cardRowInfo"> ${obj.phone}</span></div>`}
									</div>`
							},
							{height: cards.length * 10}
						]
					}
				}
			]
		};

		const map = {
			view: "here-map",
			localId: "map",
			id: "map",
			modules:["mapevents", "ui"],
			center: [53.90, 27.56],
    		zoom:7,
			key: {
				app_id: "1ABRBQas40fithl31gWe",
				app_code: "RSz9AQaADwMmSf8oZYq8sA",
				useHTTPS: true
			}
		};

		return {
			paddingX: 16,
			paddingY: 16,
			cols: [newDriver, {width: 16}, map]
		};
	}

	init() {
		this.editMode = false;
		this.currentEditableCard = "";
		this.addRoutePopup = this.ui(NewRoutePopup);
		this.on(this.app, "onRouteAdd", (num, startCity, endCity) => {
			this.$$(`card${num}`).setValues({
				readyRoute: true,
				startPoint: startCity,
				endPoint: endCity,
				status: "С маршрутом",
				speed: "-",
				distance: 400,
				doneDistance: 0,
				fullDistanceTime: "8 ч 00 мин",
				restDistanceTime: "8 ч 00 мин"
			}, true);
			this.$$(`card${num}`).define("height", 268);
			this.$$(`card${num}`).resize();
		});
		this.on(this.app, "onRouteEdit", (num, startCity, endCity) => {
			this.$$(`card${num}`).setValues({
				startPoint: startCity,
				endPoint: endCity
			}, true);
		});
		this.$$("map").getMap(true).then((map) => {
			webix.delay(() => {
			  H.ui.UI.createDefault(map, this.$$("map").getLayers());
			  const mapEvents = new H.mapevents.MapEvents(map);
			  const behavior = new H.mapevents.Behavior(mapEvents);
			}, $$("map"), [], 100);
		});
	}

	ready() {
		const templates = document.querySelectorAll(".travelCard .webix_template");
		templates.forEach((elem) => elem.setAttribute("tabindex", "1"));
	}

	setRoutePopupPosition(view) {
		const position = view.querySelector(".mdi-map-marker").getBoundingClientRect();
		this.addRoutePopup.setPosition(position.left, position.top);
	}

	checkIsCardEditing() {
		if (this.editMode) {
			webix.message("Пожалуйста, завершите редактирование карточки");
			return;
		}
	}

	getRoute(card) {
		this.$$("map").getMap(true).then((map) => {
			const platform = new H.service.Platform({
				app_id: '1ABRBQas40fithl31gWe',
    			app_code: 'RSz9AQaADwMmSf8oZYq8sA',
			});

			const routingParameters = {
				mode: 'balanced;truck',
				waypoint0: card.data.startCoord,
				waypoint1: card.data.endCoord,
				representation: 'display',
				routeAttributes: 'summary'
			};

			const onResult = function(result) {
				if (result.response.route.length) {
					const lineString = new H.geo.LineString();
					result.response.route[0].shape.forEach(point => {
						const [lat, lng] = point.split(",");
						lineString.pushPoint({lat: lat, lng: lng});
					});
					const polyline = new H.map.Polyline(
						lineString,
						{
							style: {
								lineWidth: 5
							}
						}
					);
					map.addObject(polyline);
				}
			};
			  
			const router = platform.getRoutingService(null, 8);
			router.calculateRoute(
				routingParameters, 
				onResult,
				(error) => {
				  console.log(error.message);
			});
		});
	}

	editCard(card) {
		this.currentEditableCard = card;
		if (!this.editMode) {
			this.editMode = true;
			card.refresh();
			const nameInput = card.$view.querySelector(".driverNameInput");
			const phoneInput = card.$view.querySelector(".driverPhoneInput");
			const startPointInput = card.$view.querySelector(".routeStartPointInput");
			const endPointInput = card.$view.querySelector(".routeEndPointInput");
			nameInput.setAttribute("value", card.data.driver);
			phoneInput.setAttribute("value", card.data.phone);
			if (startPointInput && endPointInput) {
				startPointInput.setAttribute("value", card.data.startPoint);
				endPointInput.setAttribute("value", card.data.endPoint);
			}
		}
		else {
			const newDriverName = card.$view.querySelector(".driverNameInput")?.value;
			const newDriverPhone = card.$view.querySelector(".driverPhoneInput")?.value;
			const newStartPoint = card.$view.querySelector(".routeStartPointInput")?.value;
			const newEndPoint = card.$view.querySelector(".routeEndPointInput")?.value;
			card.data.driver = newDriverName;
			card.data.phone = newDriverPhone;
			if (newStartPoint && newEndPoint) {
				card.data.startPoint = newStartPoint;
				card.data.endPoint = newEndPoint;
			}
			this.editMode = false;
			card.refresh();
			const tooltips = card.$view.querySelectorAll(".tooltiptext");
			if (tooltips.length) {
				tooltips.forEach(item => item.remove())
			}
		}
	}
}
