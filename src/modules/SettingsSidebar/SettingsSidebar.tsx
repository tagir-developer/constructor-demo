import { DoubleRightOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import { FC, useState } from 'react';

import SettingsPanels from './SettingsPanels';
import styles from './SettingsSidebar.module.scss';

const SettingsSidebar: FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsPanel = (): void => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <Button
        className={styles.button}
        type={ButtonTypes.DEFAULT}
        shape="round"
        size="large"
        onClick={toggleSettingsPanel}
        icon={<SettingOutlined />}
      >
        Настройки
      </Button>

      <Drawer
        className={styles.drawer}
        open={isSettingsOpen}
        title="Настройки"
        placement="right"
        onClose={toggleSettingsPanel}
        closeIcon={<DoubleRightOutlined />}
        headerStyle={{ marginTop: 70 }}
        mask={false}
        destroyOnClose={true}
      >
        <SettingsPanels />
      </Drawer>
    </>
  );
};

export default SettingsSidebar;
