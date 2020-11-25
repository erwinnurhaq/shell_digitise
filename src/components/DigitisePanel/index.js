import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import simpleheat from '../../utils/simpleheat';
import { generateMockHeatmaps, generateMockHeatpoints } from '../../utils/generateHeats';

function DigitisePanel({
	shells,
	floorplan,
	isShowHeatmaps,
	isShowHeatpoints,
	currentProfile,
	currentEditingShellId,
	currentShellCoordinates,
	setCurrentShellCoordinates,
	isAddingShell,
	isEditingShell,
}) {
	const [wrapperSize, setWrapperSize] = useState({ width: 1, height: 1 });
	const [heatmaps, setHeatmaps] = useState([]);
	const [heatpoints, setHeatpoints] = useState([]);
	const [isSurroundingClicked, setIsSurroundingClicked] = useState(false);

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
		setIsSurroundingClicked(false);
		if ((isAddingShell || isEditingShell) && !isSurroundingClicked) {
			setShellCoordinates(e.point.x, e.point.y, currentShellCoordinates[2]);
		}
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
		setIsSurroundingClicked(true);
		setShellCoordinates(point.x, point.y, rotate);
	}

	function assignHeatpoints() {
		heatpointsRef.current = simpleheat(`heatpoints_canvas`);
		heatpointsRef.current.max(1);
		heatpointsRef.current.radius(
			40 * (currentProfile.pixel_ratio / 100),
			48 * (currentProfile.pixel_ratio / 100)
		);
	}

	function transformHeatpointsData(shellBaseX, shellBaseY, rotation, heatPoint) {
		// MAKE COORDINATES RELATIVE TO SHELL SIZE ==========/
		const x =
			(heatPoint[0] / 32) * (currentProfile.coverage_area.length * currentProfile.pixel_ratio);
		const y =
			(heatPoint[1] / 24) * (currentProfile.coverage_area.width * currentProfile.pixel_ratio);

		if (rotation === 0) {
			return [shellBaseX + x, shellBaseY + y, 1];
		}

		// TRANSFORM ROTATED COORDINATES ============/
		const tX = x * Math.cos((rotation * Math.PI) / 180) - y * Math.sin((rotation * Math.PI) / 180);
		const tY = x * Math.sin((rotation * Math.PI) / 180) + y * Math.cos((rotation * Math.PI) / 180);
		return [shellBaseX + tX, shellBaseY + tY, 1];
	}

	function drawHeatpoints() {
		const heatData = [];
		heatpoints.forEach((heat) => {
			const shell = shells.find((item) => item.id === heat.shell_id);
			if (shell) {
				heatData.push(
					...heat.heatpoints.map((point) =>
						transformHeatpointsData(
							shell.coordinates[0] * floorplan.width,
							shell.coordinates[1] * floorplan.height,
							shell.coordinates[2],
							point
						)
					)
				);
			}
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
		heatmapsRef.current.colors = scaleLinear()
			.domain([23, 32])
			.range(['rgba(255, 238, 0, 0.1)', 'rgba(255, 68, 0, 0.6)'])
			.clamp(true);

		heatmapsRef.current.xAxis = scaleBand()
			.domain([...Array(32).keys()])
			.range([0, currentProfile.coverage_area.length * currentProfile.pixel_ratio]);

		heatmapsRef.current.yAxis = scaleBand()
			.domain([...Array(24).keys()])
			.range([0, currentProfile.coverage_area.width * currentProfile.pixel_ratio]);
	}

	function transformHeatmapData(array, xLength, yLength) {
		const data = [];
		for (let i = 0; i < yLength; i += 1) {
			data.push(array.slice(i * xLength, i * xLength + xLength));
		}
		return data;
	}

	function drawHeatmaps() {
		select('#heatmaps_group')
			.selectAll('.heatmaps_shell_group')
			.data(heatmaps)
			.join('g')
			.attr('class', 'heatmaps_shell_group')
			.each(function (data) {
				select(this)
					.selectAll('.heat-cell-group')
					.data(transformHeatmapData(data.heatmaps, 32, 24))
					.join('g')
					.attr('class', 'heat-cell-group')
					.each(function (d, i) {
						select(this)
							.selectAll('rect')
							.data(d)
							.join('rect')
							.attr('x', (col, colIndex) => heatmapsRef.current.xAxis(colIndex))
							.attr('y', () => heatmapsRef.current.yAxis(i))
							.attr('width', heatmapsRef.current.xAxis.bandwidth())
							.attr('height', heatmapsRef.current.yAxis.bandwidth())
							.style('fill', (val) => heatmapsRef.current.colors(val));
					});
			})
			.attr('transform', ({ shell_id }) => {
				const shell = shells.find((item) => item.id === shell_id);
				if (shell) {
					return `translate(${shell.coordinates[0] * floorplan.width} ${
						shell.coordinates[1] * floorplan.height
					}) rotate(${shell.coordinates[2]})`;
				}
				return '';
			});
	}

	function removeDrawHeatmaps() {
		select('#heatmaps_group').selectAll('.heatmaps_shell_group').remove();
	}

	function generateShell() {
		const shellsData = isEditingShell
			? shells.filter((shell) => shell.id !== currentEditingShellId)
			: shells;

		// JOIN
		const shellGroups = select('#shells_group').selectAll('.shell-group').data(shellsData);

		// ENTER
		const shellGroupsEnter = shellGroups.enter().append('g').attr('class', 'shell-group');
		shellGroupsEnter.append('rect').attr('class', 'shell__rect-border');
		shellGroupsEnter.append('rect').attr('class', 'shell__rect-title-background');
		shellGroupsEnter.append('text').attr('class', 'shell__rect-title');

		// UPDATE
		shellGroups
			.merge(shellGroupsEnter)
			.attr(
				'transform',
				({ coordinates }) =>
					`rotate(${coordinates[2]} ${coordinates[0] * floorplan.width} ${
						coordinates[1] * floorplan.height
					})`
			);

		shellGroups
			.merge(shellGroupsEnter)
			.select('.shell__rect-border')
			.attr('x', ({ coordinates }) => coordinates[0] * floorplan.width)
			.attr('y', ({ coordinates }) => coordinates[1] * floorplan.height)
			.attr('width', currentProfile.coverage_area.length * currentProfile.pixel_ratio)
			.attr('height', currentProfile.coverage_area.width * currentProfile.pixel_ratio)
			.attr('fill', '#0000ff0d')
			.attr('stroke', 'blue')
			.attr('stroke-width', (8 * currentProfile.pixel_ratio) / 100)
			.attr('data-tip', ({ id }) => `shell_rect_${id}`);

		shellGroups
			.merge(shellGroupsEnter)
			.select('.shell__rect-title-background')
			.attr('x', ({ coordinates }) => coordinates[0] * floorplan.width)
			.attr('y', ({ coordinates }) => coordinates[1] * floorplan.height)
			.attr('width', 150)
			.attr('height', 25)
			.attr('fill', 'blue');

		shellGroups
			.merge(shellGroupsEnter)
			.select('.shell__rect-title')
			.text(({ id, ts_id }) => `${id} / ${ts_id}`)
			.attr('x', ({ coordinates }) => coordinates[0] * floorplan.width + 20)
			.attr('y', ({ coordinates }) => coordinates[1] * floorplan.height + 20)
			.attr('font-size', 20)
			.attr('fill', 'white');

		// EXIT
		shellGroups.exit().remove();
	}

	function generateSurroundingShell() {
		const shellsData = isEditingShell
			? shells.filter((shell) => shell.id !== currentEditingShellId)
			: shells;
		const shellWidth = currentProfile.coverage_area.length * currentProfile.pixel_ratio;
		const shellHeight = currentProfile.coverage_area.width * currentProfile.pixel_ratio;

		select('#shells_surrounding_group')
			.selectAll('.surrounding-shell-group')
			.data(shellsData)
			.join('g')
			.attr('class', 'surrounding-shell-group')
			.each(function ({ coordinates }) {
				const basePoint = {
					x: coordinates[0] * floorplan.width,
					y: coordinates[1] * floorplan.height,
				};
				const rotation = `${coordinates[2]} ${basePoint.x} ${basePoint.y}`;
				const surroundingRectCoordinates = [
					[basePoint.x - shellWidth, basePoint.y - shellHeight],
					[basePoint.x, basePoint.y - shellHeight],
					[basePoint.x + shellWidth, basePoint.y - shellHeight],
					[basePoint.x + shellWidth, basePoint.y],
					[basePoint.x + shellWidth, basePoint.y + shellHeight],
					[basePoint.x, basePoint.y + shellHeight],
					[basePoint.x - shellWidth, basePoint.y + shellHeight],
					[basePoint.x - shellWidth, basePoint.y],
				];
				select(this)
					.selectAll('rect')
					.data(surroundingRectCoordinates)
					.join('rect')
					.attr('x', (point) => point[0])
					.attr('y', (point) => point[1])
					.attr('width', shellWidth)
					.attr('height', shellHeight)
					.attr('transform', `rotate(${rotation})`)
					.attr('fill', '#ffbf1000')
					.on('mouseover', function () {
						select(this).attr('fill', '#ffbf100d');
					})
					.on('mouseout', function () {
						select(this).attr('fill', '#ffbf1000');
					})
					.on('click', (e) => onSetEdgePoint(e.currentTarget));
			});
	}

	function removeSurroundingShell() {
		select('#shells_surrounding_group').selectAll('.surrounding-shell-group').remove();
	}

	function generateWillAddShell() {
		select('#add_shells_group')
			.selectAll('rect')
			.data([currentShellCoordinates])
			.join('rect')
			.attr('x', (coordinates) => coordinates[0] * floorplan.width)
			.attr('y', (coordinates) => coordinates[1] * floorplan.height)
			.attr('width', currentProfile.coverage_area.length * currentProfile.pixel_ratio)
			.attr('height', currentProfile.coverage_area.width * currentProfile.pixel_ratio)
			.attr(
				'transform',
				(coordinates) =>
					`rotate(${coordinates[2]} ${coordinates[0] * floorplan.width} ${
						coordinates[1] * floorplan.height
					})`
			)
			.attr('fill', '#ffbf100d')
			.attr('stroke', '#ffc110')
			.attr('stroke-width', (8 * currentProfile.pixel_ratio) / 100);
	}

	function removeWillAddShell() {
		select('#add_shells_group').selectAll('rect').remove();
	}

	function clearMockHeatpoints() {
		clearInterval(mockHeatpointsInterval.current);
		mockHeatpointsInterval.current = null;
		setHeatpoints([]);
	}

	function getMockHeatpoints() {
		clearMockHeatpoints();
		setHeatpoints(generateMockHeatpoints(shells));
		mockHeatpointsInterval.current = setInterval(() => {
			setHeatpoints(generateMockHeatpoints(shells));
		}, 2000);
	}

	function clearMockHeatmaps() {
		clearInterval(mockHeatmapsInterval.current);
		mockHeatmapsInterval.current = null;
		setHeatmaps([]);
	}

	function getMockHeatmaps() {
		clearMockHeatmaps();
		setHeatmaps(generateMockHeatmaps(shells));
		mockHeatmapsInterval.current = setInterval(() => {
			setHeatmaps(generateMockHeatmaps(shells));
		}, 2000);
	}

	// AUTO RESIZE VIEWER ==================================/

	useEffect(() => {
		isComponentMounted.current = true;
		setViewerOnResize();
		window.addEventListener('resize', setViewerOnResize);

		return () => {
			isComponentMounted.current = false;
			window.removeEventListener('resize', setViewerOnResize);
		};
	}, []); // eslint-disable-line

	// GENERATE WILL ADD SHELL ===============================/

	useEffect(() => {
		if ((isAddingShell || isEditingShell) && currentShellCoordinates.length > 0) {
			generateWillAddShell();
		} else {
			removeWillAddShell();
		}
	}, [isAddingShell, currentShellCoordinates, isEditingShell]); // eslint-disable-line

	// GENERATE SURROUNDING SHELL ============================/

	useEffect(() => {
		if (shells.length > 0 && currentProfile && (isAddingShell || isEditingShell)) {
			generateSurroundingShell();
		} else {
			removeSurroundingShell();
		}
	}, [shells, currentProfile, isAddingShell, isEditingShell]); // eslint-disable-line

	// GENERATE SHELL ==========================================/
	// TODO =  DELETING SHELL
	useEffect(() => {
		if (shells.length > 0 && currentProfile) {
			generateShell();
		}
	}, [shells, currentProfile, isEditingShell]); // eslint-disable-line

	// GENERATE MOCK HEATPOINTS ======================================/

	useEffect(() => {
		if (isShowHeatpoints) {
			getMockHeatpoints();
		} else {
			clearMockHeatpoints();
		}
		return () => {
			clearMockHeatpoints();
		};
	}, [isShowHeatpoints, shells]); // eslint-disable-line

	// GENERATE MOCK HEATMAPS =========================================/

	useEffect(() => {
		if (isShowHeatmaps) {
			getMockHeatmaps();
		} else {
			clearMockHeatmaps();
		}
		return () => {
			clearMockHeatmaps();
		};
	}, [isShowHeatmaps, shells]); // eslint-disable-line

	// TOGGLE HEATPOINTS ===========================================/

	useEffect(() => {
		if (shells.length > 0) {
			if (!heatpointsRef.current) {
				assignHeatpoints(); // assign heatpoints canvas once
			}
			if (isShowHeatpoints && heatpointsRef.current) {
				drawHeatpoints();
			}
			if (!isShowHeatpoints && heatpointsRef.current) {
				removeDrawHeatpoints();
			}
		}
	}, [isShowHeatpoints, shells, heatpoints]); // eslint-disable-line

	// TOGGLE HEATMAPS ===========================================/

	useEffect(() => {
		if (shells.length > 0) {
			if (!heatmapsRef.current) {
				assignHeatmaps(); // assign heatmaps once
			}
			if (isShowHeatmaps && heatmapsRef.current) {
				drawHeatmaps();
			}
			if (!isShowHeatmaps && heatmapsRef.current) {
				removeDrawHeatmaps();
			}
		}
	}, [isShowHeatmaps, shells, heatmaps]); // eslint-disable-line

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
					<foreignObject width={floorplan.width} height={floorplan.height}>
						<canvas id="heatpoints_canvas" width={floorplan.width} height={floorplan.height} />
					</foreignObject>
					<g id="heatmaps_group" />
					<g id="shells_surrounding_group" />
					<g id="shells_group" />
					<g id="add_shells_group" />
				</svg>
			</UncontrolledReactSVGPanZoom>
		</div>
	);
}

DigitisePanel.propTypes = {
	shells: PropTypes.arrayOf(PropTypes.object).isRequired,
	floorplan: PropTypes.objectOf(PropTypes.any).isRequired,
	isShowHeatmaps: PropTypes.bool.isRequired,
	isShowHeatpoints: PropTypes.bool.isRequired,
	currentProfile: PropTypes.objectOf(PropTypes.any).isRequired,
	currentEditingShellId: PropTypes.number.isRequired,
	currentShellCoordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
	setCurrentShellCoordinates: PropTypes.func.isRequired,
	isAddingShell: PropTypes.bool.isRequired,
	isEditingShell: PropTypes.bool.isRequired,
};

export default DigitisePanel;
