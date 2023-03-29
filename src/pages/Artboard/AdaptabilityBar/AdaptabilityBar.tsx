import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { FC } from 'react';
import CollectionService from 'services/CollectionService';

import styles from './AdaptabilityBar.module.scss';
import BreakpointItem from './BreakpointItem';

interface IProps {
  width: number;
  addNewBreakpoint: (artboardWidth: number) => void;
}

const AdaptabilityBar: FC<IProps> = ({ width, addNewBreakpoint }) => {
  const breakpoints = useTypedSelector((state) => state.common.breakpoints);

  const handleAddNewBreakpoint = (): void => {
    if (breakpoints.find((item) => item.breakpoint === width)) return;

    addNewBreakpoint(width);
  };

  const preparedBreakpoints = CollectionService.orderBy(
    breakpoints,
    'breakpoint',
    'desc',
  ).filter((item) => item.breakpoint !== 0);

  return (
    <div className={styles.bar}>
      <Button
        className={styles['add-breakpoint-btn']}
        type={ButtonTypes.GHOST}
        size="middle"
        icon={<PlusOutlined />}
        title="Добавить новый брейкпоинт"
        onClick={handleAddNewBreakpoint}
      >
        {width + 'px'}
      </Button>

      <ul className={styles.ruler}>
        {Array.from(Array(35).keys()).map((item, index) => (
          <li key={index} />
        ))}
      </ul>

      <div className={styles['breakpoints-bar']}>
        {preparedBreakpoints.map((item, index) => (
          <BreakpointItem
            key={item.breakpoint}
            breakpoint={item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
export default AdaptabilityBar;
