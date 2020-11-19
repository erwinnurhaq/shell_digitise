import React, { useState, useEffect } from 'react';
import { shells_list } from './constants/data';
import imageTest from './assets/Test1.jpg';
import getFloorplanObject from './utils/getFloorplanObject';
import Header from './components/Header';
import MainContentHeader from './components/MainContentHeader';
import ShellForm from './components/ShellForm';
import MainContentTable from './components/MainContentTable';
import DigitisePanel from './components/DigitisePanel';

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
	const [floorplan, setFloorplan] = useState({
		floorplan_url: '',
		width: 1,
		height: 1,
	});

	const [isShowHeatpoints, setIsShowHeatpoints] = useState(false);
	const [isShowHeatmaps, setIsShowHeatmaps] = useState(false);
	const [isAddingShell, setIsAddingShell] = useState(false);
	const [isEditingShell, setIsEditingShell] = useState(false);

	function addShell({ ts_id, mac_address, version, location }) {
		if (currentShellCoordinates[2] < 0) {
			currentShellCoordinates.splice(2, 1, currentShellCoordinates[2] + 360);
		}
		setShells([
			...shells,
			{
				id: shells.map((shell) => shell.id).sort((a, b) => b - a)[0] + 1,
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

	// TODO
	function editShell() {
		return null;
	}

	// TODO
	function deleteShell() {
		return null;
	}

	function cancelShellForm() {
		setCurrentShellCoordinates([]);
		setCurrentEditingShellId(0);
		setIsAddingShell(false);
		setIsEditingShell(false);
	}

	useEffect(() => {
		getFloorplanObject(imageTest).then((floorplan) => {
			setFloorplan(floorplan);
			setCurrentProfile({
				id: 1,
				pixel_ratio: 50,
				ceiling_height: 3,
				coverage_area: { width: 6, length: 8.4 },
			});
			setShells(shells_list);
		});
	}, []);

	return (
		<div className="App">
			<Header
				isShowHeatpoints={isShowHeatpoints}
				isShowHeatmaps={isShowHeatmaps}
				setIsShowHeatpoints={setIsShowHeatpoints}
				setIsShowHeatmaps={setIsShowHeatmaps}
				isAddingShell={isAddingShell}
			/>
			<div className="main">
				<div className="ui segment fluid container digitise-panel-content">
					<DigitisePanel
						shells={shells}
						floorplan={floorplan}
						isShowHeatmaps={isShowHeatmaps}
						isShowHeatpoints={isShowHeatpoints}
						currentProfile={currentProfile}
						currentShellCoordinates={currentShellCoordinates}
						setCurrentShellCoordinates={setCurrentShellCoordinates}
						isAddingShell={isAddingShell}
					/>
				</div>
				<div className="ui segment fluid container main-content">
					<MainContentHeader
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
							onSave={(data) => addShell(data)}
							onCancel={cancelShellForm}
						/>
					)}
					<MainContentTable
						items={shells}
						currentProfile={currentProfile}
						currentEditingShellId={currentEditingShellId}
						currentShellCoordinates={currentShellCoordinates}
						isButtonDisabled={isAddingShell || isEditingShell}
						setCurrentShellCoordinates={setCurrentShellCoordinates}
						setCurrentEditingShellId={setCurrentEditingShellId}
						setIsEditingShell={setIsEditingShell}
						onCancelEdit={cancelShellForm}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
