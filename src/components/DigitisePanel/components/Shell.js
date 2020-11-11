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
	onSetCornerPoint,
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

	function onRectHover(e) {
		const fill = e.type === 'mouseenter' ? '#ffbf104d' : '#ffbf1000';
		e.target.setAttribute('fill', fill);
	}

	const shellWidth = (coverageArea.length * resPixelPerCM) / (floorplanRatio / 100);
	const shellHeight = (coverageArea.width * resPixelPerCM) / (floorplanRatio / 100);
	const cornerTopLeft = {
		x: coordinates[0] * floorplanWidth,
		y: coordinates[1] * floorplanHeight,
	};
	const cornerTopRight = {
		x: cornerTopLeft.x + shellWidth,
		y: cornerTopLeft.y,
	};
	const cornerBottomLeft = {
		x: cornerTopLeft.x,
		y: cornerTopLeft.y + shellHeight,
	};
	const cornerBottomRight = {
		x: cornerTopLeft.x + shellWidth,
		y: cornerTopLeft.y + shellHeight,
	};
	const rotation = `${coordinates[2]} ${cornerTopLeft.x} ${cornerTopLeft.y}`;

	return (
		<>
			<rect
				id={`shell_rect_${id}`}
				x={cornerTopLeft.x}
				y={cornerTopLeft.y}
				transform={`rotate(${rotation})`}
				width={`${shellWidth}px`}
				height={`${shellHeight}px`}
				fill={willAddShell ? '#ffbf100d' : '#0000ff0d'}
				stroke={willAddShell ? '#ffc110' : 'blue'}
				strokeWidth={`${4 * (resPixelPerCM / 100)}px`}
			/>
			{showEdgePoints && (
				<>
					<rect
						id={`shell_rect-1_${id}`}
						x={cornerTopLeft.x}
						y={cornerTopLeft.y - shellHeight}
						transform={`rotate(${rotation})`}
						width={`${shellWidth}px`}
						height={`${shellHeight}px`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onRectHover}
						onMouseLeave={onRectHover}
					/>
					<rect
						id={`shell_rect-2_${id}`}
						x={cornerTopRight.x}
						y={cornerTopRight.y}
						transform={`rotate(${rotation})`}
						width={`${shellWidth}px`}
						height={`${shellHeight}px`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onRectHover}
						onMouseLeave={onRectHover}
					/>
					<rect
						id={`shell_rect-3_${id}`}
						x={cornerBottomLeft.x}
						y={cornerBottomLeft.y}
						transform={`rotate(${rotation})`}
						width={`${shellWidth}px`}
						height={`${shellHeight}px`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onRectHover}
						onMouseLeave={onRectHover}
					/>
					<rect
						id={`shell_rect-4_${id}`}
						x={cornerTopLeft.x - shellWidth}
						y={cornerTopLeft.y}
						transform={`rotate(${rotation})`}
						width={`${shellWidth}px`}
						height={`${shellHeight}px`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onRectHover}
						onMouseLeave={onRectHover}
					/>
					<circle
						id={`shell_circle-1_${id}`}
						cx={cornerTopLeft.x}
						cy={cornerTopLeft.y}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`rotate(${rotation})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetCornerPoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
					<circle
						id={`shell_circle-2_${id}`}
						cx={cornerTopRight.x}
						cy={cornerTopRight.y}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`rotate(${rotation})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetCornerPoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
					<circle
						id={`shell_circle-3_${id}`}
						cx={cornerBottomLeft.x}
						cy={cornerBottomLeft.y}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`rotate(${rotation})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetCornerPoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/>
					<circle
						id={`shell_circle-4_${id}`}
						cx={cornerBottomRight.x}
						cy={cornerBottomRight.y}
						r={`${10 * (resPixelPerCM / 100)}`}
						transform={`rotate(${rotation})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetCornerPoint(e.currentTarget)}
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
	onSetCornerPoint: PropTypes.func,
	onSetEdgePoint: PropTypes.func,
};

Shell.defaultProps = {
	willAddShell: false,
	showEdgePoints: false,
	onSetCornerPoint: () => {},
	onSetEdgePoint: () => {},
};

export default Shell;
