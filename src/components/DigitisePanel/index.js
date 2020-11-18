import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import * as d3 from 'd3';
import simpleheat from '../../utils/simpleheat';
import Shell from './components/Shell';
import { generateHeatmaps, generateHeatpoints } from '../../utils/generateHeats';

function DigitisePanel({
	shells,
	profiles,
	floorplan,
	isShowHeatmaps,
	isShowHeatpoints,
	currentProfileId,
	currentShellCoordinates,
	setCurrentShellCoordinates,
	isAddingShell,
}) {
	const [wrapperSize, setWrapperSize] = useState({ width: 1, height: 1 });
	const [heatmaps, setHeatmaps] = useState([]);
	const [heatpoints, setHeatpoints] = useState([]);
	const [isCornerEdgeClicked, setIsCornerEdgeClicked] = useState(false);

	const isComponentMounted = useRef(false);
	const SVGPanel = useRef(null);
	const SVGViewer = useRef(null);
	const heatpointsRef = useRef(null);
	const heatmapsRef = useRef(null);

	const mockHeatpointsInterval = useRef(null);
	const mockHeatmapsInterval = useRef(null);

	function setViewerOnResize() {
		setWrapperSize({
			width: parseInt(getComputedStyle(SVGPanel.current).width, 10),
			height: parseInt(getComputedStyle(SVGPanel.current).height, 10),
		});
		SVGViewer.current.fitToViewer('center', 'center');
	}

	function setShellCoordinates(x, y, rotate = 0) {
		setCurrentShellCoordinates([
			parseFloat((x / floorplan.width).toFixed(7)),
			parseFloat((y / floorplan.height).toFixed(7)),
			rotate,
		]);
	}

	function onSVGClick(e) {
		setIsCornerEdgeClicked(false);
		if (isAddingShell && !isCornerEdgeClicked) {
			setShellCoordinates(e.point.x, e.point.y, currentShellCoordinates[2]);
		}
	}

	function onSetCornerPoint(circle) {
		let point = circle.ownerSVGElement.createSVGPoint();
		point.x = circle.getAttribute('cx');
		point.y = circle.getAttribute('cy');
		point = point.matrixTransform(circle.transform.baseVal.consolidate().matrix);

		let rotate =
			circle
				.getAttribute('transform')
				.split(' ')
				.find((item) => item.includes('rotate')) || 0;
		if (rotate !== 0) {
			rotate = parseInt(rotate.replace('rotate(', ''), 10);
		}
		setIsCornerEdgeClicked(true);
		setShellCoordinates(point.x, point.y, rotate);
	}

	function onSetEdgePoint(rect) {
		let point = rect.ownerSVGElement.createSVGPoint();
		point.x = rect.getAttribute('x');
		point.y = rect.getAttribute('y');
		point = point.matrixTransform(rect.transform.baseVal.consolidate().matrix);

		let rotate =
			rect
				.getAttribute('transform')
				.split(' ')
				.find((item) => item.includes('rotate')) || 0;
		if (rotate !== 0) {
			rotate = parseInt(rotate.replace('rotate(', ''), 10);
		}
		setIsCornerEdgeClicked(true);
		setShellCoordinates(point.x, point.y, rotate);
	}

	function renderWillAddShell() {
		if (isAddingShell && currentProfileId > 0 && currentShellCoordinates.length > 0) {
			const { pixel_ratio, coverage_area } = profiles.find(
				(profile) => profile.id === currentProfileId
			);
			d3.select('#add_shells_group')
				.selectAll('rect')
				.data([currentShellCoordinates])
				.join('rect')
				.attr('x', (coordinates) => coordinates[0] * floorplan.width)
				.attr('y', (coordinates) => coordinates[1] * floorplan.height)
				.attr('width', coverage_area.length * pixel_ratio)
				.attr('height', coverage_area.width * pixel_ratio)
				.attr(
					'transform',
					(coordinates) =>
						`rotate(${coordinates[2]} ${coordinates[0] * floorplan.width} ${
							coordinates[1] * floorplan.height
						})`
				)
				.attr('fill', '#ffbf100d')
				.attr('stroke', '#ffc110')
				.attr('stroke-width', (8 * pixel_ratio) / 100)
				.on('mousedown', (e) => console.log(e))
		} else {
			d3.select('#add_shells_group').selectAll('*').remove()
		}
	}

	// function renderWillAddShell() {
	// 	if (isAddingShell && currentProfileId > 0 && currentShellCoordinates.length > 0) {
	// 		const { pixel_ratio, coverage_area } = profiles.find(
	// 			(profile) => profile.id === currentProfileId
	// 		);
	// 		return (
	// 			<Shell
	// 				id={0}
	// 				coordinates={currentShellCoordinates}
	// 				pixelRatio={pixel_ratio}
	// 				coverageArea={coverage_area}
	// 				floorplanWidth={floorplan.width}
	// 				floorplanHeight={floorplan.height}
	// 				willAddShell
	// 			/>
	// 		);
	// 	}
	// 	return null;
	// }

	// function assignHeatpoints() {
	// 	shells.forEach((shell) => {
	// 		heatpointsRef.current[shell.id] = simpleheat(`canvas_${shell.id}`);
	// 		heatpointsRef.current[shell.id].max(1);
	// 		heatpointsRef.current[shell.id].radius(
	// 			40 * (shell.profile.pixel_ratio / 100),
	// 			48 * (shell.profile.pixel_ratio / 100)
	// 		);
	// 	});
	// }

	// function drawHeatpoints() {
	// 	if (isShowHeatpoints && Object.keys(heatpointsRef.current).length === 0) {
	// 		assignHeatpoints();
	// 	}
	// 	return shells.forEach((shell) => {
	// 		const shellPoint = heatpoints.find((item) => item.id === shell.id);
	// 		if (!shellPoint) return;

	// 		const heatData = shellPoint.heatpoints.map((point) => [
	// 			(point[0] / 32) * (shell.profile.coverage_area.length * shell.profile.pixel_ratio),
	// 			(point[1] / 24) * (shell.profile.coverage_area.width * shell.profile.pixel_ratio),
	// 			1,
	// 		]);
	// 		heatpointsRef.current[shell.id].data(heatData);
	// 		heatpointsRef.current[shell.id].draw();
	// 	});
	// }

	// function removeDrawHeatpoints() {
	// 	if (Object.keys(heatpointsRef.current).length > 0) {
	// 		shells.forEach((shell) => {
	// 			heatpointsRef.current[shell.id].clear();
	// 			heatpointsRef.current[shell.id].draw();
	// 		});
	// 	}
	// 	heatpointsRef.current = {};
	// }

	function assignHeatpoints() {
		heatpointsRef.current = simpleheat(`heatpoints_canvas`);
		heatpointsRef.current.max(1);
		heatpointsRef.current.radius(
			40 * (shells[0].profile.pixel_ratio / 100),
			48 * (shells[0].profile.pixel_ratio / 100)
		);
	}

	function drawHeatpoints() {
		let heatData = [];
		heatpoints.forEach((heat) => {
			const shell = shells.find((item) => item.id === heat.shell_id);
			heatData.push(
				...heat.heatpoints.map((point) => [
					shell.coordinates[0] * floorplan.width +
						(point[0] / 32) * (shell.profile.coverage_area.length * shell.profile.pixel_ratio),
					shell.coordinates[1] * floorplan.height +
						(point[1] / 24) * (shell.profile.coverage_area.width * shell.profile.pixel_ratio),
					1,
				])
			);
		});
		heatpointsRef.current.data(heatData);
		heatpointsRef.current.draw();
	}

	function removeDrawHeatpoints() {
		heatpointsRef.current.clear();
		heatpointsRef.current.draw();
	}

	function assignHeatmaps() {
		heatmapsRef.current = {};
		heatmapsRef.current.colors = d3
			.scaleLinear()
			.domain([23, 32])
			.range(['rgba(255, 238, 0, 0.1)', 'rgba(255, 68, 0, 0.6)'])
			.clamp(true);

		heatmapsRef.current.xAxis = d3
			.scaleBand()
			.domain([...Array(32).keys()])
			.range([0, shells[0].profile.coverage_area.length * shells[0].profile.pixel_ratio]);

		heatmapsRef.current.yAxis = d3
			.scaleBand()
			.domain([...Array(24).keys()])
			.range([0, shells[0].profile.coverage_area.width * shells[0].profile.pixel_ratio]);

		d3.select(`#heatmaps_group`)
			.selectAll('.heatmaps_shell')
			.data(shells)
			.join('g')
			.attr('class', 'heatmaps_shell')
			.attr('id', (shell) => `heatmaps_group_${shell.id}`)
			.attr(
				'transform',
				(shell) =>
					`translate(${shell.coordinates[0] * floorplan.width} ${
						shell.coordinates[1] * floorplan.height
					}) rotate(${shell.coordinates[2]} ${shell.coordinates[0] * floorplan.width} ${
						shell.coordinates[1] * floorplan.height
					})`
			)

		// shells.forEach((shell) => {
		// 	heatmapsRef.current[`element_${shell.id}`] = d3.select(`#heatmaps_${shell.id}`);

		// 	const data = heatmaps.find((item) => item.id === shell.id);
		// 	if (!data) return;

		// 	for (let i = 0; i < 24; i += 1) {
		// 		data.heatmaps.splice(i, 32, data.heatmaps.slice(i, 32 + i));
		// 	}

		// 	data.heatmaps.forEach((heatRow, heatRowIndex) => {
		// 		heatmapsRef.current[`element_${shell.id}`]
		// 			.selectAll()
		// 			.data(heatRow)
		// 			.join('rect')
		// 			.attr('id', (col, colIndex) => `rect_${shell.id}_${heatRowIndex}_${colIndex}`)
		// 	});
		// 			.attr('x', (col, colIndex) => heatmapsRef.current.xAxis(colIndex))
		// 			.attr('y', () => heatmapsRef.current.yAxis(heatRowIndex))
		// 			.attr('width', heatmapsRef.current.xAxis.bandwidth())
		// 			.attr('height', heatmapsRef.current.yAxis.bandwidth())
		// 			.style('fill', (val) => heatmapsRef.current.colors(val));
		// });
	}

	function transformHeatmapData(array, xLength, yLength) {
		let data = [];
		for (let i = 0; i < yLength; i++) {
			data.push(array.slice(i * xLength, i * xLength + xLength));
		}
		return data;
	}

	function drawHeatmaps() {
		heatmaps.forEach((heat) => {
			const data = transformHeatmapData(heat.heatmaps, 32, 24);
			data.forEach((rowData, rowIndex) => {
				d3.select(`#heatmaps_group_${heat.shell_id}`)
					.selectAll(`.rect_${heat.shell_id}_${rowIndex}`)
					.data(rowData)
					.join('rect')
					.attr('class', `rect_${heat.shell_id}_${rowIndex}`)
					.attr('data-tip', (temp, tempIndex) => `rect_${heat.shell_id}_${rowIndex}_${tempIndex}`)
					.attr('x', (col, colIndex) => heatmapsRef.current.xAxis(colIndex))
					.attr('y', () => heatmapsRef.current.yAxis(rowIndex))
					.attr('width', heatmapsRef.current.xAxis.bandwidth())
					.attr('height', heatmapsRef.current.yAxis.bandwidth())
					.style('fill', (val) => heatmapsRef.current.colors(val))
			});
		});

		// shells.forEach((shell) => {
		// 	const data = heatmaps.find((item) => item.id === shell.id);
		// 	if (!data) return;
		// 	heatmapsRef.current[`element_${shell.id}`]
		// 		.selectAll('rect')
		// 		.data(data.heatmaps)
		// 		.style('fill', (val) => heatmapsRef.current.colors(val));
		// });
	}

	function removeDrawHeatmaps() {
		d3.select(`#heatmaps_group`).selectAll('g').selectAll('*').remove();
	}

	useEffect(() => {
		isComponentMounted.current = true;
		setViewerOnResize();
		window.addEventListener('resize', setViewerOnResize);

		return () => {
			isComponentMounted.current = false;
			window.removeEventListener('resize', setViewerOnResize);
		};
	}, []);

	useEffect(() => {
		d3.select('#shells_group')
			.selectAll('.rect-shell')
			.data(shells)
			.join('rect')
			.attr('class', 'rect-shell')
			.attr('x', ({ coordinates }) => coordinates[0] * floorplan.width)
			.attr('y', ({ coordinates }) => coordinates[1] * floorplan.height)
			.attr('width', ({ profile }) => `${profile.coverage_area.length * profile.pixel_ratio}px`)
			.attr('height', ({ profile }) => `${profile.coverage_area.width * profile.pixel_ratio}px`)
			.attr(
				'transform',
				({ coordinates }) =>
					`rotate(${coordinates[2]} ${coordinates[0] * floorplan.width} ${
						coordinates[1] * floorplan.height
					})`
			)
			.attr('fill', '#0000ff0d')
			.attr('stroke', 'blue')
			.attr('stroke-width', ({ profile }) => `${(8 * profile.pixel_ratio) / 100}px`)
			.attr('data-tip', ({ id }) => `shell_rect_${id}`);
	}, [shells]);

	useEffect(() => {
		if (isShowHeatpoints) {
			clearInterval(mockHeatpointsInterval.current);
			mockHeatpointsInterval.current = null;
			console.log(shells.length)
			setHeatpoints(generateHeatpoints(shells.length));
			mockHeatpointsInterval.current = setInterval(() => {
				setHeatpoints(generateHeatpoints(shells.length));
			}, 2000);
		} else {
			clearInterval(mockHeatpointsInterval.current);
			mockHeatpointsInterval.current = null;
			setHeatpoints([])
		}
		return () => {
			clearInterval(mockHeatpointsInterval.current);
			mockHeatpointsInterval.current = null;
			setHeatpoints([])
		};
	}, [isShowHeatpoints, shells]);

	useEffect(() => {
		if (isShowHeatmaps) {
			clearInterval(mockHeatmapsInterval.current);
			mockHeatmapsInterval.current = null;
			setHeatmaps(generateHeatmaps(shells.length));
			mockHeatmapsInterval.current = setInterval(() => {
				setHeatmaps(generateHeatmaps(shells.length));
			}, 2000);
		} else {
			clearInterval(mockHeatmapsInterval.current);
			mockHeatmapsInterval.current = null;
		}
		return () => {
			clearInterval(mockHeatmapsInterval.current);
			mockHeatmapsInterval.current = null;
		};
	}, [isShowHeatmaps, shells]);

	useEffect(() => {
		if (shells.length > 0 && !heatpointsRef.current) {
			console.log('assign heatpoints canvas once');
			assignHeatpoints();
		}
		if (isShowHeatpoints && shells.length > 0 && heatpointsRef.current) {
			drawHeatpoints();
		}
		if (!isShowHeatpoints && shells.length > 0 && heatpointsRef.current) {
			removeDrawHeatpoints();
		}
	}, [isShowHeatpoints, shells, heatpoints]);

	useEffect(() => {
		if (shells.length > 0 && !heatmapsRef.current) {
			console.log('assign heatmaps once');
			assignHeatmaps();
		}
		if (isShowHeatmaps && heatmapsRef.current) {
			drawHeatmaps();
		}
		if (!isShowHeatmaps && heatmapsRef.current) {
			removeDrawHeatmaps();
		}
	}, [isShowHeatmaps, shells, heatmaps]);

	return (
		<div className="digitise-panel" ref={SVGPanel}>
			<UncontrolledReactSVGPanZoom
				ref={SVGViewer}
				width={wrapperSize.width}
				height={wrapperSize.height}
				background="#10151b"
				SVGBackground="none"
				detectAutoPan={false}
				detectWheel={false}
				toolbarProps={{
					SVGAlignX: 'center',
					SVGAlignY: 'center',
					activeToolColor: '#fbbd08',
				}}
				miniatureProps={{
					background: '#10151b',
				}}
				onClick={onSVGClick}
			>
				<svg
					width={floorplan.width}
					height={floorplan.height}
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<image
						onLoad={() => SVGViewer.current.fitToViewer('center', 'center')}
						width={floorplan.width}
						height={floorplan.height}
						xlinkHref={floorplan.floorplan_url}
					/>

					<foreignObject
						width={floorplan.width}
						height={floorplan.height}
						style={{ position: 'relative' }}
					>
						<canvas id="heatpoints_canvas" width={floorplan.width} height={floorplan.height} />
					</foreignObject>
					<g id="heatmaps_group" />
					<g id="shells_group" />
					<g id="add_shells_group">{renderWillAddShell()}</g>
				</svg>
			</UncontrolledReactSVGPanZoom>
		</div>
	);
}

DigitisePanel.propTypes = {
	shells: PropTypes.arrayOf(PropTypes.object).isRequired,
	profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
	floorplan: PropTypes.objectOf(PropTypes.any).isRequired,
	isShowHeatmaps: PropTypes.bool.isRequired,
	isShowHeatpoints: PropTypes.bool.isRequired,
	currentProfileId: PropTypes.number.isRequired,
	currentShellCoordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	setCurrentShellCoordinates: PropTypes.func.isRequired,
	isAddingShell: PropTypes.bool.isRequired,
};

export default DigitisePanel;
