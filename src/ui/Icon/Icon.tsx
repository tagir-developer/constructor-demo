import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';
import React, { FC, ReactElement, memo } from 'react';

export enum IconTypes {
  LAYERS = 'icon-layers-filled',
}

interface IProps {
  icon?: ReactElement; // ant icon
  color?: string;
  size?: number;
  // type?: IconTypes; // custom iconmoon font type
  type?: string;
}

const Icon: FC<IconBaseProps & IProps> = ({ icon, color, size, type }) => {
  const iconStyles = {
    ...(color ? { color } : {}),
    ...(size ? { fontSize: size } : {}),
  };

  return (
    <>
      {icon && <icon.type key={icon.key} {...icon.props} style={iconStyles} />}

      {type && <span style={iconStyles} className={`custom-icon ${type}`} />}
    </>
  );
};

export default memo(Icon);
