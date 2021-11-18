import {JetView} from "webix-jet";

import {incidents19, incidents20, maintenance, mileAge} from "../models/statistics";

export default class DashboardView extends JetView {
	config() {
		const changedDegree = "Изменился угол наклона";
		const routeLiving = "Сошел с маршрута";
		const overSpeed = "Превысил скорость";
		return {
			cols: [
				{
					rows: [
						{
							cols: [
								{
									view: "label",
									label: "Контроль инцидентов"
								},
								{
									view: "richselect",
									width: 230,
									options: ["Все", changedDegree, routeLiving, overSpeed],
									value: "Все",
									on: {
										onChange: (value) => {
											switch (value) {
												case changedDegree:
													this.$$("incidentsChart").define({
														value: "#tiltAngle#",
														series: [],
														line: {
															color: "#024ED7",
															width: 3
														}
													});
													this.$$("incidentsChart").refresh();
													break;
												case routeLiving:
													this.$$("incidentsChart").define({
														value: "#routeLiving#",
														series: [],
														line: {
															color: "#F90C0C",
															width: 3
														}
													});
													this.$$("incidentsChart").refresh();
													break;
												case overSpeed:
													this.$$("incidentsChart").define({
														value: "#overSpeed#",
														series: [],
														line: {
															color: "#04CC67",
															width: 3
														}
													});
													this.$$("incidentsChart").refresh();
													break;
												default:
													this.$$("incidentsChart").define("series", [
														{
															value: "#tiltAngle#",
															line: {
																color: "#024ED7",
																width: 3
															}
														},
														{
															value: "#routeLiving#",
															line: {
																color: "#F90C0C",
																width: 3
															}
														},
														{
															value: "#overSpeed#",
															line: {
																color: "#04CC67",
																width: 3
															}
														}
													]);
													this.$$("incidentsChart").refresh();
													break;
											}
										}
									}
								},
								{
									view: "richselect",
									width: 100,
									options: ["2019", "2020"],
									value: "2020",
									on: {
										onChange: (value) => {
											if (value === "2019") {
												this.$$("incidentsChart").define("data", incidents19);
											}
											else {
												this.$$("incidentsChart").define("data", incidents20);
											}
											this.$$("incidentsChart").refresh();
										}
									}
								}
							]
						},
						{
							view: "chart",
							localId: "incidentsChart",
							type: "spline",
							legend: {
								values: [{text: changedDegree, color: "#024ED7"}, {text: routeLiving, color: "#F90C0C"}, {text: overSpeed, color: "#04CC67"}],
								align: "left",
								valign: "top",
								layout: "x",
								width: 400,
								margin: 10
							},
							value: "#tiltAngle#",
							series: [
								{
									value: "#tiltAngle#",
									line: {
										color: "#024ED7",
										width: 3
									}
								},
								{
									value: "#routeLiving#",
									line: {
										color: "#F90C0C",
										width: 3
									}
								},
								{
									value: "#overSpeed#",
									line: {
										color: "#04CC67",
										width: 3
									}
								}
							],
							barWidth: 30,
							radius: 0,
							data: incidents20,
							xAxis: {
								template: "#month#"
							},
							yAxis: {
								start: 0,
								step: 5,
								end: 50,
								template: value => (value % 5 ? "" : value)
							}
						}
					]
				},
				{
					width: 15
				},
				{
					rows: [
						{
							cols: [
								{
									view: "label",
									label: "Пробег транспорта"
								},
								{
									view: "richselect",
									width: 100,
									options: ["2019", "2020"],
									value: "2020",
									on: {
										onChange: (value) => {
											this.setYearForChart("mileAgeChart", value, "#mileAge19#", "#mileAge20#");
										}
									}
								}
							]
						},
						{
							view: "chart",
							localId: "mileAgeChart",
							type: "spline",
							value: "#mileAge20#",
							label: "#mileAge20#",
							barWidth: 30,
							radius: 0,
							data: mileAge,
							xAxis: {
								template: "#month#"
							},
							yAxis: {
								start: 0,
								step: 2000,
								end: 10000,
								template: value => (value % 20 ? "" : value)
							}
						},
						{
							cols: [
								{
									view: "label",
									label: "Плановое техническое ТО"
								},
								{
									view: "richselect",
									width: 100,
									options: ["2019", "2020"],
									value: "2020",
									on: {
										onChange: (value) => {
											this.setYearForChart("maintenanceChart", value, "#numOfMaintenance19#", "#numOfMaintenance20#");
										}
									}
								}
							]
						},
						{
							view: "chart",
							localId: "maintenanceChart",
							type: "bar",
							value: "#numOfMaintenance20#",
							label: "#numOfMaintenance20#",
							barWidth: 30,
							radius: 0,
							data: maintenance,
							xAxis: {
								template: "#month#"
							},
							yAxis: {
								start: 0,
								step: 10,
								end: 100,
								template: value => (value % 20 ? "" : value)
							}
						}
					]
				}
			]
		};
	}

	setYearForChart(id, year, dataFor19, dataFor20) {
		if (year === "2019") {
			this.$$(id).define("value", dataFor19);
			this.$$(id).define("label", dataFor19);
		}
		else {
			this.$$(id).define("value", dataFor20);
			this.$$(id).define("label", dataFor20);
		}
		this.$$(id).refresh();
	}
}
