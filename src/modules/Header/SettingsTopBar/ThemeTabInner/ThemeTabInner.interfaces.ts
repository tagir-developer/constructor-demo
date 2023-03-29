import { ThemeTypes } from 'common/interfaces';
import { ReactElement } from 'react';

export interface IThemeCardItem {
  title: string;
  icon?: ReactElement;
  iconType?: string;
  themeType: ThemeTypes;
}
