function getFloorplanObject(floorplanUrl) {
	return new Promise((resolve, reject) => {
		if (floorplanUrl.trim() === '') {
			resolve({
				floorplan_url: floorplanUrl,
				width: 0,
				height: 0,
			});
		}

		const imgElement = new Image();
		imgElement.onload = function imageOnload() {
			resolve({
				floorplan_url: floorplanUrl,
				width: this.naturalWidth,
				height: this.naturalHeight,
			});
		};
		imgElement.onerror = function imageOnError() {
			reject(new Error('Failed to get floorplan image dimensions'));
		};

		imgElement.src = floorplanUrl;
	});
}

export default getFloorplanObject;
