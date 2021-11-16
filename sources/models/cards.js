const cards = new webix.DataCollection({
	data: [
		{
			id: 1,
			model: "Volvo",
			stateNumber: "C064MK78",
			tracker: "GPS",
			driver: "Сергей Иванов",
			phone: "(929) 777-55-77",
			startPoint: "Москва",
			endPoint: "Волгоград",
			startCoord: [55.45, 37.36],
			endCoord: [48.43, 44.30],
			distance: 976,
			speed: 80,
			doneDistance: 312,
			fullDistanceTime: "11 ч 45 мин",
			restDistanceTime: "6 ч 13 мин",
			photo: "../sources/assets/photo/volvo.jpg"
		},
		{
			id: 2,
			model: "Scania",
			stateNumber: "C152MK34",
			tracker: "GPS",
			driver: "Сергей Иванов",
			phone: "(929) 777-55-77",
			startPoint: "Москва",
			endPoint: "Волгоград",
			startCoord: [55.45, 37.36],
			endCoord: [48.43, 44.30],
			distance: 976,
			speed: 80,
			doneDistance: 312,
			fullDistanceTime: "11 ч 45 мин",
			restDistanceTime: "6 ч 13 мин",
			photo: "../sources/assets/photo/volvo.jpg"
		}
	]
});

export default cards;
