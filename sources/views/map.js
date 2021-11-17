import L from "leaflet";
import {JetView} from "webix-jet";

import cards from "../models/cards";
import NewRoutePopup from "./newRoutePopup";

webix.ui({
	view: "popup",
	id: "addRoutePopup",
	width: 230,
	body: {
		view: "form",
		id: "filterForm",
		paddingX: 10,
		paddingY: 10,
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
				name: "route",
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
							if (formValues.route === "Все") {
								delete formValues.route;
							}
							if (formValues.tracker === "Все") {
								delete formValues.tracker;
							}
							for (let i = 0; i < cards.length; i++) {
								if ($$(`card${i}`)) {
									$$(`card${i}`).show();
								}
								for (let key in formValues) {
									if (formValues[key] !== cards[i][key]) {
										if ($$(`card${i}`)) {
											$$(`card${i}`).hide();	
										}
										continue;
									}
								}
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
		const newDriver = {
			css: "travelCards",
			rows: [
				{
					cols: [
						{
							view: "search",
							placeholder: "Поиск",
							width: 315
						},
						{width: 8},
						{
							view: "button",
							type: "icon",
							icon: "mdi mdi-filter-variant",
							css: "webix_primary filter-button",
							popup: "addRoutePopup",
							width: 40
						}
					]
				},
				{height: 10},
				{
					view: "scrollview",
					localId: "scrollview",
					id: "scrollview",
					width: 320,
					scroll: "y",
					body: {
						rows: [
							{
								css: "travelCard",
								localId: "card0",
								id: "card0",
								width: 280,
								height: 300,
								data: cards[0],
								onClick: {
									"mdi-delete": function() {
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(0, 1);
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
										<div class="route"><b>Маршрут: </b> ${obj.startPoint} - ${obj.endPoint}</div>
										<div class="route-distance">
											<div>${obj.distance} км</div>
											<div>${obj.fullDistanceTime}</div>
										</div>
										<div class="routeLine">
											<div class="routeDonePercent" style="width: ${(obj.doneDistance / obj.distance) * 100}%"></div>
										</div>
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo speed"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} со скоростью ${obj.speed} км/ч </span></div>
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
										<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo outOfspeed"> ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
									</div>`
							},
							{
								css: "travelCard",
								localId: "card2",
								id: "card2",
								width: 280,
								height: 150,
								data: cards[2],
								onClick: {
									"mdi-delete": function() {
										webix.confirm("Вы хотите удалить эту карточку?").then(() => {
											this.destructor();
											cards.splice(2, 1);
										});
									},
									"mdi-map-marker": () => {
										this.addRoutePopup.showPopup(2);
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
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} со скоростью ${obj.speed} км/ч </span></div>
										<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
									</div>` : ""}
										<div class="cardRow"><b>Водитель:</b><span class="cardRowInfo"> ${obj.driver}</span></div>
										<div class="cardRow"><b>Номер телефона:</b><span class="cardRowInfo"> ${obj.phone}</span></div>
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
											cards.splice(3, 1);
										});
									},
									"mdi-map-marker": () => {
										this.addRoutePopup.showPopup(3);
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
										<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} со скоростью ${obj.speed} км/ч </span></div>
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
		this.$$("map").getMap(true).then((mapObj) => {
			const mymap = mapObj.setView([53.9, 27.56], 10);
			L.marker([53.9, 27.56]).addTo(mymap);
			L.marker([53.9, 29.06]).addTo(mymap);
		});
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
	}
}
