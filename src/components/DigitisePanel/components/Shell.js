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
	onSetCornerPoint,
	onSetEdgePoint,
}) {
	function onCircleHover(e) {
		const radius = e.type === 'mouseenter' ? 20 : 10;
		const fill = e.type === 'mouseenter' ? '#ffc110' : '#ffbf1000';
		e.target.setAttribute('r', `${radius}`);
		e.target.setAttribute('fill', fill);
	}

	function onRectHover(e) {
		const fill = e.type === 'mouseenter' ? '#ffbf104d' : '#ffbf1000';
		e.target.setAttribute('fill', fill);
	}

	const shellWidth = coverageArea.length * pixelRatio;
	const shellHeight = coverageArea.width * pixelRatio;
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
				strokeWidth={`${8 * pixelRatio / 100}px`}
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
					{/* <circle
						id={`shell_circle-1_${id}`}
						cx={cornerTopLeft.x}
						cy={cornerTopLeft.y}
						r={`${20 * pixelRatio / 100}px`}
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
						r={`${20 * pixelRatio / 100}px`}
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
						r={`${20 * pixelRatio / 100}px`}
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
						r={`${20 * pixelRatio / 100}px`}
						transform={`rotate(${rotation})`}
						fill="#ffbf1000"
						style={{ transition: '0.2s ease' }}
						onMouseDown={(e) => onSetCornerPoint(e.currentTarget)}
						onMouseEnter={onCircleHover}
						onMouseLeave={onCircleHover}
					/> */}
				</>
			)}
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
