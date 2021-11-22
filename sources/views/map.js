import L from "leaflet";
import {JetView} from "webix-jet";

import cards from "../models/cards";
import NewRoutePopup from "./newRoutePopup";

webix.ui({
	view: "popup",
	id: "filterCardsPopup",
	width: 230,
	body: {
		view: "form",
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
				name: "group",
				options: ["Автоцистерна", "Фургон", "Рефрижератор", "Бортовой"]
			},
			{
				view: "label",
				label: "Маршрут"
			},
			{
				view: "radio",
				vertical: true,
				align: "left",
				name: "status",
				id: "routeOption",
				options: ["Все", "В пути", "C маршрутом", "Отклонился от маршрута"],
				value: "Все"
			},
			{
				view: "label",
				label: "Тип трекера"
			},
			{
				view: "radio",
				vertical: true,
				align: "left",
				name: "tracker",
				id: "trackerOption",
				options: ["Все", "GPS", "Глонасс"],
				value: "Все"
			},
			{
				cols: [
					{
						view: "button",
						label: "Сбросить",
						click: () => {
							$$("filterForm").clear();
							$$("routeOption").setValue("Все");
							$$("trackerOption").setValue("Все");
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
							const formValues = $$("filterForm").getValues();
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
							for (let i = 0; i < cards.length; i++) {
								$$(`card${i}`)?.show();
								const keys = Object.keys(formValues);
								keys.forEach(item => formValues[item] !== cards[i][item] ? $$(`card${i}`)?.hide() : "")
							}
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
							placeholder: "Поиск",
							width: 252
						},
						{width: 10},
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
				{height: 10},
				{
					view: "scrollview",
					localId: "scrollview",
					id: "scrollview",
					width: 330,
					scroll: "y",
					body: {
						width: 320,
						rows: [
							{
								css: "travelCard",
								localId: "card0",
								id: "card0",
								width: 280,
								height: 300,
								data: cards[0],
								onClick: {
									"mdi-delete": function () {
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(0, 1);
										});
									},
									"mdi-pencil": function () {
										if (this.data.status === "С маршрутом") {
											self.addRoutePopup.showPopup(0, "edit");
										}
									}
								},
								on: {
									onFocus: function () {
										self.$$("map").getMap(true).then((mapObj) => {
											console.log(L);
											self.startMarker?.remove();
											self.endMarker?.remove();
											const mymap = mapObj.setView(this.data.startCoord, 7);
											self.startMarker = L.marker(this.data.startCoord).addTo(mymap);
											self.endMarker = L.marker(this.data.endCoord).addTo(mymap);
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
											<span class="cityName">${obj.startPoint}<span class="tooltiptext startCityTooltip">${obj.startCountry}, г.${obj.startPoint}<br>Координаты: ${obj.startCoord[0]}, ${obj.startCoord[1]}</span></span>
											 - <span class="cityName">${obj.endPoint}<span class="tooltiptext endCityTooltip">${obj.endCountry}, г.${obj.endPoint}<br>Координаты: ${obj.endCoord[0]}, ${obj.endCoord[1]}</span></span>
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
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
									</div>`
							},
							{
								css: "travelCard",
								localId: "card1",
								id: "card1",
								width: 280,
								height: 300,
								data: cards[1],
								onClick: {
									"mdi-delete": function() {
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(1, 1);
										});
									},
									"mdi-pencil": function() {
										if (this.data.status === "С маршрутом") {
											self.addRoutePopup.showPopup(1, "edit");
										}
									}
								},
								on: {
									onFocus: function () {
										self.$$("map").getMap(true).then((mapObj) => {
											self.startMarker?.remove();
											self.endMarker?.remove();
											const mymap = mapObj.setView(this.data.startCoord, 7);
											self.startMarker = L.marker(this.data.startCoord).addTo(mymap);
											self.endMarker = L.marker(this.data.endCoord).addTo(mymap);
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
										const cardData = this.data;
										const timeFormat = webix.Date.dateToStr("%H.%i");
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
											<span class="cityName">${obj.startPoint}<span class="tooltiptext startCityTooltip">${obj.startCountry}, г.${obj.startPoint}<br>Координаты: ${obj.startCoord[0]}, ${obj.startCoord[1]}</span></span>
											 - <span class="cityName">${obj.endPoint}<span class="tooltiptext endCityTooltip">${obj.endCountry}, г.${obj.endPoint}<br>Координаты: ${obj.endCoord[0]}, ${obj.endCoord[1]}</span></span>
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
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
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
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(0, 1);
										});
									},
									"mdi-pencil": function () {
										if (this.data.status === "С маршрутом") {
											self.addRoutePopup.showPopup(0, "edit");
										}
									}
								},
								on: {
									onFocus: function () {
										self.$$("map").getMap(true).then((mapObj) => {
											console.log(L);
											self.startMarker?.remove();
											self.endMarker?.remove();
											const mymap = mapObj.setView(this.data.startCoord, 7);
											self.startMarker = L.marker(this.data.startCoord).addTo(mymap);
											self.endMarker = L.marker(this.data.endCoord).addTo(mymap);
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
											<span class="cityName">${obj.startPoint}<span class="tooltiptext startCityTooltip">${obj.startCountry}, г.${obj.startPoint}<br>Координаты: ${obj.startCoord[0]}, ${obj.startCoord[1]}</span></span>
											 - <span class="cityName">${obj.endPoint}<span class="tooltiptext endCityTooltip">${obj.endCountry}, г.${obj.endPoint}<br>Координаты: ${obj.endCoord[0]}, ${obj.endCoord[1]}</span></span>
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
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
										<div class="cardRow tiltAngleNotification">Превышен угол наклона автомобиля</div>
									</div>`
							},
							{
								css: "travelCard",
								localId: "card3",
								id: "card3",
								width: 280,
								height: 150,
								data: cards[3],
								onClick: {
									"mdi-delete": function() {
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(2, 1);
										});
									},
									"mdi-map-marker": function() {
										if (this.data.status === "Без маршрута") {
											self.addRoutePopup.showPopup(2);
										}
									},
									"mdi-pencil": function() {
										if (this.data.status === "С маршрутом") {
											self.addRoutePopup.showPopup(2, "edit");
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
										<div class="route"><b>Маршрут: </b> ${obj.startPoint} - ${obj.endPoint}</div>
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
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
									</div>`
							},
							{
								css: "travelCard",
								localId: "card4",
								id: "card4",
								width: 280,
								height: 150,
								data: cards[4],
								onClick: {
									"mdi-delete": function() {
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(3, 1);
										});
									},
									"mdi-map-marker": function() {
										if (this.data.status === "Без маршрута") {
											self.addRoutePopup.showPopup(3);
										}
									},
									"mdi-pencil": function() {
										if (this.data.status === "С маршрутом") {
											self.addRoutePopup.showPopup(3, "edit");
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
										<div class="route"><b>Маршрут: </b> ${obj.startPoint} - ${obj.endPoint}</div>
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
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
									</div>`
							},
							{height: cards.length * 5}
						]
					}
				}
			]
		};

		const map = {
			view: "open-map",
			localId: "map"
		};

		return {
			paddingX: 15,
			paddingY: 15,
			cols: [newDriver, {width: 15}, map]
		};
	}

	init() {
		this.editMode = false;
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
			this.$$(`card${num}`).define("height", 300);
			this.$$(`card${num}`).resize();
		});
		this.on(this.app, "onRouteEdit", (num, startCity, endCity) => {
			this.$$(`card${num}`).setValues({
				startPoint: startCity,
				endPoint: endCity
			}, true);
		});

		// this.$$("map").getMap(true).then((mapObj) => {
		// 	const mymap = mapObj.setView([55.75, 37.61], 7);
		// 	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		// 		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		// 	}).addTo(mymap);
		// 	L.marker([55.75, 37.61]).addTo(mymap);
		// 	L.marker([55.75, 37.91]).addTo(mymap);
		// 	console.log(L);
		// 	L.Routing.control({
		// 		serviceUrl: 'http://127.0.0.1:5000/route/v1',
		// 		waypoints: [
		// 				L.latLng(55.75, 37.61),
		// 				L.latLng(55.75, 37.91),
		// 		],
		// 		routeWhileDragging: true,
		// 		show: false
		// 	}).addTo(mymap);
		// });

		this.$$("map").getMap(true).then((mapObj) => {
			mapObj.setView([53.90, 27.56], 7);
		});
	}

	ready() {
		const templates = document.querySelectorAll(".travelCard .webix_template");
		templates.forEach((elem) => elem.setAttribute("tabindex", "1"));
	}
}
