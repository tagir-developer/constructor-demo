import { ReactElement } from 'react';

export interface IAddElemCardItem {
  title: string;
  icon?: ReactElement;
  iconType?: string;
  onClick: () => void;
}
