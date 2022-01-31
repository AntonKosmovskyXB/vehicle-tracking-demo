import serverUrl from "../constants/server";

function status() {
	const token = webix.storage.session.get("token");
	if (token) {
		return Promise.resolve({token});
	}
	return Promise.reject();
	// return webix.ajax().post("server/login/status")
	// 	.then(a => a.json());
}

function login(user, pass) {
	return webix.ajax()
		.post(`${serverUrl}auth/login`, {
			username: user, password: pass
		})
		.then(a => a.json())
		.then((data) => {
			if (data) {
				webix.storage.session.put("token", data.access_token);
				webix.storage.session.put("role", data.userData.role);
				return {
					token: data.access_token,
					role: data.userData.role
				};
			}
		});
}

function logout() {
	webix.storage.session.remove("token");
	webix.storage.session.remove("role");
}

export default {
	status, login, logout
};
