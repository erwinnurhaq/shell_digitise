import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'prospace-ui';

import CloseIcon from '../assets/close.png';

const ConfirmModal = ({ isShow, title, info, infoPrefix, onCancel, onYes }) => {
  if (!isShow) return null;

  return (
    <div
      data-testid="confirm-modal__container"
      className=" ui active dimmer confirm-modal-container"
    >
      <div className="ui fluid segment content-wrapper">
        <div
          data-testid="confirm-modal__close-button"
          role="button"
          tabIndex={0}
          onKeyUp={() => {}}
          className="close-button"
          onClick={onCancel}
        >
          <img src={CloseIcon} alt="close-icon" />
        </div>
        <h2 data-testid="confirm-modal__title">{title}</h2>
        <div data-testid="confirm-modal__info-box" className="info-box">
          <span>
            {infoPrefix ? <b>{infoPrefix}: </b> : ''}
            {info}
          </span>
        </div>
        <div className="button-container">
          <Button
            testId="confirm-modal__cancel-button"
            type="secondary"
            onClick={onCancel}
          >
            CANCEL
          </Button>
          <Button testId="confirm-modal__confirm-button" onClick={onYes}>
            YES
          </Button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isShow: PropTypes.bool.isRequired,
  title: PropTypes.string,
  info: PropTypes.string,
  infoPrefix: PropTypes.string,
  onCancel: PropTypes.func,
  onYes: PropTypes.func,
};

ConfirmModal.defaultProps = {
  title: '',
  info: '',
  infoPrefix: '',
  onCancel: () => {},
  onYes: () => {},
};

export default ConfirmModal;
