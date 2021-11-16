import {JetView} from "webix-jet";

import {incidents, incidents19, incidents20, maintenance, mileAge} from "../models/statistics";

export default class DashboardView extends JetView {
	config() {
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
									options: ["Все", "Изменился угол наклона", "Сошел с маршрута", "Превысил скорость"],
									value: "Все",
									on: {
										onChange: (value) => {
											if (value === "Изменился угол наклона") {
												this.$$("incidentsChart").define("value", "#tiltAngle#");
												this.$$("incidentsChart").define("series", []);
												this.$$("incidentsChart").define("line", {
													color: "#024ED7",
													width: 3
												});
												this.$$("incidentsChart").refresh();
											}
											else if (value === "Сошел с маршрута") {
												this.$$("incidentsChart").define("value", "#routeLiving#");
												this.$$("incidentsChart").define("series", []);
												this.$$("incidentsChart").define("line", {
													color: "#F90C0C",
													width: 3
												});
												this.$$("incidentsChart").refresh();
											}
											else if (value === "Превысил скорость") {
												this.$$("incidentsChart").define("value", "#overSpeed#");
												this.$$("incidentsChart").define("series", []);
												this.$$("incidentsChart").define("line", {
													color: "#04CC67",
													width: 3
												});
												this.$$("incidentsChart").refresh();
											}
											else {
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
								values: [{text: "Изменился угол наклона", color: "#024ED7"}, {text: "Сошел с маршрута", color: "#F90C0C"}, {text: "Превысил скорость", color: "#04CC67"}],
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
								template: function (value) {
									return (value % 5 ? "" : value);
								}
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
											if (value === "2019") {
												this.$$("mileAgeChart").define("value", "#mileAge19#");
												this.$$("mileAgeChart").define("label", "#mileAge19#");
											}
											else {
												this.$$("mileAgeChart").define("value", "#mileAge20#");
												this.$$("mileAgeChart").define("label", "#mileAge20#");
											}
											this.$$("mileAgeChart").refresh();
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
								template: function (value) {
									return (value % 20 ? "" : value);
								}
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
											if (value === "2019") {
												this.$$("maintenanceChart").define("value", "#numOfMaintenance19#");
												this.$$("maintenanceChart").define("label", "#numOfMaintenance19#");
											}
											else {
												this.$$("maintenanceChart").define("value", "#numOfMaintenance20#");
												this.$$("maintenanceChart").define("label", "#numOfMaintenance20#");
											}
											this.$$("maintenanceChart").refresh();
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
								template: function (value) {
									return (value % 20 ? "" : value);
								}
							}
						}
					]
				}
			]
		};
	}
}
