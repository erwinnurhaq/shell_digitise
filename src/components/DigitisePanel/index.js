import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import * as d3 from 'd3';
import simpleheat from '../../utils/simpleheat';
import Shell from './components/Shell';
import HeatPoints from './components/HeatPoints';
import HeatMaps from './components/HeatMaps';
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
	const heatpointsRef = useRef({});
	const heatmapsRef = useRef({});
	const resPixelPerCM = useRef(100);

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
			const { floorplan_ratio, coverage_area } = profiles.find(
				(profile) => profile.id === currentProfileId
			);
			return (
				<Shell
					id={0}
					resPixelPerCM={resPixelPerCM.current}
					coordinates={currentShellCoordinates}
					floorplanRatio={floorplan_ratio}
					coverageArea={coverage_area}
					floorplanWidth={floorplan.width}
					floorplanHeight={floorplan.height}
					willAddShell
				/>
			);
		}
		return null;
	}

	function assignHeatpoints() {
		shells.forEach((shell) => {
			heatpointsRef.current[shell.id] = simpleheat(`canvas_${shell.id}`);
			heatpointsRef.current[shell.id].max(1);
			heatpointsRef.current[shell.id].radius(
				12.5 * (shell.profile.floorplan_ratio / 100),
				15 * (shell.profile.floorplan_ratio / 100)
			);
		});
	}

	function drawHeatpoints() {
		if (isShowHeatpoints && Object.keys(heatpointsRef.current).length === 0) {
			assignHeatpoints();
		}
		return shells.forEach((shell) => {
			const shellPoint = heatpoints.find((item) => item.id === shell.id);
			if (!shellPoint) return;

			const heatData = shellPoint.heatpoints.map((point) => [
				point[0] /32 *
					((shell.profile.coverage_area.length * resPixelPerCM.current) /
						(shell.profile.floorplan_ratio / 100)),
				point[1] /24 *
					((shell.profile.coverage_area.width * resPixelPerCM.current) /
						(shell.profile.floorplan_ratio / 100)),
				1,
			]);
			heatpointsRef.current[shell.id].data(heatData);
			heatpointsRef.current[shell.id].draw();
		});
	}

	function removeDrawHeatpoints() {
		if (Object.keys(heatpointsRef.current).length > 0) {
			shells.forEach((shell) => {
				heatpointsRef.current[shell.id].clear();
				heatpointsRef.current[shell.id].draw();
			});
		}
		heatpointsRef.current = {};
	}

	function assignHeatmaps() {
		heatmapsRef.current.colors = d3
			.scaleLinear()
			.range(['rgba(255, 238, 0, 0.1)', 'rgba(255, 68, 0, 0.6)'])
			.domain([23, 32]);

		shells.forEach((shell) => {
			heatmapsRef.current[`element_${shell.id}`] = d3.select(`#heatmaps_${shell.id}`);

			heatmapsRef.current[`xAxis_${shell.id}`] = d3
				.scaleBand()
				.range([
					0,
					(shell.profile.coverage_area.length * resPixelPerCM.current) /
						(shell.profile.floorplan_ratio / 100),
				])
				.domain([...Array(32).keys()]);

			heatmapsRef.current[`yAxis_${shell.id}`] = d3
				.scaleBand()
				.range([
					0,
					(shell.profile.coverage_area.width * resPixelPerCM.current) /
						(shell.profile.floorplan_ratio / 100),
				])
				.domain([...Array(24).keys()]);

			const data = heatmaps.find((item) => item.id === shell.id);
			if (!data) return;

			for (let i = 0; i < 24; i += 1) {
				data.heatmaps.splice(i, 32, data.heatmaps.slice(i, 32 + i));
			}

			data.heatmaps.forEach((heatRow, heatRowIndex) => {
				heatmapsRef.current[`element_${shell.id}`]
					.selectAll()
					.data(heatRow)
					.join('rect')
					.attr('id', (col, colIndex) => `rect_${shell.id}_${heatRowIndex}_${colIndex}`)
					.attr('x', (col, colIndex) => heatmapsRef.current[`xAxis_${shell.id}`](colIndex))
					.attr('y', () => heatmapsRef.current[`yAxis_${shell.id}`](heatRowIndex))
					.attr('width', heatmapsRef.current[`xAxis_${shell.id}`].bandwidth())
					.attr('height', heatmapsRef.current[`yAxis_${shell.id}`].bandwidth())
					.style('fill', (val) => heatmapsRef.current.colors(val));
			});
		});
	}

	function drawHeatmaps() {
		if (isShowHeatmaps && Object.keys(heatmapsRef.current).length === 0) {
			return assignHeatmaps();
		}
		return shells.forEach((shell) => {
			const data = heatmaps.find((item) => item.id === shell.id);
			if (!data) return;
			heatmapsRef.current[`element_${shell.id}`]
				.selectAll('rect')
				.data(data.heatmaps)
				.style('fill', (val) => heatmapsRef.current.colors(val));
		});
	}

	function removeDrawHeatmaps() {
		if (Object.keys(heatmapsRef.current).length > 0) {
			shells.forEach((shell) => {
				heatmapsRef.current[`element_${shell.id}`].selectAll('*').remove();
			});
		}
		heatmapsRef.current = {};
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
		if (isShowHeatpoints) {
			setHeatpoints(generateHeatpoints(shells.length));
			mockHeatpointsInterval.current = setInterval(() => {
				setHeatpoints(generateHeatpoints(shells.length));
			}, 2000);
		} else {
			clearInterval(mockHeatpointsInterval.current);
			mockHeatpointsInterval.current = null;
		}
		return () => {
			clearInterval(mockHeatpointsInterval.current);
			mockHeatpointsInterval.current = null;
		};
	}, [isShowHeatpoints, shells]);

	useEffect(() => {
		if (isShowHeatmaps) {
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
		if (!isShowHeatpoints) {
			removeDrawHeatpoints();
		} else {
			drawHeatpoints();
		}
	}, [isShowHeatpoints, shells, heatpoints]);

	useEffect(() => {
		if (!isShowHeatmaps) {
			removeDrawHeatmaps();
		} else {
			drawHeatmaps();
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
					{shells.length > 0 &&
						shells.map((shell) => (
							<React.Fragment key={shell.id}>
								{isShowHeatpoints && (
									<HeatPoints
										id={shell.id}
										resPixelPerCM={resPixelPerCM.current}
										coordinates={shell.coordinates}
										floorplanRatio={shell.profile.floorplan_ratio}
										coverageArea={shell.profile.coverage_area}
										floorplanWidth={floorplan.width}
										floorplanHeight={floorplan.height}
									/>
								)}
								{isShowHeatmaps && (
									<HeatMaps
										id={shell.id}
										coordinates={shell.coordinates}
										floorplanWidth={floorplan.width}
										floorplanHeight={floorplan.height}
									/>
								)}
								<Shell
									id={shell.id}
									resPixelPerCM={resPixelPerCM.current}
									coordinates={shell.coordinates}
									floorplanRatio={shell.profile.floorplan_ratio}
									coverageArea={shell.profile.coverage_area}
									floorplanWidth={floorplan.width}
									floorplanHeight={floorplan.height}
									showEdgePoints={isAddingShell}
									onSetCornerPoint={onSetCornerPoint}
									onSetEdgePoint={onSetEdgePoint}
								/>
							</React.Fragment>
						))}
					{renderWillAddShell()}
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
