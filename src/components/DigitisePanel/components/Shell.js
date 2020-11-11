import React from 'react';
import PropTypes from 'prop-types';

function Shell({
	id,
	resPixelPerCM,
	coordinates,
	floorplanRatio,
	coverageArea,
	floorplanWidth,
	floorplanHeight,
	willAddShell,
	showEdgePoints,
	onSetEdgePoint,
}) {
	// Assumption that floorplan ratio is plotted on autocad based on A3 paper Size
	// OR we can determine resolution pixel per centimeter on profile (add an input on profile creation)
	// OR set standard resolution pixel per centimeter to be 100 every floorplan
	// const ResPixelPerCM = floorPlanObj.width / 29.7; // A4 Paper Width (29.7 cm)
	// const ResPixelPerCM = floorPlanObj.width / 42.02; // A3 Paper Width (42.02 cm)
	// const ResPixelPerCM = floorPlanObj.width / 59.41; // A2 Paper Width (52.41 cm)
	// if using paper size as standard, image can't be cropped
	// const ResPixelPerCM = 100;
	function onCircleHover(e) {
		const radius = e.type === 'mouseenter' ? 20 : 10;
		const fill = e.type === 'mouseenter' ? '#ffc110' : '#ffbf1000';
		e.target.setAttribute('r', `${radius * (resPixelPerCM / 100)}`);
		e.target.setAttribute('fill', fill);
	}

	return (
		<>
			<rect
				id={`shell_rect_${id}`}
				x={`${coordinates[0] * floorplanWidth}`}
				y={`${coordinates[1] * floorplanHeight}`}
				transform={`
					rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
					coordinates[1] * floorplanHeight
				})`}
				width={`${
					(coverageArea.length * resPixelPerCM) / (floorplanRatio / 100)
				}px`}
				height={`${
					(coverageArea.width * resPixelPerCM) / (floorplanRatio / 100)
				}px`}
				fill={willAddShell ? '#ffbf100d' : '#0000ff0d'}
				stroke={willAddShell ? '#ffc110' : 'blue'}
				strokeWidth={`${4 * (resPixelPerCM / 100)}px`}
				onDrag={(e) => console.log(e)}
			/>
			{showEdgePoints && (
				<>
					<circle
						id={`shell_circle-1_${id}`}
						cx={`${coordinates[0] * floorplanWidth}`}
						cy={`${coordinates[1] * floorplanHeight}`}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`
						rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
							coordinates[1] * floorplanHeight
						})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
					<circle
						id={`shell_circle-2_${id}`}
						cx={`${
							coordinates[0] * floorplanWidth +
							(coverageArea.length * resPixelPerCM) / (floorplanRatio / 100)
						}`}
						cy={`${coordinates[1] * floorplanHeight}`}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`
						rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
							coordinates[1] * floorplanHeight
						})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
					<circle
						id={`shell_circle-3_${id}`}
						cx={`${coordinates[0] * floorplanWidth}`}
						cy={`${
							coordinates[1] * floorplanHeight +
							(coverageArea.width * resPixelPerCM) / (floorplanRatio / 100)
						}`}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`
						rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
							coordinates[1] * floorplanHeight
						})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
					<circle
						id={`shell_circle-4_${id}`}
						cx={`${
							coordinates[0] * floorplanWidth +
							(coverageArea.length * resPixelPerCM) / (floorplanRatio / 100)
						}`}
						cy={`${
							coordinates[1] * floorplanHeight +
							(coverageArea.width * resPixelPerCM) / (floorplanRatio / 100)
						}`}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`
						rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
							coordinates[1] * floorplanHeight
						})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
				</>
			)}
		</>
	);
}

Shell.propTypes = {
	id: PropTypes.number.isRequired,
	resPixelPerCM: PropTypes.number.isRequired,
	coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	floorplanRatio: PropTypes.number.isRequired,
	coverageArea: PropTypes.objectOf(PropTypes.any).isRequired,
	floorplanWidth: PropTypes.number.isRequired,
	floorplanHeight: PropTypes.number.isRequired,
	willAddShell: PropTypes.bool,
	showEdgePoints: PropTypes.bool,
	onSetEdgePoint: PropTypes.func,
};

Shell.defaultProps = {
	willAddShell: false,
	showEdgePoints: false,
	onSetEdgePoint: () => {},
};

export default Shell;
