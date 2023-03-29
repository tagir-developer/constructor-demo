import {
  BorderlessTableOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Dropdown } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { FC, memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import AddElemTopBar from './AddElemTopBar';
import { getGuidesDropdownMenuItems } from './Header.helpers';
import styles from './Header.module.scss';
import SettingsTopBar from './SettingsTopBar';

const Header: FC = () => {
  const [isAddElemMenuOpen, setIsAddElemMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const isGuidesVisible = useTypedSelector(
    (state) => state.guides.isGuidesVisible,
  );

  const dispatch = useDispatch();

  const toggleIsAddElemMenuOpen = (): void => {
    setIsAddElemMenuOpen((prev) => !prev);
  };

  const toggleIsSettingsMenuOpen = (): void => {
    setIsSettingsMenuOpen((prev) => !prev);
  };

  const guidesDropdownMenuItems = getGuidesDropdownMenuItems(
    isGuidesVisible,
    dispatch,
  );

  return (
    <header className={styles.header}>
      <Button
        type={ButtonTypes.PRIMARY}
        size="large"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={toggleIsAddElemMenuOpen}
      />

      <Drawer
        rootClassName="top-bar-drawer"
        className={styles['add-elem-drawer']}
        headerStyle={{ display: 'none' }}
        open={isAddElemMenuOpen}
        title="Добавить компонент"
        placement="top"
        onClose={toggleIsAddElemMenuOpen}
        destroyOnClose={true}
        contentWrapperStyle={{ height: 'auto' }}
      >
        <AddElemTopBar setIsAddElemMenuOpen={setIsAddElemMenuOpen} />
      </Drawer>

      <Dropdown
        menu={guidesDropdownMenuItems}
        placement="bottomLeft"
        overlayStyle={{ zIndex: 2000, width: 'auto' }}
      >
        <Button
          type={ButtonTypes.DEFAULT}
          shape="circle"
          size="large"
          icon={<BorderlessTableOutlined />}
        />
      </Dropdown>

      <Button
        className={styles['main-settings-btn']}
        type={ButtonTypes.PRIMARY}
        shape="circle"
        size="large"
        icon={<UnorderedListOutlined />}
        onClick={toggleIsSettingsMenuOpen}
      />

      <Drawer
        rootClassName="top-bar-drawer"
        className={styles['add-elem-drawer']}
        headerStyle={{ display: 'none' }}
        open={isSettingsMenuOpen}
        title="Настройки"
        placement="top"
        onClose={toggleIsSettingsMenuOpen}
        destroyOnClose={true}
        contentWrapperStyle={{ height: 'auto' }}
      >
        <SettingsTopBar setIsSettingsMenuOpen={setIsSettingsMenuOpen} />
      </Drawer>
    </header>
  );
};

export default memo(Header);
