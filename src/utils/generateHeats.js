function generateHeatmaps(num) {
	const data = [];
	let id = 1;
	while (id <= num) {
		const heatmaps = [];
		for (let i = 0; i < 768; i++) {
			heatmaps.push(parseFloat((Math.random() * (32 - 23) + 23).toFixed(2)));
		}
		data.push({ id, heatmaps });
		id++;
	}
	return data;
}

function generateHeatpoints(num) {
	const data = [];
	let id = 1;
	while (id <= num) {
		const heatpoints = [];
		for (let i = 0; i < 10; i++) {
			heatpoints.push([parseFloat(Math.random()), parseFloat(Math.random())]);
		}
		data.push({ id, heatpoints });
		id++;
	}
	return data;
}

export { generateHeatmaps, generateHeatpoints };
