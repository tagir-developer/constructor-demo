import { CSSProperties } from 'react';

export type TypeUnknownObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeUnknown = any;

// export type TypeChangePropertyHandler = <T>(value: keyof T) => T[keyof T];
// export type TypeChangePropertyHandler = <T>(value: T[keyof T]) => T[keyof T];
export type TypeChangeStylesHandler = (value: CSSProperties) => CSSProperties;

export type MakeKeysOptional<T> = {
  [key in keyof T]?: MakeKeysOptional<T[key]>;
};

// export type ObjectProps<T> = {
//   [key in keyof T]?: T[key];
// };

// enums ----------

// export enum ResponseStatus {
//   SUCCESS = 'success',
//   ERROR = 'error',
// }

export type MovementDirectionType = 'top' | 'right' | 'bottom' | 'left';

export type TypeObjectProps<T> = { [key in keyof T]?: T[key] };

// enums

export enum NotificationTypes {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ThemeAccentColors {
  RED = 'red',
  BLUE = 'blue',
  YELLOW_GREEN = '#199E3F',
  BLUE_GREEN = '#129890',
  ORANGE = '#F68705',
  PURPLE = '#B41EE9',
  SALAD_GREEN = '#85B917',
  BLACK = '#000',
  GREY = '#EEEEEE',
}

export enum ThemeTypes {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum ButtonTypes {
  PRIMARY = 'primary',
  GHOST = 'ghost',
  DASHED = 'dashed',
  LINK = 'link',
  TEXT = 'text',
  DEFAULT = 'default',
}

export enum ElemTypes {
  BLOCK = 'BLOCK',
  GROUP = 'GROUP',
  TEXT = 'TEXT',
}

export enum GuideTypes {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

export enum KeyCodeTypes {
  SPACE = 'Space',
  CTRL_LEFT = 'ControlLeft',
  CTRL_RIGHT = 'ControlRight',
  SHIFT_LEFT = 'ShiftLeft',
  SHIFT_RIGHT = 'ShiftRight',
  ALT_LEFT = 'AltLeft',
  ALT_RIGHT = 'AltRight',
  DELETE = 'Delete',
  KEY_C = 'KeyC',
  KEY_V = 'KeyV',
  KEY_X = 'KeyX',
  KEY_Z = 'KeyZ',
  KEY_G = 'KeyG',
  KEY_L = 'KeyL',
  KEY_U = 'KeyU',
  ARROW_TOP = 'ArrowUp',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_BOTTOM = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  BRACKET_LEFT = 'BracketLeft',
  BRACKET_RIGHT = 'BracketRight',
}

export enum PointPositionTypes {
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
}

// interfaces --------------

export interface IElement {
  id: string;
  elem: JSX.Element;
  // styles: CSSProperties | CSSStyleDeclaration;
  styles: CSSProperties;
  elemType: ElemTypes;
  groupId: string | null;
  layerName: string;
  isHidden: boolean;
  isBlocked: boolean;
  showNestedLayers?: boolean;
  children: IElement[] | null;
}
export interface ISettingPanel {
  id: string;
  title: string;
  elem: JSX.Element;
}

export interface IPointCoords {
  x: number;
  y: number;
}

export interface IElemSizes {
  width: number;
  height: number;
}

export interface IStyleData {
  id: string;
  style: CSSProperties;
}

export interface IElemCoords {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type TypeHexColor = `#${string}`;

export interface ISizeOptions {
  width: number;
  height: number;
}

export interface IChangeGroupStyles {
  id: string;
  styles: React.CSSProperties;
  children: IStylesByElemId[] | null;
}

export interface IStylesByElemId {
  id: string;
  styles: React.CSSProperties;
  children?: IStylesByElemId[] | null;
}

export interface IElemsGroupMainStyles {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface ITestObj {
  id: string;
  name: string;
  isDead: boolean;
  children: ITestObj[] | null;
}

export interface IStickyPoints {
  id: string;
  xPoints: number[];
  yPoints: number[];
}

export interface IGuide {
  id: string;
  type: GuideTypes;
  x: number;
  y: number;
  isBlocked: boolean;
}
