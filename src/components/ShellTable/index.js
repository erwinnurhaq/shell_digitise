import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'timeago.js';
import { Button } from 'prospace-ui';
import ShellForm from '../ShellForm';
import NoDataImage from '../../assets/no-data.png';
import TableHeadButton from './components/TableHeadButton';
import TablePagination from './components/TablePagination';

const collator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: 'base',
});

function ShellTable({
	isLoading,
	isEditingShell,
	shells,
	searchKeyword,
	filter,
	currentProfile,
	currentShellId,
	currentShellCoordinates,
	setCurrentShellCoordinates,
	isButtonDisabled,
	onDeleteClick,
	onEditClick,
	onSaveEdit,
	onCancelEdit,
	onLocateClick,
}) {
	const [items, setItems] = useState([]);
	const [order, setOrder] = useState('asc');
	const [sort, setSort] = useState('Unit ID');
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(10);

	const tableSectionRef = useRef(null);

	const sortShell = {
		'Shell ID': (a, b) => (order === 'asc' ? a.id - b.id : b.id - a.id),
		'Thermal Sense ID': (a, b) =>
			order === 'asc' ? collator.compare(a.ts_id, b.ts_id) : collator.compare(b.ts_id, a.ts_id),
	};

	function onSort(title) {
		setOrder(() => {
			if (sort === title) {
				return order === 'asc' ? 'desc' : 'asc';
			}
			return 'asc';
		});
		setSort(title);
		setOffset(0);
	}

	useEffect(() => {
		setItems(
			shells
				.filter((item) => (filter.length > 0 ? item.status === filter : true))
				.filter((item) =>
					searchKeyword.length > 0 ? item.ts_id.match(new RegExp(searchKeyword, 'i')) : true
				)
		);
		setOffset(0);
	}, [searchKeyword, filter, shells]);

	return (
		<div className="shell-section__table" ref={tableSectionRef}>
			<table className="ui compact table">
				<thead>
					<tr>
						<th className="shell-id">
							<TableHeadButton title="Unit ID" sort={sort} order={order} onBtnClick={onSort} />
						</th>
						<th className="ts-id">
							<TableHeadButton title="TS ID" sort={sort} order={order} onBtnClick={onSort} />
						</th>
						<th className="ts-mac">MAC Address</th>
						<th className="ts-version">Version</th>
						<th className="ts-status">
							<TableHeadButton title="Status" sort={sort} order={order} onBtnClick={onSort} />
						</th>
						<th className="ts-last-detected">Last Detected</th>
						<th className="ts-thermal-raw-image">Thermal Raw Image</th>
						<th className="button" />
					</tr>
				</thead>
				<tbody>
					{isLoading && (
						<tr style={{ height: '400px' }}>
							<td colSpan="8" style={{ position: 'relative' }}>
								Loading...
							</td>
						</tr>
					)}
					{items.length === 0 && !isLoading && (
						<tr className="center aligned" style={{ height: 100 }}>
							<td colSpan="8">
								<div data-testid="shell-table__empty-data" className="table-empty-data">
									<img src={NoDataImage} alt="no-data-img" />
									<div className="device-light" style={{ margin: 15 }}>
										There is no data
									</div>
								</div>
							</td>
						</tr>
					)}
					{items.length > 0 &&
						!isLoading &&
						items
							.sort(sortShell[sort])
							.slice(offset, offset + limit)
							.map((item) => {
								if (isEditingShell && item.id === currentShellId) {
									return (
										<tr data-testid={`shell-table__container-${item.id}`} key={item.id}>
											<td colSpan={8} style={{ padding: 0 }}>
												<ShellForm
													isEdit
													selectedShell={item}
													shellsCount={items.length}
													currentProfile={currentProfile}
													currentShellCoordinates={currentShellCoordinates}
													setCurrentShellCoordinates={setCurrentShellCoordinates}
													onSave={onSaveEdit}
													onCancel={onCancelEdit}
												/>
											</td>
										</tr>
									);
								}
								return (
									<tr
										data-testid={`shell-table__container-${item.id}`}
										key={item.id}
										className={
											!isEditingShell && item.id === currentShellId ? 'shell-row-selected' : ''
										}
									>
										<td
											data-testid={`shell-table__shell-id-column-${item.id}`}
											className="shell-id"
										>
											<strong>{item.id}</strong>
										</td>
										<td data-testid={`shell-table__ts-id-column-${item.id}`} className="ts-id">
											{item.ts_id}
										</td>
										<td data-testid={`shell-table__mac-column-${item.id}`} className="ts-mac">
											{item.mac_address}
										</td>
										<td
											data-testid={`shell-table__version-column-${item.id}`}
											className="ts-version"
										>
											{item.version}
										</td>
										<td data-testid={`shell-table__status-column-${item.id}`} className="ts-status">
											{item.status}
										</td>
										<td
											data-testid={`shell-table__last-detected-column-${item.id}`}
											className="ts-last-detected"
										>
											{format(item.last_status_update_time)}
										</td>
										<td
											data-testid={`shell-table__thermal-raw-image-column-${item.id}`}
											className="ts-thermal-raw-image"
										>
											<input
												type="checkbox"
												checked={false}
												onChange={() => {}}
												disabled={isButtonDisabled}
											/>
										</td>
										<td className="button">
											<Button
												testId={`shell-table__delete-button-${item.id}`}
												type="tertiary"
												className="delete-button"
												onClick={() => onDeleteClick(item.id)}
												disabledFuncCondition={isButtonDisabled}
												disabledStyleCondition={isButtonDisabled}
											>
												DELETE
											</Button>
											<Button
												testId={`shell-table__edit-button-${item.id}`}
												type="secondary"
												onClick={() => onEditClick(item.id, item.coordinates)}
												disabledFuncCondition={isButtonDisabled}
												disabledStyleCondition={isButtonDisabled}
											>
												EDIT
											</Button>
											<Button
												testId={`shell-table__view-button-${item.id}`}
												type="secondary"
												onClick={() => onLocateClick(item.id)}
												disabledFuncCondition={isButtonDisabled || item.id === currentShellId}
												disabledStyleCondition={isButtonDisabled || item.id === currentShellId}
											>
												LOCATE
											</Button>
										</td>
									</tr>
								);
							})}
				</tbody>
			</table>
			<TablePagination
				limit={limit}
				offset={offset}
				changeLimit={(val) => setLimit(val)}
				changeOffset={(val) => setOffset(val)}
				totalItemCount={items.length}
				scrollToElement={tableSectionRef.current}
			/>
		</div>
	);
}

ShellTable.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	isEditingShell: PropTypes.bool.isRequired,
	shells: PropTypes.arrayOf(PropTypes.object).isRequired,
	searchKeyword: PropTypes.string,
	filter: PropTypes.string,
	currentProfile: PropTypes.objectOf(PropTypes.any).isRequired,
	currentShellId: PropTypes.number.isRequired,
	currentShellCoordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	setCurrentShellCoordinates: PropTypes.func.isRequired,
	isButtonDisabled: PropTypes.bool.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	onEditClick: PropTypes.func.isRequired,
	onSaveEdit: PropTypes.func.isRequired,
	onCancelEdit: PropTypes.func.isRequired,
	onLocateClick: PropTypes.func.isRequired,
};

ShellTable.defaultProps = {
	searchKeyword: '',
	filter: '',
};

export default ShellTable;
