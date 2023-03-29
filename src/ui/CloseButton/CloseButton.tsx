import { CloseOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import React, { FC, memo } from 'react';

import styles from './CloseButton.module.scss';

const CloseButton: FC<ButtonProps & React.RefAttributes<HTMLButtonElement>> = (
  props,
) => {
  return (
    <Button
      className={styles['close']}
      icon={<CloseOutlined />}
      type="text"
      title="Закрыть"
      shape="round"
      {...props}
    />
  );
};

export default memo(CloseButton);
