import { CloseOutlined } from '@ant-design/icons';
import { Button, Tabs, TabsProps } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import { FC } from 'react';

import ThemeTabInner from './ThemeTabInner';

import styles from 'modules/Header/Header.module.scss';

interface IProps {
  setIsSettingsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsTopBar: FC<IProps> = ({ setIsSettingsMenuOpen }) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Основные настройки',
      children: <h2>Основные настройки</h2>,
    },
    {
      key: '2',
      label: 'Темы',
      children: <ThemeTabInner setIsSettingsMenuOpen={setIsSettingsMenuOpen} />,
    },
  ];

  const closeAddElemTopBar = (): void => {
    setIsSettingsMenuOpen(false);
  };

  return (
    <Tabs
      className={styles.tabs}
      defaultActiveKey="2"
      items={items}
      size="large"
      centered={true}
      tabBarExtraContent={{
        left: (
          <div className={styles.title}>
            <h2>Настройки</h2>
          </div>
        ),
        right: (
          <Button
            className={styles['close-button']}
            type={ButtonTypes.DEFAULT}
            size="large"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeAddElemTopBar}
          />
        ),
      }}
    />
  );
};

export default SettingsTopBar;
