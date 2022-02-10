import {JetView} from "webix-jet";
import serverUrl from "../constants/server";
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

	async init() {
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
					const speed = this.getRandomInt(70, 90);
					const objToSend = {
						coords: {
							lat: res.endCoord.Latitude,
							lng: res.endCoord.Longitude
						},
						startCoords: {
							lat: res.startCoord.Latitude,
							lng: res.startCoord.Longitude
						},
						distance: Number(result),
						speed,
						travelTime: result / speed,
						route: `${startCity} - ${endCity}`,
						deliveryAdress: "",
						alternativesIds: []
					};
					this.createRoute(objToSend, num);
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

	async createRoute(objToSend, cardNum) {
		const card = this.$$(`card${cardNum}`);
		const route = (await webix.ajax().headers({
			"Content-Type": "application/json"
		}).post(`${serverUrl}routes`, objToSend)).json()
		webix.ajax().patch(`${serverUrl}tracks/${card.data.id}`, {routeId: route.id, id: card.data.id}).then(() => {
			card.data.route = route;
			card.define("height", 268);
			card.resize();
			card.refresh();
		});
	}

	async getRoutePoints(startCity, endCity) {
		const startPoint = await webix.ajax().get(`https://geocoder.api.here.com/6.2/geocode.json?searchtext=${startCity}&gen=9&app_id=1ABRBQas40fithl31gWe&app_code=RSz9AQaADwMmSf8oZYq8sA&language=RU`);
		const endPoint = await webix.ajax().get(`https://geocoder.api.here.com/6.2/geocode.json?searchtext=${endCity}&gen=9&app_id=1ABRBQas40fithl31gWe&app_code=RSz9AQaADwMmSf8oZYq8sA&language=RU`);
		return {
			startCoord: startPoint.json().Response.View[0].Result[0].Location.NavigationPosition[0],
			endCoord: endPoint.json().Response.View[0].Result[0].Location.NavigationPosition[0]
		}
	}

	async getCards() {
		const self = this;
		let cardsObj = [];
		const result = (await webix.ajax().get(`${serverUrl}tracks`)).json();
		const carsAssignedTracks = result.filter(obj => obj.car);
		for (let i = 0; i < carsAssignedTracks.length; i++) {
			const carInfo = (await webix.ajax().get(`${serverUrl}cars/${carsAssignedTracks[i].car.id}`)).json();
			carsAssignedTracks[i].user = carInfo.user;
		}
		const readyForRouteCars = carsAssignedTracks.filter((elem) => elem.user);
		for (let i = 0; i < readyForRouteCars.length; i++) {
			cardsObj.push({
				css: "travelCard",
				height: readyForRouteCars[i].route ? 268 : 118,
				localId: `card${i}`,
				id: `card${i}`,
				data: readyForRouteCars[i],
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
						if (this.data.route !== null) {
							webix.message("Маршрут уже задан для данного автомобиля");
						}
						else {
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
						const cities = this.data.route.route.split(" ");
						if (cities[0] && cities[2]) {
							self.setMarkersForRoute(cities[0], cities[2]);
						}
						else {
							self.setMarkersForRoute();
						}
					}
				},
				template: obj =>
					`<div>
						<div class="card-header">
							<div class="carInfo">
								<div class="cardCarName">${obj.car.model}</div>
								<div class="cardCarNumber">${obj.car.state_number}</div>
							</div>
							<div class="${obj.type === "GPS" ? "cardTrackerGPS" : "cardTrackerGlonass"}">${obj.type}</div>
							<div class="card-icons">
								<span class="mdi mdi-map-marker"></span>
								<span class="mdi mdi-pencil"></span>
								<span class="mdi mdi-delete"></span>
							</div>
						</div>
						${obj.route ? `<div class="route-info">
						<div class="route">
							<b>Маршрут: </b>
							${this.editMode ? `<input type='text' class="routeStartPointInput">` : `<span class="cityName">${obj.route.route}</span></span>`}
						</div>
						<div class="route-distance">
							<div class="fullDistance">${obj.route.distance} км</div>
							<div class="fullTime">${Math.round(obj.route.travelTime)} ч</div>
						</div>
						<div class="routeLine">
							<div class='routeDonePercent' style='width: ${(Math.round(obj.route.distance * 0.7)) /obj.route.distance * 100}%'></div>
						</div>
						<div class="cardRow"><b>Движется со скоростью:</b><span class="cardRowInfo speed"> ${obj.route.speed} км/ч </span></div>
						<div class="cardRow"><b>Пройдено:</b><span class="cardRowInfo"> ${Math.round(obj.route.distance * 0.7)} км</span></div>
						<div class="cardRow"><b>Завершение маршрута:</b><span class="cardRowInfo"> через ${Math.round(obj.route.travelTime * 0.3)} ч</span></div>
					</div>` : ""}
						<div class="cardRow"><b>Водитель:${`</b><span class="cardRowInfo"> ${obj.user.firstName} ${obj.user.lastName}</span></div>`}
						<div class="cardRow"><b>Номер телефона:${`</b><span class="cardRowInfo"> ${obj.user.phoneNumber}</span></div>`}
			
					</div>`
			});
		}
		console.log(cardsObj);
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
			const startPointInput = card.$view.querySelector(".routeStartPointInput");
			const endPointInput = card.$view.querySelector(".routeEndPointInput");
			if (startPointInput && endPointInput) {
				startPointInput.setAttribute("value", card.data.startPoint);
				endPointInput.setAttribute("value", card.data.endPoint);
			}
		}
		else {
			const newStartPoint = card.$view.querySelector(".routeStartPointInput")?.value;
			const newEndPoint = card.$view.querySelector(".routeEndPointInput")?.value;
			
			if (newStartPoint && newEndPoint) {
				this.setMarkersForRoute(newStartPoint, newEndPoint);
				this.getRoutePoints(newStartPoint, newEndPoint).then((res) => {
					this.getDistanceBetweenCities(res).then((result) => {
						const fullDistanceTime = result / 90;
						const hours = Math.trunc(fullDistanceTime);
						const minutes = ((fullDistanceTime - hours) * 60).toFixed();
						card.data.fullDistanceTime = `${hours} ч ${minutes} мин`;
						card.data.restDistanceTime = `${hours} ч ${minutes} мин`;
						card.data.distance = result;
						if (card.data.startPoint !== newStartPoint || card.data.endPoint !== newEndPoint) {
							card.data.startPoint = newStartPoint;
							card.data.endPoint = newEndPoint;
							card.data.doneDistance = 0;
							card.data.speed = "-";
							card.data.status = "С маршрутом"
							if (card.data.wrongRoute) {
								card.data.wrongRoute = false;
							}	
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

	getRandomInt (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
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
