import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { AnyAction } from '@reduxjs/toolkit';
import { MenuProps } from 'antd';
import { GuideTypes } from 'common/interfaces';
import { Dispatch } from 'react';
import {
  addNewGuide,
  toggleGuidesVisibility,
} from 'store/reducers/guides.slice';

import styles from './Header.module.scss';

export const getGuidesDropdownMenuItems = (
  isGuidesVisible: boolean,
  dispatch: Dispatch<AnyAction>,
): MenuProps => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          className={styles['dropdown-menu-item']}
          onClick={() => dispatch(toggleGuidesVisibility())}
        >
          {isGuidesVisible ? (
            <>
              <EyeInvisibleOutlined /> <span>Скрыть направляющие</span>
            </>
          ) : (
            <>
              <EyeOutlined /> <span>Показать направляющие</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          className={styles['dropdown-menu-item']}
          onClick={() => dispatch(addNewGuide(GuideTypes.VERTICAL))}
        >
          <PlusOutlined />

          <span>Добавить вертикальную направляющую</span>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div
          className={styles['dropdown-menu-item']}
          onClick={() => dispatch(addNewGuide(GuideTypes.HORIZONTAL))}
        >
          <PlusOutlined />

          <span>Добавить горизонтальную направляющую</span>
        </div>
      ),
    },
  ];

  return { items };
};
