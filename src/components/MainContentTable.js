import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'timeago.js';
import { Button } from 'prospace-ui';
import ShellForm from './ShellForm';

const MainContentTable = ({
	items,
	currentProfile,
	currentEditingShellId,
	currentShellCoordinates,
	isButtonDisabled,
	setCurrentShellCoordinates,
	setCurrentEditingShellId,
	setIsEditingShell,
	onCancelEdit,
}) => {
	return (
		<div className="main-content__table">
			<table className="ui compact table">
				<thead>
					<tr>
						<th className="shell-id">Shell ID</th>
						<th className="ts-id">Thermal Sense ID</th>
						<th className="ts-mac">MAC Address</th>
						<th className="ts-version">Version</th>
						<th className="ts-status">Status</th>
						<th className="ts-last-detected">Last Detected</th>
						<th className="button" />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => {
						if (item.id === currentEditingShellId) {
							return (
								<tr data-testid={`main-table__container-${item.id}`} key={item.id}>
									<td colSpan={7} style={{ padding: 0 }}>
										<ShellForm
											isEdit
											selectedShell={item}
											shellsCount={items.length}
											currentProfile={currentProfile}
											currentShellCoordinates={currentShellCoordinates}
											setCurrentShellCoordinates={setCurrentShellCoordinates}
											onSave={() => {}}
											onCancel={onCancelEdit}
										/>
									</td>
								</tr>
							);
						}
						return (
							<tr data-testid={`main-table__container-${item.id}`} key={item.id}>
								<td data-testid={`main-table__shell-id-column-${item.id}`} className="shell-id">
									<strong>{item.id}</strong>
								</td>
								<td data-testid={`main-table__ts-id-column-${item.id}`} className="ts-id">
									{item.ts_id}
								</td>
								<td data-testid={`main-table__mac-column-${item.id}`} className="ts-mac">
									{item.mac_address}
								</td>
								<td data-testid={`main-table__version-column-${item.id}`} className="ts-version">
									{item.version}
								</td>
								<td data-testid={`main-table__status-column-${item.id}`} className="ts-status">
									{item.status}
								</td>
								<td
									data-testid={`main-table__last-detected-column-${item.id}`}
									className="ts-last-detected"
								>
									{format(item.last_status_update_time)}
								</td>
								<td className="button">
									<Button
										testId={`main-table__delete-button-${item.id}`}
										type="tertiary"
										className="delete-button"
										onClick={() => {}}
										disabledFuncCondition={isButtonDisabled}
										disabledStyleCondition={isButtonDisabled}
									>
										DELETE
									</Button>
									<Button
										testId={`main-table__edit-button-${item.id}`}
										type="secondary"
										onClick={() => {
                      setCurrentEditingShellId(item.id)
                      setCurrentShellCoordinates(item.coordinates);
                      setIsEditingShell(true)
                    }}
										disabledFuncCondition={isButtonDisabled}
										disabledStyleCondition={isButtonDisabled}
									>
										EDIT
									</Button>
									<Button
										testId={`main-table__view-button-${item.id}`}
										type="secondary"
										onClick={() => {}}
										disabledFuncCondition={isButtonDisabled}
										disabledStyleCondition={isButtonDisabled}
									>
										VIEW
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

MainContentTable.propTypes = {
	items: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentProfile: PropTypes.objectOf(PropTypes.any).isRequired,
	currentEditingShellId: PropTypes.number.isRequired,
	currentShellCoordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	isButtonDisabled: PropTypes.bool.isRequired,
	setCurrentShellCoordinates: PropTypes.func.isRequired,
	setCurrentEditingShellId: PropTypes.func.isRequired,
	setIsEditingShell: PropTypes.func.isRequired,
	onCancelEdit: PropTypes.func.isRequired,
};

export default MainContentTable;
