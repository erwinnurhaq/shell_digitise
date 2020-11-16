import React from 'react';
import PropTypes from 'prop-types';

function HeatPoints({
	id,
	coordinates,
	pixelRatio,
	coverageArea,
	floorplanWidth,
	floorplanHeight,
}) {
	return (
		<foreignObject
			id={`heatpoints_${id}`}
			x={`${coordinates[0] * floorplanWidth}`}
			y={`${coordinates[1] * floorplanHeight}`}
			transform={`
        rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
				coordinates[1] * floorplanHeight
			})`}
			width={`${coverageArea.length * pixelRatio}px`}
			height={`${coverageArea.width * pixelRatio}px`}
			style={{ position: 'relative' }}
		>
			<canvas
				id={`canvas_${id}`}
				width={`${coverageArea.length * pixelRatio}px`}
				height={`${coverageArea.width * pixelRatio}px`}
			/>
		</foreignObject>
	);
}

HeatPoints.propTypes = {
	id: PropTypes.number.isRequired,
	coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	pixelRatio: PropTypes.number.isRequired,
	coverageArea: PropTypes.objectOf(PropTypes.any).isRequired,
	floorplanWidth: PropTypes.number.isRequired,
	floorplanHeight: PropTypes.number.isRequired,
};

export default HeatPoints;
