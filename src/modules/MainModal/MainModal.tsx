import { Button, Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import { ButtonTypes } from 'common/interfaces';
import React, { FC, PropsWithChildren } from 'react';
import CloseButton from 'ui/CloseButton';

import styles from './MainModal.module.scss';

interface IMainModal extends ModalProps {
  withCloseBtn?: boolean;
  handleCancel?: () => void;
  handleConfirm?: () => void;
  modalTitle?: string;
  buttonConfirmText?: string;
  buttonCancelText?: string;
  isLoading?: boolean;
  sizeMin?: boolean;
  showButtons?: boolean;
  headerButton?: JSX.Element;
  withoutHeader?: boolean;
}

const MainModal: FC<IMainModal & PropsWithChildren> = ({
  withCloseBtn = true,
  handleConfirm,
  handleCancel,
  modalTitle,
  children,
  buttonConfirmText,
  buttonCancelText,
  isLoading,
  showButtons,
  sizeMin,
  headerButton,
  withoutHeader,
  ...restProps
}) => {
  return (
    <Modal
      className={styles['modal']}
      destroyOnClose={true}
      closable={false}
      footer={
        showButtons ? (
          <div className={styles['buttons-container']}>
            <div className={styles['buttons-group']}>
              <Button
                size="large"
                type={ButtonTypes.GHOST}
                htmlType="button"
                onClick={handleCancel}
              >
                {buttonCancelText ?? 'Отменить'}
              </Button>

              <Button
                size="large"
                type={ButtonTypes.PRIMARY}
                htmlType="button"
                onClick={handleConfirm}
                loading={isLoading}
              >
                {buttonConfirmText ?? 'Подтвердить'}
              </Button>
            </div>
          </div>
        ) : null
      }
      centered={true}
      width={sizeMin ? 500 : 900}
      {...restProps}
    >
      <div
        className={classNames(styles['content'], sizeMin && styles['sizeMin'])}
      >
        {!withoutHeader && (
          <div className={styles['header']}>
            <div className={styles['title']}>{modalTitle ?? ''}</div>

            {headerButton ?? null}

            {withCloseBtn && <CloseButton onClick={handleCancel} />}
          </div>
        )}

        {children}
      </div>
    </Modal>
  );
};

export default MainModal;
