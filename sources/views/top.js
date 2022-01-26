import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 56,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "", id: "map", icon: "mdi mdi-map"},
				{value: "", id: "trackers", icon: "mdi mdi-crosshairs-gps"},
				{value: "", id: "cars", icon: "mdi mdi-truck"},
				{value: "", id: "drivers", icon: "mdi mdi-account"},
				{value: "", id: "dashboard", icon: "mdi mdi-view-dashboard"}
			]
		};

		const ui = {
			type: "clean",
			css: "app_layout",
			cols: [
				{
					rows: [menu]
				},
				{
					rows: [
						{
							view: "toolbar",
							css: "mainToolbar",
							borderless: true,
							height: 56.5,
							cols: [
								{
									view: "label",
									label: "Отслеживание транспорта",
									css: "pageHeaderLabel"
								},
								{},
								{
									view: "button",
									label: "Выйти",
									width: 100,
									css: "webix_primary",
									click: () => {
										webix.confirm({
											text: "Вы уверены, что хотите выйти из учетной записи?",
											ok: "ОК",
											cancel: "Отменить"
										}).then(() => {
											const user = this.app.getService("user");
											this.show("/login");
											user.logout();
										});
									}
								}
							]
						},
						{
							type: "wide",
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return {
			view: "scrollview",
			localId: "scrollview",
			scroll: "auto",
			body: {
				rows: [ui]
			}
		};
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		webix.CustomScroll.init();
		webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
			const token = webix.storage.session.get("token");
			if (token && !url.includes("geocoder.api.here.com")) {
				headers.Authorization = `Bearer ${token}`;
			}
		});
	}
}
