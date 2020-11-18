import React from 'react';
import PropTypes from 'prop-types';

function Shell({
	id,
	coordinates,
	pixelRatio,
	coverageArea,
	floorplanWidth,
	floorplanHeight,
	willAddShell,
	showEdgePoints,
	onSetEdgePoint,
}) {
	function onRectHover(e) {
		const fill = e.type === 'mouseenter' ? '#ffbf104d' : '#ffbf1000';
		e.target.setAttribute('fill', fill);
	}

	const shellWidth = coverageArea.length * pixelRatio;
	const shellHeight = coverageArea.width * pixelRatio;
	const basePoint = {
		x: coordinates[0] * floorplanWidth,
		y: coordinates[1] * floorplanHeight,
	};
	const rotation = `${coordinates[2]} ${basePoint.x} ${basePoint.y}`;

	const surroundingRectCoordinates = {
		topLeft: [basePoint.x - shellWidth, basePoint.y - shellHeight],
		top: [basePoint.x, basePoint.y - shellHeight],
		topRight: [basePoint.x + shellWidth, basePoint.y - shellHeight],
		right: [basePoint.x + shellWidth, basePoint.y],
		bottomRight: [basePoint.x + shellWidth, basePoint.y + shellHeight],
		bottom: [basePoint.x, basePoint.y + shellHeight],
		bottomLeft: [basePoint.x - shellWidth, basePoint.y + shellHeight],
		left: [basePoint.x - shellWidth, basePoint.y],
	};

	return (
		<>
			<rect
				id={`shell_rect_${id}`}
				x={basePoint.x}
				y={basePoint.y}
				transform={`rotate(${rotation})`}
				width={`${shellWidth}px`}
				height={`${shellHeight}px`}
				fill={willAddShell ? '#ffbf100d' : '#0000ff0d'}
				stroke={willAddShell ? '#ffc110' : 'blue'}
				strokeWidth={`${(8 * pixelRatio) / 100}px`}
				data-tip={`shell_rect_${id}`}
				/>
			{showEdgePoints &&
				Object.keys(surroundingRectCoordinates).map((position, index) => (
					<rect
						key={index}
						id={`shell_rect-${index}_${id}`}
						x={surroundingRectCoordinates[position][0]}
						y={surroundingRectCoordinates[position][1]}
						transform={`rotate(${rotation})`}
						width={`${shellWidth}px`}
						height={`${shellHeight}px`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetEdgePoint(e.currentTarget)}
						onMouseEnter={onRectHover}
						onMouseLeave={onRectHover}
					/>
				))}
		</>
	);
}

Shell.propTypes = {
	id: PropTypes.number.isRequired,
	coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	pixelRatio: PropTypes.number.isRequired,
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
