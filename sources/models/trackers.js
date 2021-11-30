const trackers = new webix.DataCollection({
	data: [
		{id: 1, type: "Глонасс", model: "GloTrack 17VX", serialNumber: "SP109G481LJ2", brand: "Volvo", stateNumber: "C064MK78"},
		{id: 2, type: "GPS", model: "G-Mark Pointer 1", serialNumber: "SP109G481MJ4", brand: "Man", stateNumber: "C478MK78"},
		{id: 3, type: "GPS", model: "G-Mark Pointer 2N", serialNumber: "SP109G482KP8", brand: "Volvo", stateNumber: "C772MK34"},
		{id: 4, type: "Глонасс", model: "GloTrack 2N", serialNumber: "SP109G481KP3", brand: "Scania", stateNumber: "C481MK78"},
		{id: 5, type: "Глонасс", model: "GloTrack 17VX", serialNumber: "SP109G487KP5", brand: "Man", stateNumber: "C912MK78"},
		{id: 6, type: "Глонасс", model: "GloTrack 2N", serialNumber: "SP109G313KS7", brand: "Scania", stateNumber: "C344MK34"},
		{id: 7, type: "GPS", model: "G-Mark Pointer 1", serialNumber: "SP109G21SA9", brand: "Volvo", stateNumber: "C096MK34"}
	]
});

export default trackers;

// var platform = new H.service.Platform({
// 	app_code: "RSz9AQaADwMmSf8oZYq8sA",
// 	app_id: "1ABRBQas40fithl31gWe",
// 	useHTTPS: "secure"
// });

// const params = {
//    mode: 'fastest;car',
//    origin: '53.90,27.56',
//    destination: '55.75,37.61',
//    waypoint0: '53.90,27.56',
//    waypoint1: '55.75,37.61',
//    representation: 'display',
//    routeAttributes: 'summary'
// }
// function calcuateRouteFromAtoB(platform){

// var routingService = platform.getRoutingService()
//    routingService.calculateRoute(params, success => {
// console.log(success);
//    }, error => {
// console.log(error);
//    })
// }
// calcuateRouteFromAtoB(platform);
// });
