import {JetView} from "webix-jet";

export default class NewRoutePopup extends JetView {
	config() {
		return {
			view: "popup",
			localId: "addRoutePopup",
			width: 230,
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
						view: "text",
						placeholder: "Откуда",
						localId: "routeFrom"
					},
					{
						view: "text",
						placeholder: "Куда",
						localId: "routeTo"
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
									if (this.editMode) {
										this.app.callEvent("onRouteEdit", [this.cardNumber, this.$$("routeFrom").getValue(), this.$$("routeTo").getValue()]);
									}
									else {
										this.app.callEvent("onRouteAdd", [this.cardNumber, this.$$("routeFrom").getValue(), this.$$("routeTo").getValue()]);
									}
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

	showPopup(cardNumber, editMode) {
		this.editMode = false;
		this.$$("popupLabel").define("label", "Добавить маршрут");
		this.$$("addRouteButton").define("label", "Добавить");
		if (editMode) {
			this.editMode = true;
			this.$$("popupLabel").define("label", "Изменить маршрут");
			this.$$("addRouteButton").define("label", "Сохранить");
			this.$$("popupLabel").refresh();
			this.$$("addRouteButton").refresh();
		}
		this.cardNumber = cardNumber;
		this.popup.show();
	}

	closePopup() {
		this.popup.hide();
		this.$$("routeFrom").setValue("");
		this.$$("routeTo").setValue("");
	}
}
