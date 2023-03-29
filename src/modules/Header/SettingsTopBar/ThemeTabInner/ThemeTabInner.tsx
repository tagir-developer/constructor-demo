import { themeAccentColors } from 'common/constants';
import { ThemeAccentColors, ThemeTypes } from 'common/interfaces';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import {
  changeThemeAccentColor,
  changeThemeType,
} from 'store/reducers/common.slice';
import Icon from 'ui/Icon';
import IconCard from 'ui/IconCard';

import { getThemeCardItems } from './ThemeTabInner.helpers';
import styles from './ThemeTabInner.module.scss';

interface IProps {
  setIsSettingsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeTabInner: FC<IProps> = ({ setIsSettingsMenuOpen }) => {
  const themeConfig = useTypedSelector((state) => state.common.themeConfig);

  const dispatch = useDispatch();

  const handleSelectColor = (color: ThemeAccentColors): void => {
    dispatch(changeThemeAccentColor(color));
  };

  const handleSelectTheme = (type: ThemeTypes): void => {
    dispatch(changeThemeType(type));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.themes}>
        <span className={styles.title}>Тема интерфейса</span>

        <div className={styles['cards-wrapper']}>
          {getThemeCardItems().map((item, index) => (
            <IconCard
              key={index}
              size="big"
              icon={item.icon}
              iconType={item.iconType}
              title={item.title}
              onClick={() => handleSelectTheme(item.themeType)}
              isActive={item.themeType === themeConfig.themeType}
            />
          ))}
        </div>
      </div>

      <div className={styles.colors}>
        <span className={styles.title}>Акцентный цвет</span>

        <div className={styles['colors-wrapper']}>
          {themeAccentColors.map((item, index) => (
            <div
              style={{ background: item }}
              className={styles.color}
              key={index}
              onClick={() => handleSelectColor(item)}
            >
              {item === themeConfig.accentColor && (
                <Icon type="icon-check-mark" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ThemeTabInner);
