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
							borderless: true,
							height: 57,
							cols: [
								{
									view: "label",
									label: "Отслеживание транспорта",
									css: "pageHeaderLabel"
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
			scroll: "auto",
			body: {
				rows: [ui]
			}
		};
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		webix.CustomScroll.init();
	}
}
