import {JetView} from "webix-jet";
import filterCards from "../helpers/cardsFilter";
import cards from "../models/cards";
import NewRoutePopup from "./newRoutePopup";

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
									const filteredIds = filterCards($$("filterForm").getValues(), $$("numberSearch").getValue());
									filteredIds.show.forEach(i => $$(`card${i}`).show());
									filteredIds.hide.forEach(i => $$(`card${i}`).hide());
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
			this.setMarkersForRoute(startCity, endCity);
			this.getRoutePoints(startCity, endCity).then((res) => {
				this.getDistanceBetweenCities(res).then((result) => {
					const fullDistanceTime = result / 90;
					const hours = Math.trunc(fullDistanceTime);
					const minutes = ((fullDistanceTime - hours) * 60).toFixed();
					this.$$(`card${num}`).setValues({
						readyRoute: true,
						startPoint: startCity,
						endPoint: endCity,
						status: "С маршрутом",
						speed: "-",
						distance: result,
						doneDistance: 0,
						fullDistanceTime: `${hours} ч ${minutes} мин`,
						restDistanceTime: `${hours} ч ${minutes} мин`
					}, true);
		
					this.$$(`card${num}`).define("height", 268);
					this.$$(`card${num}`).resize();
				})
			});
		});
		this.$$("map").getMap(true).then((map) => {
			webix.delay(() => {
			  H.ui.UI.createDefault(map, this.$$("map").getLayers());
			  const mapEvents = new H.mapevents.MapEvents(map);
			  const behavior = new H.mapevents.Behavior(mapEvents);
			}, $$("map"), [], 100);
		});
		this.getCards();
	}

	ready() {
		const templates = document.querySelectorAll(".travelCard .webix_template");
		templates.forEach((elem) => elem.setAttribute("tabindex", "1"));
	}

	async getRoutePoints(startCity, endCity) {
		const startPoint = await webix.ajax().get(`https://geocoder.api.here.com/6.2/geocode.json?searchtext=${startCity}&gen=9&app_id=1ABRBQas40fithl31gWe&app_code=RSz9AQaADwMmSf8oZYq8sA&language=RU`);
		const endPoint = await webix.ajax().get(`https://geocoder.api.here.com/6.2/geocode.json?searchtext=${endCity}&gen=9&app_id=1ABRBQas40fithl31gWe&app_code=RSz9AQaADwMmSf8oZYq8sA&language=RU`);
		return {
			startCoord: startPoint.json().Response.View[0].Result[0].Location.NavigationPosition[0],
			endCoord: endPoint.json().Response.View[0].Result[0].Location.NavigationPosition[0]
		}
	}

	getCards() {
		const self = this;
		let cardsObj = [];
		for (let i = 0; i < cards.length; i++) {
			cardsObj.push({
				css: cards[i].tiltAngle ? "travelCard tiltAngleCar" : "travelCard",
				height: cards[i].tiltAngle  ? 300 : cards[i].readyRoute ? 268 : 118,
				localId: `card${i}`,
				id: `card${i}`,
				data: cards[i],
				onClick: {
					"mdi-delete": function () {
						webix.confirm({
							cancel: "Отменить",
							text: "Вы хотите удалить эту карточку?"
						}).then(() => {
							this.hide();
							cards[i].deleted = true;
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
							self.addRoutePopup.showPopup(i);
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
						if (this.data.startPoint && this.data.endPoint) {
							self.setMarkersForRoute(this.data.startPoint, this.data.endPoint);
						}
						else {
							self.setMarkersForRoute();
						}

						if (this.data.wrongRoute) {
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
							<div class="${obj.tracker === "GPS" ? "cardTrackerGPS" : "cardTrackerGlonass"}">${obj.tracker}</div>
							<div class="card-icons">
								<span class="mdi mdi-map-marker"></span>
								<span class="mdi mdi-pencil"></span>
								<span class="mdi mdi-delete"></span>
							</div>
						</div>
						${obj.readyRoute ? `<div class="route-info">
						<div class="route">
							<b>Маршрут: </b>
							${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.startPoint}</span></span>` }
							 - ${this.editMode ? `<input type='text' class="routeEndPointInput">` : `<span class="cityName">${obj.endPoint}</span></span>` }
						</div>
						<div class="route-distance">
							<div class="fullDistance">${obj.distance} км</div>
							<div class="fullTime">${obj.fullDistanceTime}</div>
						</div>
						<div class="routeLine">
							${obj.status === "В пути" ? `<div class='routeDonePercent' style='width: ${(obj.doneDistance / obj.distance) * 100}%'></div>` : ""}
						</div>
						<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo speed ${obj.speed > 90 ? "outOfspeed" : ""}"> ${obj.speed} км/ч </span></div>
						<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${obj.doneDistance} км со скоростью ${obj.speed} км/ч </span></div>
						<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${obj.restDistanceTime}</span></div>
					</div>` : ""}
						<div class="cardRow"><b>Водитель:${this.editMode ? `<input type='text' class='driverNameInput'>` : `</b><span class="cardRowInfo"> ${obj.driver}</span></div>`}
						<div class="cardRow"><b>Номер телефона:${this.editMode ? `<input type='text' class='driverPhoneInput'>` : `</b><span class="cardRowInfo"> ${obj.phone}</span></div>`}
						${obj.tiltAngle ? '<div class="cardRow tiltAngleNotification">Превышен угол наклона автомобиля</div>' : ""}
					</div>`
			});
		}
		this.$$("scrollview").define("body", {rows: [...cardsObj, {height: cards.length * 9}]});
		this.$$("scrollview").resizeChildren();
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

	setMarkersForRoute(startCity, endCity) {
		this.$$("map").getMap(true).then((map) => {
			if (startCity && endCity) {
				this.getRoutePoints(startCity, endCity).then((res) => {
					map.removeObjects(map.getObjects(this.startMarker, this.endMarker))
					map.setCenter({lat: res.startCoord.Latitude, lng: res.startCoord.Longitude});
					const startIcon = new H.map.Icon("../../sources/assets/icons/redMapMarker.svg");
					const endIcon = new H.map.Icon("../../sources/assets/icons/greenMapMarker.svg");
					this.startMarker = new H.map.Marker({lat: res.startCoord.Latitude, lng: res.startCoord.Longitude}, {icon: startIcon});
					this.endMarker = new H.map.Marker({lat: res.endCoord.Latitude, lng: res.endCoord.Longitude}, {icon: endIcon});
					map.addObject(this.startMarker);
					map.addObject(this.endMarker);
					this.getRouteData(res);
				});	
			}
			else if (this.startMarker && this.endMarker) {
				map.removeObjects(map.getObjects(this.startMarker, this.endMarker));
			}
		});
	}

	drawRoute(result, map) {
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

	async getDistanceBetweenCities(routePoints) {
		const routeData = await webix.ajax().get(`https://route.api.here.com/routing/7.2/calculateroute.json
		?waypoint0=${[[routePoints.startCoord.Latitude, routePoints.startCoord.Longitude]]}
		&waypoint1=${[[routePoints.endCoord.Latitude, routePoints.endCoord.Longitude]]}
		&mode=fastest%3Bcar%3Btraffic%3Aenabled&departure=now
		&app_id=1ABRBQas40fithl31gWe
		&app_code=RSz9AQaADwMmSf8oZYq8sA`);
		const distance = (routeData.json().response.route[0].summary.distance / 1000).toFixed()
		return distance;
	}

	getRouteData(routePoints) {
		this.$$("map").getMap(true).then((map) => {

			const platform = new H.service.Platform({
				app_id: '1ABRBQas40fithl31gWe',
    			app_code: 'RSz9AQaADwMmSf8oZYq8sA',
			});

			const routingParameters = {
				mode: 'balanced;truck',
				waypoint0: [routePoints.startCoord.Latitude, routePoints.startCoord.Longitude],
				waypoint1: [routePoints.endCoord.Latitude, routePoints.endCoord.Longitude],
				representation: 'display',
				routeAttributes: 'summary'
			};

			const onResult = (result) => {
				if (result.response.route.length) {
					this.drawRoute(result, map);
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
				this.setMarkersForRoute(newStartPoint, newEndPoint);
				this.getRoutePoints(newStartPoint, newEndPoint).then((res) => {
					this.getDistanceBetweenCities(res).then((result) => {
						const fullDistanceTime = result / 90;
						const hours = Math.trunc(fullDistanceTime);
						const minutes = ((fullDistanceTime - hours) * 60).toFixed();
	
						card.data.startPoint = newStartPoint;
						card.data.endPoint = newEndPoint;
						card.data.fullDistanceTime = `${hours} ч ${minutes} мин`;
						card.data.restDistanceTime = `${hours} ч ${minutes} мин`;
						card.data.distance = result;
						card.data.doneDistance = 0;
						card.data.speed = "-";
						card.data.status = "С маршрутом"
						if (card.data.wrongRoute) {
							card.data.wrongRoute = false;
						}

						this.editMode = false;
						card.refresh();
					})
				});
			}
			
			this.editMode = false;
			card.refresh();
		}
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
								if (!cards[i].deleted) {
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
							const filteredIds = filterCards($$("filterForm").getValues(), $$("numberSearch").getValue());
							filteredIds.show.forEach(i => $$(`card${i}`).show());
							filteredIds.hide.forEach(i => $$(`card${i}`).hide());
						}
					}
				]
			}
		]
	}
});
