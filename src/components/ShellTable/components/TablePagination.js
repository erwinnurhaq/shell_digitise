import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'prospace-ui';

const limitValues = [5, 10, 20, 50, 100, 200];

function TablePagination({
	limit,
	offset,
	changeLimit,
	changeOffset,
	totalItemCount,
	scrollToElement,
}) {
	const scroll = () => {
		if (scrollToElement) {
			scrollToElement.scrollIntoView({
				behavior: 'smooth',
			});
		} else {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	};

	const onChangeLimit = (val) => {
		scroll();
		changeLimit(val);
	};

	const getCurrentPageInfo = () => {
		const upperLimit = offset + limit > totalItemCount ? totalItemCount : offset + limit;
		const lowerLimit = totalItemCount === 0 ? 0 : offset + 1;
		return `${lowerLimit} - ${upperLimit} of ${totalItemCount}`;
	};

	const nextPage = () => {
		scroll();
		changeOffset(offset + limit);
	};

	const prevPage = () => {
		scroll();
		changeOffset(offset - limit);
	};

	return (
		<div className="pagination-container">
			<div className="pagination__limiter-container">
				<h4>Rows per page</h4>
				<Dropdown
					className="pagination__limiter"
					value={limit}
					onChange={(e) => onChangeLimit(parseInt(e.target.value, 10))}
				>
					{limitValues.map((val) => (
						<option key={val} value={val}>
							{val.toString()}
						</option>
					))}
				</Dropdown>
			</div>
			<div className="pagination__nav">
				<span className="pagination__info">{getCurrentPageInfo()}</span>
				<button
					data-testid="shell-table-pagination__prev-button"
					type="button"
					className={offset <= 0 ? 'disabled-square-pagination-button' : 'square-pagination-button'}
					onClick={prevPage}
					disabled={offset <= 0}
				>
					<i className="angle left icon" />
				</button>
				<button
					data-testid="shell-table-pagination__next-button"
					type="button"
					className={
						offset + limit >= totalItemCount
							? 'disabled-square-pagination-button'
							: 'square-pagination-button '
					}
					onClick={nextPage}
					disabled={offset + limit >= totalItemCount}
				>
					<i className="angle right icon" />
				</button>
			</div>
		</div>
	);
}

TablePagination.propTypes = {
	limit: PropTypes.number.isRequired,
	offset: PropTypes.number.isRequired,
	changeLimit: PropTypes.func.isRequired,
	changeOffset: PropTypes.func.isRequired,
	totalItemCount: PropTypes.number.isRequired,
	scrollToElement: PropTypes.any, // eslint-disable-line
};

TablePagination.defaultProps = {
	scrollToElement: null,
};

export default TablePagination;
