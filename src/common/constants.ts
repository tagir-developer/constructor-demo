import { ThemeAccentColors } from './interfaces';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEFAULT_TIME_FORMAT = 'DD.MM.YYYY HH:mm';
export const NOTIFICATION_DEFAULT_DURATION_IN_SECONDS = 3;

export const DEFAULT_ARTBOARD_HEIGHT_PX = 700;
export const DEFAULT_CANVAS_HEIGHT_PX = 2500;

export const themeAccentColors: ThemeAccentColors[] = [
  ThemeAccentColors.RED,
  ThemeAccentColors.BLUE,
  ThemeAccentColors.YELLOW_GREEN,
  ThemeAccentColors.BLUE_GREEN,
  ThemeAccentColors.ORANGE,
  ThemeAccentColors.PURPLE,
  ThemeAccentColors.SALAD_GREEN,
  ThemeAccentColors.BLACK,
  ThemeAccentColors.GREY,
];
