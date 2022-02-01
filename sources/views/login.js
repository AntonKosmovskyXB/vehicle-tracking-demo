import {JetView} from "webix-jet";

import serverUrl from "../constants/server";

export default class LoginView extends JetView {
	config() {
		const loginForm = {
			view: "form",
			localId: "loginForm",
			height: 400,
			width: 350,
			borderless: false,
			rows: [
				{height: 10},
				{
					view: "label",
					label: "Отслеживание транспорта",
					css: "loginLabel"
				},
				{height: 10},
				{
					view: "text",
					bottomPadding: 15,
					name: "username",
					label: "Электронная почта",
					labelPosition: "top",
					placeholder: "Введите вашу электронную почту",
					invalidMessage: "Проверьте почту"
				},
				{
					view: "text",
					bottomPadding: 15,
					type: "password",
					name: "pass",
					label: "Пароль",
					labelPosition: "top",
					placeholder: "Введите ваш пароль",
					invalidMessage: "Проверьте пароль"
				},
				{
					view: "checkbox",
					bottomPadding: 15,
					labelRight: "Запомнить меня",
					labelWidth: 0
				},
				{
					view: "button",
					value: "Войти",
					css: "webix_primary",
					click: () => this.doLogin()
				}
			],
			rules: {
				username: webix.rules.isNotEmpty,
				pass: webix.rules.isNotEmpty
			}
		};

		return {
			rows: [
				{},
				{gravity: 0.1},
				{
					cols: [
						{},
						loginForm,
						{}
					]
				},
				{gravity: 1.2}
			]
		};
	}

	init() {

	}

	doLogin() {
		const user = this.app.getService("user");
		const form = this.$$("loginForm");
		if (form.validate()) {
			const data = form.getValues();
			user.login(data.username, data.pass).catch(() => {
				webix.message("Invalid login or password");
			});
		}
	}
}
