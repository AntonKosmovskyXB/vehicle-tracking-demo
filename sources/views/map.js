import L from "leaflet";
import {JetView} from "webix-jet";

export default class DriversView extends JetView {
	config() {
		return {
			template: ""
		};
		// const newDriver = {
		// 	css: "travelCards",
		// 	width: 300,
		// 	height: 1500,
		// 	rows: [
		// 		{
		// 			cols: [
		// 				{
		// 					view: "search",
		// 					width: 255
		// 				},
		// 				{width: 8},
		// 				{
		// 					view: "button",
		// 					type: "icon",
		// 					icon: "mdi mdi-filter-variant",
		// 					css: "webix_primary filter-button",
		// 					width: 40
		// 				}
		// 			]
		// 		}
		// 	]
		// };

		// const driversList = {
		// 	view: "open-map",
		// 	localId: "map"
		// };

		// return {
		// 	paddingX: 15,
		// 	paddingY: 15,
		// 	cols: [newDriver, {width: 15}, driversList]
		// };
	}

	init() {
		// this.$$("map").getMap(true).then((mapObj) => {
		// 	const mymap = mapObj.setView([53.9, 27.56], 10);
		// 	L.marker([53.9, 27.56]).addTo(mymap);
		// 	L.marker([51.21, 4.4]).addTo(mymap);
		// 	L.marker([53.48, -2.23]).addTo(mymap);
		// 	L.marker([53.33, -6.25]).addTo(mymap);
		// });
	}
}
