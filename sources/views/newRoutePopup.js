import {JetView} from "webix-jet";

export default class NewRoutePopup extends JetView {
	config() {
		return {
			view: "popup",
			localId: "addRoutePopup",
			id: "addRoutePopup",
			width: 262,
			height: 196,
			body: {
				paddingX: 15,
				paddingY: 15,
				rows: [
					{
						view: "label",
						localId: "popupLabel",
						label: "Добавить маршрут"
					},
					{
						cols: [
							{
								template: "<img src='../../sources/assets/icons/redMapMarker.svg' width='15' height='21'>",
								width: 15,
								type: "clean",
								css: "markerTemplate"
							},
							{width: 8},
							{
								view: "text",
								placeholder: "Откуда",
								localId: "routeFrom"
							}
						]
					},
					{
						cols: [
							{
								template: "<img src='../../sources/assets/icons/greenMapMarker.svg' width='15' height='21'>",
								width: 15,
								type: "clean",
								css: "markerTemplate"
							},
							{width: 8},
							{
								view: "text",
								placeholder: "Куда",
								localId: "routeTo"
							}
						]
					},
					{height: 15},
					{
						cols: [
							{
								view: "button",
								label: "Отмена",
								click: () => {
									this.closePopup();
								}
							},
							{
								view: "button",
								localId: "addRouteButton",
								label: "Добавить",
								css: "webix_primary",
								click: () => {
									this.app.callEvent("onRouteAdd", [this.cardNumber, this.$$("routeFrom").getValue(), this.$$("routeTo").getValue()]);
									this.closePopup();
								}
							}
						]
					}
				]
			}
		};
	}

	init() {
		this.popup = this.getRoot();
	}

	showPopup(cardNumber) {
		this.$$("popupLabel").define("label", "Добавить маршрут");
		this.$$("addRouteButton").define("label", "Добавить");
		this.cardNumber = cardNumber;
		this.popup.show();
	}

	closePopup() {
		this.popup.hide();
		this.$$("routeFrom").setValue("");
		this.$$("routeTo").setValue("");
	}

	setPosition(x, y) {
		if (y < 200) {
			this.popup.setPosition(x, y);
		}
		else {
			this.popup.setPosition(x, y - 200);
		}
	}
}
