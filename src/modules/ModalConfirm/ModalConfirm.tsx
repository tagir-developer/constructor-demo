import { Button, Modal } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import React from 'react';

import styles from './ModalConfirm.module.scss';

interface IProps {
  buttonSubmitText?: string;
  buttonCancelText?: string;
  open: boolean;
  confirmText: string | string[];
  isLoading?: boolean;
  handleConfirm: () => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteConfirm?: boolean;
}

const ModalConfirm = ({
  buttonSubmitText,
  buttonCancelText,
  open,
  confirmText,
  setIsVisible,
  isLoading,
  handleConfirm,
  isDeleteConfirm,
}: IProps): JSX.Element => {
  const handleCancel = (): void => {
    setIsVisible(false);
  };

  return (
    <Modal
      width={370}
      open={open}
      destroyOnClose={true}
      closable={false}
      footer={null}
      centered={true}
    >
      <div className={styles['content']}>
        {Array.isArray(confirmText) ? (
          confirmText.map((item, index) => <p key={index}>{item}</p>)
        ) : (
          <p>{confirmText}</p>
        )}

        <div className={styles['buttons-group']}>
          <Button size="large" htmlType="button" onClick={handleCancel}>
            {isDeleteConfirm ? 'Отмена' : buttonCancelText}
          </Button>

          <Button
            size="large"
            type={ButtonTypes.PRIMARY}
            htmlType="button"
            onClick={handleConfirm}
            loading={isLoading}
            danger={isDeleteConfirm}
          >
            {isDeleteConfirm ? 'Удалить' : buttonSubmitText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
