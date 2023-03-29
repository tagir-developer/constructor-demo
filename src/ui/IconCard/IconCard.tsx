import classNames from 'classnames';
import { FC, ReactElement, memo } from 'react';
import Icon from 'ui/Icon/Icon';

import styles from './IconCard.module.scss';

interface IProps {
  className?: string;
  icon?: ReactElement;
  iconType?: string;
  size: 'small' | 'middle' | 'big';
  title?: string;
  onClick: () => void;
  isActive?: boolean;
}

const IconCard: FC<IProps> = ({
  className,
  icon,
  size,
  iconType,
  title,
  onClick,
  isActive,
  ...props
}) => {
  const iconTitle = title
    ? size && size === 'big'
      ? title.toUpperCase()
      : title
    : null;

  return (
    <div
      className={classNames(styles.card, className ?? '', styles[size], {
        [styles.selected]: isActive,
      })}
      {...props}
      onClick={onClick}
    >
      <Icon icon={icon} type={iconType} />

      <span className={styles.title}>{iconTitle}</span>
    </div>
  );
};

export default memo(IconCard);
