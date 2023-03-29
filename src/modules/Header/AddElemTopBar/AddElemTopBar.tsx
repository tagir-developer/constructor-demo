import { CloseOutlined } from '@ant-design/icons';
import { Button, Tabs, TabsProps } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import { FC } from 'react';

import AddBasicComponent from './AddBasicComponent';

import styles from 'modules/Header/Header.module.scss';

interface IProps {
  setIsAddElemMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddElemTopBar: FC<IProps> = ({ setIsAddElemMenuOpen }) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Простые компоненты',
      children: (
        <AddBasicComponent setIsAddElemMenuOpen={setIsAddElemMenuOpen} />
      ),
    },
    {
      key: '2',
      label: 'Библиотека компонентов',
      children: <h2>Библиотека компонентов</h2>,
    },
    {
      key: '3',
      label: 'Мои компоненты',
      children: <h2>Мои компоненты</h2>,
    },
  ];

  const closeAddElemTopBar = (): void => {
    setIsAddElemMenuOpen(false);
  };

  return (
    <Tabs
      className={styles.tabs}
      defaultActiveKey="1"
      items={items}
      size="large"
      centered={true}
      tabBarExtraContent={{
        left: (
          <div className={styles.title}>
            <h2>Добавить компонент</h2>
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

export default AddElemTopBar;
