webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
	const token = webix.storage.session.get("token");
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
});
