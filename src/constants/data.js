const ca_profiles_list = [
	{
		id: 1,
		floorplan_ratio: 200,
		ceiling_height: 3,
		coverage_area: { width: 6, length: 8.4 },
	},
];

const shells_list = [
	{
		id: 1,
		status: 'offline',
		last_status_update_time: '2020-10-16T18:54:09.729Z',
		profile_id: 1,
		coordinates: [0.16185, 0.71, 0],
		ts_id: 'TS0001',
		mac_address: '24:6F:28:3F:D4:C8',
		version: '1.0',
		location: '',
	},
	{
		id: 2,
		status: 'offline',
		last_status_update_time: '2020-10-16T18:57:20.607Z',
		profile_id: 1,
		coordinates: [0.24832, 0.71, 0],
		ts_id: 'TS0002',
		mac_address: '24:6F:28:3F:D4:C1',
		version: '1.0',
		location: '',
	},
];

export { ca_profiles_list, shells_list };
