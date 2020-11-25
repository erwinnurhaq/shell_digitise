import React from 'react'
import PropTypes from 'prop-types'

function TableHeadButton({title, sort, order, onBtnClick}) {
  return (
    <div
      data-testid={`th-button__sort-${title.trim().replace(' ', '')}`}
      className="th-button"
      role="button"
      onClick={() => onBtnClick(title)}
    >
      <span>{title}</span>
      <div className="th-button-icon">
        <i className={`caret up icon ${sort === title && order === 'asc' ? '' : 'disabled'}`} />
        <i
          className={`caret down icon ${sort === title && order === 'desc' ? '' : 'disabled'}`}
        />
      </div>
    </div>
  )
}

TableHeadButton.propTypes = {
  title: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  onBtnClick: PropTypes.func.isRequired
}

export default TableHeadButton