function generateMockHeatmaps(shells) {
	const data = [];
	let id = 1;
	while (id <= shells.length) {
		const heatmaps = [];
		for (let i = 0; i < 768; i++) {
			heatmaps.push(parseFloat((Math.random() * (32 - 23) + 23).toFixed(2)));
		}
		data.push({ id, shell_id: shells[id - 1].id, heatmaps });
		id++;
	}
	return data;
}

function generateMockHeatpoints(shells) {
	const data = [];
	let id = 1;
	while (id <= shells.length) {
		const heatpoints = [];
		for (let i = 0; i < 10; i++) {
			heatpoints.push([parseInt(Math.random() * 32) + 1, parseInt(Math.random() * 24) + 1]);
		}
		data.push({ id, shell_id: shells[id - 1].id, heatpoints });
		id++;
	}
	return data;
}

export { generateMockHeatmaps, generateMockHeatpoints };
