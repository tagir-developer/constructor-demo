import { ThemeConfig } from 'antd/es/config-provider/context';
import { ThemeTypes } from 'common/interfaces';
import { IThemeConfig } from 'store/reducers/common.slice';

export const getAppTheme = (themeConfig: IThemeConfig): ThemeConfig => {
  if (themeConfig.themeType === ThemeTypes.LIGHT) {
    return {
      token: {
        colorPrimary: themeConfig.accentColor,
        colorBgBase: '#fff',
        colorTextBase: '#202020',
        colorBgContainer: '#f5f5f5',
        colorTextSecondary: '#7c7c7c',
      },
    };
  } else {
    return {
      token: {
        colorPrimary: themeConfig.accentColor,
        colorTextBase: '#d8d8d8',
        colorBgBase: '#161616',
        colorBgContainer: '#282828',
        colorTextSecondary: '#7c7c7c',
      },
    };
  }
};
