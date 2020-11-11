import React, { useState, useEffect, useRef } from 'react';
import { ca_profiles_list, shells_list } from './constants/data';
import imageTest from './assets/Test_A2_1-200(3).png';
import getFloorplanObject from './utils/getFloorplanObject';
import Header from './components/Header';
import MainContentHeader from './components/MainContentHeader';
import ShellForm from './components/ShellForm';
import AddProfileModal from './components/AddProfileModal';
import MainContentTable from './components/MainContentTable';
import DigitisePanel from './components/DigitisePanel';

function App() {
	const [profiles, setProfiles] = useState([]);
	const [shells, setShells] = useState([]);
	const [currentProfileId, setCurrentProfileId] = useState(0);
	const [currentShellCoordinates, setCurrentShellCoordinates] = useState([]);
	const [currentEditingShellId, setCurrentEditingShellId] = useState(0);
	const [floorplan, setFloorplan] = useState({
		floorplan_url: '',
		width: 1,
		height: 1,
	});

	const [isShowHeatpoints, setIsShowHeatpoints] = useState(false);
	const [isShowHeatmaps, setIsShowHeatmaps] = useState(false);
	const [isShowAddProfileModal, setIsShowAddProfileModal] = useState(false);
	const [isAddingShell, setIsAddingShell] = useState(false);
	const [isEditingShell, setIsEditingShell] = useState(false);

	function addProfile({ floorplan_ratio, ceiling_height, coverage_area }) {
		setProfiles([
			...profiles,
			{
				id: Math.floor(Math.random() * 100) + 1,
				floorplan_ratio,
				ceiling_height,
				coverage_area,
			},
		]);
	}

	function addShell({ ts_id, mac_address, version, location }) {
		setShells([
			...shells,
			{
				id: Math.floor(Math.random() * 100) + 1,
				profile_id: currentProfileId,
				profile: profiles.find((profile) => profile.id === currentProfileId),
				coordinates: currentShellCoordinates,
				ts_id,
				mac_address,
				version,
				location,
			},
		]);
		setCurrentProfileId(0);
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
		setCurrentProfileId(0);
		setCurrentEditingShellId(0);
		setIsAddingShell(false);
		setIsEditingShell(false);
	}

	useEffect(() => {
		getFloorplanObject(imageTest).then((floorplan) => {
			setFloorplan(floorplan);
			setProfiles(ca_profiles_list);
			setShells(
				shells_list.map((shell) => ({
					...shell,
					profile: ca_profiles_list.find((profile) => profile.id === shell.profile_id),
				}))
			);
		});
	}, []);

	return (
		<div className="App">
			{isShowAddProfileModal && (
				<AddProfileModal onSave={addProfile} onCancel={() => setIsShowAddProfileModal(false)} />
			)}
			<Header
				isShowHeatpoints={isShowHeatpoints}
				isShowHeatmaps={isShowHeatmaps}
				setIsShowHeatpoints={setIsShowHeatpoints}
				setIsShowHeatmaps={setIsShowHeatmaps}
			/>
			<div className="main">
				<div className="ui segment fluid container digitise-panel-content">
					<DigitisePanel
						shells={shells}
						profiles={profiles}
						floorplan={floorplan}
						isShowHeatmaps={isShowHeatmaps}
						isShowHeatpoints={isShowHeatpoints}
						currentProfileId={currentProfileId}
						currentShellCoordinates={currentShellCoordinates}
						setCurrentShellCoordinates={setCurrentShellCoordinates}
						isAddingShell={isAddingShell}
					/>
				</div>
				<div className="ui segment fluid container main-content">
					<MainContentHeader
						shells={shells}
						isButtonDisabled={isAddingShell || isEditingShell || isShowAddProfileModal}
						isAddingShell={isAddingShell}
						setIsAddingShell={setIsAddingShell}
						setIsShowAddProfileModal={setIsShowAddProfileModal}
					/>
					{isAddingShell && (
						<ShellForm
							shellsCount={shells.length}
							profiles={profiles}
							currentProfileId={currentProfileId}
							currentShellCoordinates={currentShellCoordinates}
							setCurrentProfileId={setCurrentProfileId}
							setCurrentShellCoordinates={setCurrentShellCoordinates}
							onSave={(data) => addShell(data)}
							onCancel={cancelShellForm}
						/>
					)}
					<MainContentTable
						items={shells}
						profiles={profiles}
						currentProfileId={currentProfileId}
						currentEditingShellId={currentEditingShellId}
						currentShellCoordinates={currentShellCoordinates}
						isButtonDisabled={isAddingShell || isEditingShell || isShowAddProfileModal}
						setCurrentProfileId={setCurrentProfileId}
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
