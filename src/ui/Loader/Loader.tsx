import { Spin } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import styles from './Loader.module.scss';

interface IProps {
  className?: string;
  size?: 'large' | 'small' | 'default' | undefined;
}

function Loader({ className, size }: IProps): JSX.Element {
  return (
    <div className={classNames(styles['loader'], styles[className ?? ''])}>
      <Spin size={size ?? 'large'} />
    </div>
  );
}

export default memo(Loader);
