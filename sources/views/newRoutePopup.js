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
		this.cardNumber = cardNumber;
		this.popup.show();
	}

	closePopup() {
		this.popup.hide();
		this.$$("routeFrom").setValue("");
		this.$$("routeTo").setValue("");
	}
}
