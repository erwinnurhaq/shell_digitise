const ca_profile = {
	id: 1,
	pixel_ratio: 50,
	ceiling_height: 3,
	coverage_area: { width: 6, length: 8.4 },
};

const shells_list = new Array(40).fill({}).map((item, idx) => ({
	id: idx + 1,
	status: 'offline',
	last_status_update_time: '2020-10-16T18:54:09.729Z',
	coordinates: [Math.random(), Math.random(), Math.floor(Math.random() * 359) + 1],
	ts_id: `TS000${idx + 1}`,
	mac_address: '24:6F:28:3F:D4:C8',
	version: '1.0',
	location: '',
}));
// const shells_list = [
// 	{
// 		id: 1,
// 		status: 'offline',
// 		last_status_update_time: '2020-10-16T18:54:09.729Z',
// 		coordinates: [0.5, 0.5, 90],
// 		ts_id: `TS0001`,
// 		mac_address: '24:6F:28:3F:D4:C8',
// 		version: '1.0',
// 		location: '',
// 	},
// 	{
// 		id: 2,
// 		status: 'offline',
// 		last_status_update_time: '2020-10-16T18:54:09.729Z',
// 		coordinates: [0.6, 0.6, 45],
// 		ts_id: `TS0002`,
// 		mac_address: '24:6F:28:3F:D4:C8',
// 		version: '1.0',
// 		location: '',
// 	},
// 	{
// 		id: 3,
// 		status: 'offline',
// 		last_status_update_time: '2020-10-16T18:54:09.729Z',
// 		coordinates: [0.7, 0.7, 0],
// 		ts_id: `TS0003`,
// 		mac_address: '24:6F:28:3F:D4:C8',
// 		version: '1.0',
// 		location: '',
// 	}
// ]

export { ca_profile, shells_list };
