import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'prospace-ui';

function MainContentHeader({
	shells,
  isAddingShell,
  setIsAddingShell,
  setIsShowAddProfileModal,
	isButtonDisabled,
}) {
	return (
		<div className="main-content__header-container">
			<div className="main-content__header">
				<div className="section-content">
					<Button
						disabledFuncCondition={isButtonDisabled}
						disabledStyleCondition={isButtonDisabled}
						onClick={() => setIsAddingShell(true)}
					>
						ADD SHELL
					</Button>
					<Button
						disabledFuncCondition={isButtonDisabled}
						disabledStyleCondition={isButtonDisabled}
						onClick={() => {}}
					>
						ADD BULK SHELL
					</Button>
					<Button
						disabledFuncCondition={isButtonDisabled}
						disabledStyleCondition={isButtonDisabled}
						onClick={() => setIsShowAddProfileModal(true)}
					>
						COVERAGE AREA - PROFILE CREATION
					</Button>
				</div>
				<div className="section-content">
					<div className="ui fluid input">
						<input type="text" placeholder="Search" disabled={isButtonDisabled} />
					</div>
					<Button onClick={() => {}}>RESET</Button>
				</div>
			</div>
			{!isAddingShell && (
				<div className="main-content__header">
					<div className="section-content">
						Total shells on this floor: <strong>{shells.length}</strong>
					</div>
					<div className="section-content">
						<span>Filter:</span>
						<Dropdown value="" onChange={() => {}} isDisabled={isButtonDisabled}>
							<option value="">Select Status</option>
							<option value="active">Active</option>
							<option value="offline">Offline</option>
							<option value="in_inventory">In Inventory</option>
						</Dropdown>
					</div>
				</div>
			)}
		</div>
	);
}

MainContentHeader.propTypes = {
	shells: PropTypes.arrayOf(PropTypes.object).isRequired,
	isAddingShell: PropTypes.bool.isRequired,
	isButtonDisabled: PropTypes.bool.isRequired,
  setIsAddingShell: PropTypes.func.isRequired,
  setIsShowAddProfileModal: PropTypes.func.isRequired,
};

export default MainContentHeader;
