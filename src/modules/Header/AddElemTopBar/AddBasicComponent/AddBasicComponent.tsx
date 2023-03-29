import { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import IconCard from 'ui/IconCard';

import { getAddElemCardItems } from './AddBasicComponent.helpers';
import styles from './AddBasicComponent.module.scss';

interface IProps {
  setIsAddElemMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBasicComponent: FC<IProps> = ({ setIsAddElemMenuOpen }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.wrapper}>
      {getAddElemCardItems(dispatch, setIsAddElemMenuOpen).map(
        (item, index) => (
          <IconCard
            key={index}
            size="big"
            icon={item.icon}
            iconType={item.iconType}
            title={item.title}
            onClick={item.onClick}
          />
        ),
      )}
    </div>
  );
};

export default memo(AddBasicComponent);
