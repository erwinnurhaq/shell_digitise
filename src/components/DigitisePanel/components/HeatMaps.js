import React from 'react';
import PropTypes from 'prop-types';

function HeatMaps({ id, coordinates, floorplanWidth, floorplanHeight }) {
	return (
		<g
			id={`heatmaps_${id}`}
			transform={`
        rotate(${coordinates[2]} ${coordinates[0] * floorplanWidth} ${
				coordinates[1] * floorplanHeight
			}) translate(${coordinates[0] * floorplanWidth} ${
				coordinates[1] * floorplanHeight
			})`}
		/>
	);
}

HeatMaps.propTypes = {
	id: PropTypes.number.isRequired,
	coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	floorplanWidth: PropTypes.number.isRequired,
	floorplanHeight: PropTypes.number.isRequired,
};

export default HeatMaps;
