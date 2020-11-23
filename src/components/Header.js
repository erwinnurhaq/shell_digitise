import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'prospace-ui';

function Header({
	isShowHeatpoints,
	isShowHeatmaps,
	setIsShowHeatpoints,
	setIsShowHeatmaps,
	isAddingShell,
	isEditingShell,
}) {
	return (
		<div className="header">
			<Dropdown value="" onChange={() => {}} isDisabled>
				<option value="">Select Floor</option>
				<option value=""></option>
			</Dropdown>
			<div className="toggle-status-container">
				<label>Heatpoints</label>
				<input
					type="checkbox"
					checked={isShowHeatpoints}
					onChange={(ev) => {
						setIsShowHeatpoints(ev.target.checked);
						setIsShowHeatmaps(false);
					}}
					disabled={isAddingShell || isEditingShell}
				/>
			</div>
			<div className="toggle-status-container">
				<label>Heatmaps</label>
				<input
					type="checkbox"
					checked={isShowHeatmaps}
					onChange={(ev) => {
						setIsShowHeatmaps(ev.target.checked);
						setIsShowHeatpoints(false);
					}}
					disabled={isAddingShell || isEditingShell}
				/>
			</div>
		</div>
	);
}

Header.propTypes = {
	isShowHeatpoints: PropTypes.bool.isRequired,
	isShowHeatmaps: PropTypes.bool.isRequired,
	setIsShowHeatpoints: PropTypes.func.isRequired,
	setIsShowHeatmaps: PropTypes.func.isRequired,
	isAddingShell: PropTypes.bool.isRequired,
	isEditingShell: PropTypes.bool.isRequired,
};

export default Header;
