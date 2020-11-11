import React from 'react';
import PropTypes from 'prop-types';

function HeatPoints({
	id,
	resPixelPerCM,
	coordinates,
	floorplanRatio,
	coverageArea,
	floorplanWidth,
	floorplanHeight,
}) {
	// Assumption that floorplan ratio is plotted on autocad based on A3 paper Size
	// OR we can determine resolution pixel per centimeter on profile (add an input on profile creation)
	// OR set standard resolution pixel per centimeter to be 100 every floorplan
	// const ResPixelPerCM = floorPlanObj.width / 29.7; // A4 Paper Width (29.7 cm)
	// const ResPixelPerCM = floorPlanObj.width / 42.02; // A3 Paper Width (42.02 cm)
	// const ResPixelPerCM = floorPlanObj.width / 59.41; // A2 Paper Width (52.41 cm)
	// if using paper size as standard, image can't be cropped
	// const ResPixelPerCM = 100;

	return (
		<foreignObject
			id={`heatpoints_${id}`}
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
			style={{ position: 'relative' }}
		>
			<canvas
				id={`canvas_${id}`}
				width={`${
					(coverageArea.length * resPixelPerCM) / (floorplanRatio / 100)
				}px`}
				height={`${
					(coverageArea.width * resPixelPerCM) / (floorplanRatio / 100)
				}px`}
			/>
		</foreignObject>
	);
}

HeatPoints.propTypes = {
	id: PropTypes.number.isRequired,
	resPixelPerCM: PropTypes.number.isRequired,
	coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	floorplanRatio: PropTypes.number.isRequired,
	coverageArea: PropTypes.objectOf(PropTypes.any).isRequired,
	floorplanWidth: PropTypes.number.isRequired,
	floorplanHeight: PropTypes.number.isRequired,
};

export default HeatPoints;
