import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'prospace-ui';
import CloseIcon from '../assets/close.png';

function AddProfileModal({ onCancel, onSave }) {
	const [floorplanRatio, setFloorplanRatio] = useState('');
	const [ceilingHeight, setCeilingHeight] = useState('');
	const [coverageArea, setCoverageArea] = useState({
		width: '',
		length: '',
	});

	const isComponentMounted = useRef(false);

	function saveProfile() {
		const CAProfile = {
			floorplan_ratio: parseInt(floorplanRatio, 10),
			ceiling_height: parseFloat(ceilingHeight, 10),
			coverage_area: {
				width: parseFloat(coverageArea.width),
				length: parseFloat(coverageArea.length),
			},
		};

		onSave(CAProfile);
	}

	function isButtonDisabled() {
		if (
			floorplanRatio === '' ||
			ceilingHeight === '' ||
			coverageArea.width === '' ||
			coverageArea.length === ''
		)
			return true;
		return false;
	}

	useEffect(() => {
		isComponentMounted.current = true;
		return () => {
			isComponentMounted.current = false;
		};
	}, []);

	return (
		<div
			data-testid="confirm-modal__container"
			className=" ui active dimmer add-coverage-modal-container"
		>
			<div className="ui fluid segment add-coverage-modal__wrapper">
				<div className="add-coverage-modal__title">
					<h3>Add Coverage Area</h3>
					<div
						data-testid="add-coverage-modal__close-button"
						role="button"
						tabIndex={0}
						onKeyUp={() => {}}
						className="close-button"
						onClick={onCancel}
					>
						<img src={CloseIcon} alt="close-icon" />
					</div>
				</div>
				<hr />
				<div className="form-container">
					<div className="input-container">
						<h5>Width (in meter)</h5>
						<div className="ui input fluid">
							<input
								min={0}
								type="number"
								placeholder="(m)"
								value={coverageArea.width}
								onChange={(ev) =>
									setCoverageArea({ ...coverageArea, width: ev.target.value })
								}
							/>
						</div>
					</div>
					<div className="input-container">
						<h5>Length (in meter)</h5>
						<div className="ui input fluid">
							<input
								min={0}
								type="number"
								placeholder="(m)"
								value={coverageArea.length}
								onChange={(ev) =>
									setCoverageArea({ ...coverageArea, length: ev.target.value })
								}
							/>
						</div>
					</div>
					<div className="input-container">
						<h5>Floorplan Ratio</h5>
						<Dropdown
							isFluid
							value={floorplanRatio}
							onChange={(ev) => setFloorplanRatio(ev.target.value)}
						>
							<option value="0">Select Ratio</option>
							<option value="50">1 : 50</option>
							<option value="100">1 : 100</option>
							<option value="150">1 : 150</option>
							<option value="200">1 : 200</option>
							<option value="250">1 : 250</option>
							<option value="500">1 : 500</option>
						</Dropdown>
					</div>
					<div className="input-container">
						<h5>
							Ceiling Height (in meter)<sup>*</sup>
						</h5>
						<div className="ui input fluid">
							<input
								min={0}
								type="number"
								placeholder="(m)"
								value={ceilingHeight}
								onChange={(ev) => setCeilingHeight(ev.target.value)}
							/>
						</div>
					</div>
					<p className="notes">
						<sup>*</sup> For recording purpose only
					</p>
				</div>
				<div className="button-container">
					<Button
						testId="add-coverage-modal__cancel-button"
						type="secondary"
						onClick={onCancel}
					>
						CANCEL
					</Button>
					<Button
						testId="add-coverage-modal__add-coverage-button"
						disabledFuncCondition={isButtonDisabled()}
						disabledStyleCondition={isButtonDisabled()}
						onClick={saveProfile}
					>
						SAVE
					</Button>
				</div>
			</div>
		</div>
	);
}

AddProfileModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

export default AddProfileModal;
