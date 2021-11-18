const cards = [
	{
		id: 1,
		model: "Volvo",
		stateNumber: "C064MK78",
		tracker: "GPS",
		driver: "Сергей Иванов",
		phone: "(929) 777-55-77",
		startPoint: "Москва",
		endPoint: "Волгоград",
		group: "Фургон",
		status: "В пути",
		startCoord: [55.45, 37.36],
		endCoord: [48.43, 44.30],
		distance: 976,
		speed: 86,
		doneDistance: 312,
		fullDistanceTime: "11 ч 45 мин",
		restDistanceTime: "6 ч 13 мин",
		readyRoute: true,
		photo: "../sources/assets/photo/volvo.jpg"
	},
	{
		id: 2,
		model: "Scania",
		stateNumber: "C152MK34",
		tracker: "Глонасс",
		driver: "Андрей Давыдов",
		phone: "(929) 109-675-1",
		startPoint: "Минск",
		endPoint: "Москва",
		group: "Фургон",
		status: "В пути",
		startCoord: [53.53, 27.34],
		endCoord: [55.45, 37.36],
		distance: 716,
		speed: 98,
		doneDistance: 511,
		fullDistanceTime: "10 ч 53 мин",
		restDistanceTime: "3 ч 16 мин",
		readyRoute: true,
		photo: "../sources/assets/photo/scania.jpg"
	},
	{
		id: 3,
		model: "Man",
		stateNumber: "C233MK34",
		tracker: "Глонасс",
		status: "Без маршрута",
		driver: "Константин Сидоров",
		phone: "(929) 498-012-3",
		group: "Рефрижератор",
		readyRoute: false,
		photo: "../sources/assets/photo/man.jpg"
	},
	{
		id: 4,
		model: "Scania",
		stateNumber: "C198MK34",
		tracker: "GPS",
		status: "Без маршрута",
		driver: "Максим Заславский",
		phone: "(929) 433-300-2",
		group: "Автоцистерна",
		readyRoute: false,
		photo: "../sources/assets/photo/scania.jpg"
	}
];

export default cards;
