import React, { useState, useEffect } from 'react';
import { ca_profile, shells_list } from './constants/data';
import imageTest from './assets/Test_A2_1-200(3).png';
import getFloorplanObject from './utils/getFloorplanObject';
import Header from './components/Header';
import ShellForm from './components/ShellForm';
import ShellHeader from './components/ShellHeader';
import ShellTable from './components/ShellTable';
import DigitisePanel from './components/DigitisePanel';
import ConfirmModal from './components/ConfirmModal';

function App() {
	const [shells, setShells] = useState([]);
	const [currentProfile, setCurrentProfile] = useState({
		id: 0,
		pixel_ratio: 0,
		ceiling_height: 0,
		coverage_area: { width: 0, length: 0 },
	});
	const [currentShellCoordinates, setCurrentShellCoordinates] = useState([]);
	const [currentEditingShellId, setCurrentEditingShellId] = useState(0);
	const [currentDeletingShellId, setCurrentDeletingShellId] = useState(0);
	const [floorplan, setFloorplan] = useState({
		floorplan_url: '',
		width: 1,
		height: 1,
	});

	const [isShowHeatpoints, setIsShowHeatpoints] = useState(false);
	const [isShowHeatmaps, setIsShowHeatmaps] = useState(false);
	const [isAddingShell, setIsAddingShell] = useState(false);
	const [isEditingShell, setIsEditingShell] = useState(false);
	const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

	function checkShellCoordinatesRotation() {
		if (currentShellCoordinates[2] < 0) {
			currentShellCoordinates.splice(2, 1, currentShellCoordinates[2] + 360);
		}
	}

	function addShell({ ts_id, mac_address, version, location }) {
		checkShellCoordinatesRotation();
		setShells([
			...shells,
			{
				id: shells.map((shell) => shell.id).sort((a, b) => b - a)[0] + 1,
				status: 'offline',
				last_status_update_time: new Date().toISOString(),
				coordinates: currentShellCoordinates,
				ts_id,
				mac_address,
				version,
				location,
			},
		]);
		setCurrentShellCoordinates([]);
		setIsAddingShell(false);
	}

	function editShell({ ts_id, mac_address, version, location }) {
		checkShellCoordinatesRotation();
		setShells(
			shells.map((shell) => {
				if (shell.id === currentEditingShellId) {
					return {
						id: currentEditingShellId,
						status: 'offline',
						last_status_update_time: new Date().toISOString(),
						coordinates: currentShellCoordinates,
						ts_id,
						mac_address,
						version,
						location,
					};
				}
				return shell;
			})
		);
		setCurrentShellCoordinates([]);
		setCurrentEditingShellId(0);
		setIsEditingShell(false);
	}

	function deleteShell() {
		setShells(shells.filter((shell) => shell.id !== currentDeletingShellId));
		setCurrentDeletingShellId(0);
		setIsShowDeleteModal(false);
	}

	function cancelShellForm() {
		setCurrentShellCoordinates([]);
		setCurrentEditingShellId(0);
		setIsAddingShell(false);
		setIsEditingShell(false);
	}

	useEffect(() => {
		getFloorplanObject(imageTest).then((floorplanObj) => {
			setFloorplan(floorplanObj);
			setCurrentProfile(ca_profile);
			setShells(shells_list);
		});
	}, []); // eslint-disable-line

	return (
		<div className="ts-container">
			{isShowDeleteModal && (
				<ConfirmModal
					isShow
					title={`Are you sure you want to delete ${
						shells.find((shell) => shell.id === currentDeletingShellId).ts_id
					}?`}
					infoPrefix="WARNING"
					info="This cannot be undone"
					onCancel={() => {
						setCurrentDeletingShellId(0);
						setIsShowDeleteModal(false);
					}}
					onYes={deleteShell}
				/>
			)}
			<Header
				isShowHeatpoints={isShowHeatpoints}
				isShowHeatmaps={isShowHeatmaps}
				setIsShowHeatpoints={setIsShowHeatpoints}
				setIsShowHeatmaps={setIsShowHeatmaps}
				isAddingShell={isAddingShell}
				isEditingShell={isEditingShell}
			/>
			<div className="ts-content">
				<div className="ui segment fluid container digitise-panel-section">
					<DigitisePanel
						shells={shells}
						floorplan={floorplan}
						isShowHeatmaps={isShowHeatmaps}
						isShowHeatpoints={isShowHeatpoints}
						currentProfile={currentProfile}
						currentEditingShellId={currentEditingShellId}
						currentShellCoordinates={currentShellCoordinates}
						setCurrentShellCoordinates={setCurrentShellCoordinates}
						isAddingShell={isAddingShell}
						isEditingShell={isEditingShell}
					/>
				</div>
				<div className="ui segment fluid container shell-section">
					<ShellHeader
						shells={shells}
						isButtonDisabled={isAddingShell || isEditingShell}
						isAddingShell={isAddingShell}
						setIsAddingShell={(val) => {
							setIsAddingShell(val);
							setIsShowHeatmaps(false);
							setIsShowHeatpoints(false);
						}}
					/>
					{isAddingShell && (
						<ShellForm
							shellsCount={shells.length}
							currentProfile={currentProfile}
							currentShellCoordinates={currentShellCoordinates}
							setCurrentShellCoordinates={setCurrentShellCoordinates}
							onSave={addShell}
							onCancel={cancelShellForm}
						/>
					)}
					<ShellTable
						items={shells}
						currentProfile={currentProfile}
						currentEditingShellId={currentEditingShellId}
						currentShellCoordinates={currentShellCoordinates}
						setCurrentShellCoordinates={setCurrentShellCoordinates}
						isButtonDisabled={isAddingShell || isEditingShell}
						onDeleteClick={(id) => {
							setCurrentDeletingShellId(id);
							setIsShowDeleteModal(true);
						}}
						onEditClick={(id, coordinates) => {
							setCurrentEditingShellId(id);
							setCurrentShellCoordinates(coordinates);
							setIsEditingShell(true);
						}}
						onSaveEdit={editShell}
						onCancelEdit={cancelShellForm}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
