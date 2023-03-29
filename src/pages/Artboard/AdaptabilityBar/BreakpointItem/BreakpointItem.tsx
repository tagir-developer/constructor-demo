import { DeleteFilled } from '@ant-design/icons';
import ModalConfirm from 'modules/ModalConfirm';
import { FC, memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IBreakpoint, deleteBreakpoint } from 'store/reducers/common.slice';

import styles from '../AdaptabilityBar.module.scss';

interface IProps {
  breakpoint: IBreakpoint;
  index: number;
}

const BreakpointItem: FC<IProps> = ({ breakpoint, index }) => {
  const dispatch = useDispatch();

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  return (
    <>
      <div
        key={breakpoint.breakpoint}
        style={{
          width: breakpoint.breakpoint,
          background:
            index === 0
              ? 'red'
              : index === 1
              ? 'green'
              : index === 2
              ? 'orange'
              : '#e300fc',
        }}
        className={styles['breakpoint-inner-zone']}
      >
        <div className={styles['breakpoint-value']}>
          {breakpoint.breakpoint + 'px'}
        </div>

        <DeleteFilled
          className={styles['delete-breakpoint-btn']}
          onClick={() => setIsDeleteConfirmModalOpen(true)}
        />
      </div>

      <ModalConfirm
        isDeleteConfirm
        open={isDeleteConfirmModalOpen}
        setIsVisible={setIsDeleteConfirmModalOpen}
        confirmText={[
          'Вы действительно хотите удалить брейкпоинт?',
          'Все изменения для данного эндпоинта будут потеряны.',
        ]}
        handleConfirm={() => dispatch(deleteBreakpoint(breakpoint.breakpoint))}
      />
    </>
  );
};

export default memo(BreakpointItem);
