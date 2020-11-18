const ca_profiles_list = [
	{
		id: 1,
		pixel_ratio: 50,
		ceiling_height: 3,
		coverage_area: { width: 6, length: 8.4 },
	},
];

const shells_list = new Array(10).fill({}).map((item, idx) => ({
	id: idx + 1,
	status: 'offline',
	last_status_update_time: '2020-10-16T18:54:09.729Z',
	profile_id: 1,
	coordinates: [Math.random(), Math.random(), 0],
	ts_id: `TS000${idx + 1}`,
	mac_address: '24:6F:28:3F:D4:C8',
	version: '1.0',
	location: '',
}))

export { ca_profiles_list, shells_list };
