class utils {
	toTimeString(timestamp) {
		const elapsed = Date.now()/1000 - timestamp/1000;

		const minuteSecs = 60;
		const hourSecs = minuteSecs * 60;
		const daySecs = hourSecs * 24;
		const weekSecs = daySecs * 7;
		const monthSecs = weekSecs * 4;
		const yearSecs = monthSecs * 12;

		if (elapsed > yearSecs) {
			return Math.round(elapsed / yearSecs).toString() + 'y';
		} else if (elapsed > monthSecs) {
			return Math.round(elapsed / monthSecs).toString() + 'm';
		} else if (elapsed > weekSecs) {
			return Math.round(elapsed / weekSecs).toString() + 'w';
		} else if (elapsed > daySecs) {
			return Math.round(elapsed / daySecs).toString() + 'd';
		} else if (elapsed > hourSecs) {
			return Math.round(elapsed / hourSecs).toString() + 'h';
		} else {
			return Math.round(elapsed / monthSecs).toString() + 'min';
		}
	}
}

export default new utils();