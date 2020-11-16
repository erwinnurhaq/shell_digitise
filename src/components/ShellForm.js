import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'prospace-ui';

function ShellForm({
	isEdit,
	selectedShell,
	shellsCount,
	profiles,
	currentProfileId,
	currentShellCoordinates,
	setCurrentProfileId,
	setCurrentShellCoordinates,
	onSave,
	onCancel,
}) {
	const [shellData, setShellData] = useState({
		ts_id: '',
		mac_address: '',
		version: '',
		location: '',
	});

	const [sensorStatus, setSensorStatus] = useState({
		thermal_sense: '',
		temperature: '',
		humidity: '',
		co2: '',
		voc: '',
		hu_count: '',
	});

	function changePosition(x = 0, y = 0, rotate = 0) {
		setCurrentShellCoordinates([
			isNaN(x) ? 0 : x > 1 ? 1 : x,
			isNaN(y) ? 0 : y > 1 ? 1 : y,
			isNaN(rotate) || rotate > 359 ? 0 : rotate,
		]);
	}

	function isButtonDisabled() {
		if (
			shellData.mac_address.length > 0 &&
			shellData.version.length > 0 &&
			currentProfileId > 0 &&
			currentShellCoordinates.length > 0
		) {
			return false;
		}
		return true;
	}

	useEffect(() => {
		if (isEdit) {
			setShellData(selectedShell);
		} else {
			setShellData({ ...shellData, ts_id: `TS0${Math.floor(Math.random() * 100) + 1}` });
		}
	}, []);

	return (
		<div className="main-content__form-container">
			<div className="form-content">
				<div className="form-content__col">
					<div className="form-content__row title">
						<h4>SHELL ID {isEdit ? selectedShell.id : shellsCount + 1}</h4>
					</div>
					<div className="form-content__row">
						<div className="input-container">
							<h5>Thermal Sense ID</h5>
							<div className="ui input fluid">
								<input type="text" value={shellData.ts_id} disabled />
							</div>
						</div>
						<div className="input-container">
							<h5>MAC Address</h5>
							<div className="ui input fluid">
								<input
									type="text"
									value={shellData.mac_address}
									onChange={(ev) => setShellData({ ...shellData, mac_address: ev.target.value })}
								/>
							</div>
						</div>
						<div className="input-container">
							<h5>Version</h5>
							<div className="ui input fluid">
								<input
									type="text"
									value={shellData.version}
									onChange={(ev) => setShellData({ ...shellData, version: ev.target.value })}
								/>
							</div>
						</div>
						<div className="input-container">
							<h5>Coverage Area Profile</h5>
							<Dropdown
								value={currentProfileId}
								onChange={(ev) => setCurrentProfileId(parseInt(ev.target.value, 10))}
							>
								<option value={0}>Select Profile</option>
								{profiles.length > 0 &&
									profiles.map(({ id, pixel_ratio, coverage_area, ceiling_height }) => (
										<option key={id} value={id}>
											D:{coverage_area.length}x{coverage_area.width} H:
											{ceiling_height} R:
											{pixel_ratio}
										</option>
									))}
							</Dropdown>
						</div>
					</div>
					<div className="form-content__row">
						<div className="input-container coordinates">
							<h5>Coordinates</h5>
							<div className="input-wrapper">
								<div className="ui input">
									<input
										min={0}
										max={1}
										type="number"
										step="0.0001"
										value={currentShellCoordinates[0] || ''}
										placeholder="X"
										onChange={(e) =>
											changePosition(
												parseFloat(e.target.value.replace(/-/g, '')),
												currentShellCoordinates[1],
												currentShellCoordinates[2]
											)
										}
									/>
								</div>
								<div className="ui input">
									<input
										min={0}
										max={1}
										type="number"
										step="0.0001"
										value={currentShellCoordinates[1] || ''}
										placeholder="Y"
										onChange={(e) =>
											changePosition(
												currentShellCoordinates[0],
												parseFloat(e.target.value.replace(/-/g, '')),
												currentShellCoordinates[2]
											)
										}
									/>
								</div>
							</div>
						</div>
						<div className="input-container">
							<h5>Rotate</h5>
							<div className="ui input fluid">
								<input
									min={0}
									max={359}
									type="number"
									placeholder="rotate"
									value={currentShellCoordinates[2] || ''}
									onChange={(e) =>
										changePosition(
											currentShellCoordinates[0],
											currentShellCoordinates[1],
											parseInt(e.target.value.replace(/-/g, ''), 10)
										)
									}
								/>
							</div>
						</div>
						<div className="input-container">
							<h5>Assigned to</h5>
							<div className="ui input fluid">
								<input
									type="text"
									placeholder="N/A"
									value={shellData.location}
									onChange={(ev) => setShellData({ ...shellData, location: ev.target.value })}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="form-content__col">
					<div className="sensor-status__title">
						<h4>SENSOR STATUS</h4>
						<Button type="secondary" onClick={() => {}}>
							CHECK
						</Button>
					</div>
					<ul className="sensor-status__content">
						{Object.keys(sensorStatus).map((status) => {
							const label = {
								thermal_sense: 'Thermal Sense',
								temperature: 'Temperature',
								humidity: 'Humidity',
								co2: 'CO2',
								voc: 'VOC',
								hu_count: 'Hu. Count',
							};
							return (
								<li key={status}>
									<h5>{label[status]}</h5>
									<p>{sensorStatus[status] || '-'}</p>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="button-container">
				<Button type="secondary" onClick={onCancel}>
					CANCEL
				</Button>
				<Button
					disabledFuncCondition={isButtonDisabled()}
					disabledStyleCondition={isButtonDisabled()}
					onClick={() => onSave(shellData)}
				>
					SAVE
				</Button>
			</div>
		</div>
	);
}

ShellForm.propTypes = {
	isEdit: PropTypes.bool,
	selectedShell: PropTypes.objectOf(PropTypes.any),
	shellsCount: PropTypes.number.isRequired,
	profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentProfileId: PropTypes.number.isRequired,
	currentShellCoordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

ShellForm.defaultProps = {
  isEdit: false,
  selectedShell: {},
};

export default ShellForm;
