import { ThemeTypes } from 'common/interfaces';

import { IThemeCardItem } from './ThemeTabInner.interfaces';

export const getThemeCardItems = (): IThemeCardItem[] => {
  return [
    {
      title: 'Светлая',
      iconType: 'icon-light-theme',
      themeType: ThemeTypes.LIGHT,
    },
    {
      title: 'Тёмная',
      iconType: 'icon-dark-theme',
      themeType: ThemeTypes.DARK,
    },
  ];
};
