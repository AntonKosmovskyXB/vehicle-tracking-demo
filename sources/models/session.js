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
		.then((userData) => {
			if (userData) {
				webix.storage.session.put("token", userData.access_token);
				webix.storage.session.put("role", userData.user.role);
				return {
					token: userData.access_token,
					role: userData.user.role
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
