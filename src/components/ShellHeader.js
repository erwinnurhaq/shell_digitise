import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'prospace-ui';

function ShellHeader({
	shellsCount,
	isAddingShell,
	setIsAddingShell,
	isButtonDisabled,
	searchKeyword,
	setSearchKeyword,
	filter,
	setFilter,
}) {
	return (
		<div className="shell-section__header-container">
			<div className="shell-section__header">
				<div className="section-content">
					<Button
						disabledFuncCondition={isButtonDisabled}
						disabledStyleCondition={isButtonDisabled}
						onClick={setIsAddingShell}
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
				</div>
				<div className="section-content">
					<div className="ui fluid input">
						<input
							type="text"
							placeholder="Search"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value.replace(/[^\w\s\d-]/gi, ''))}
							disabled={isButtonDisabled}
						/>
					</div>
					<Button
						onClick={() => {
							setSearchKeyword('');
							setFilter('');
						}}
					>
						RESET
					</Button>
				</div>
			</div>
			{!isAddingShell && (
				<div className="shell-section__header">
					<div className="section-content">
						Total shells on this floor: <strong>{shellsCount}</strong>
					</div>
					<div className="section-content">
						<span>Filter:</span>
						<Dropdown
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							isDisabled={isButtonDisabled}
						>
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

ShellHeader.propTypes = {
	shellsCount: PropTypes.number.isRequired,
	isAddingShell: PropTypes.bool.isRequired,
	isButtonDisabled: PropTypes.bool.isRequired,
	setIsAddingShell: PropTypes.func.isRequired,
	searchKeyword: PropTypes.string.isRequired,
	setSearchKeyword: PropTypes.func.isRequired,
	filter: PropTypes.string.isRequired,
	setFilter: PropTypes.func.isRequired,
};

export default ShellHeader;
