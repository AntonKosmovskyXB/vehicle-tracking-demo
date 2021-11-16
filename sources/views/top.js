import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 100,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "", id: "map", icon: "mdi mdi-flag"},
				{value: "", id: "trackers", icon: "mdi mdi-crosshairs-gps"},
				{value: "", id: "cars", icon: "mdi mdi-truck"},
				{value: "", id: "drivers", icon: "mdi mdi-account"},
				{value: "", id: "dashboard", icon: "mdi mdi-chart-box"}
			]
		};

		const ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			cols: [
				{
					paddingX: 5,
					paddingY: 10,
					rows: [menu]
				},
				{
					rows: [
						{
							view: "toolbar",
							borderless: true,
							height: 60,
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
							paddingY: 10,
							paddingX: 5,
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
