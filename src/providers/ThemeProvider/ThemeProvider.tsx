import { ConfigProvider } from 'antd';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { FC, PropsWithChildren, useEffect } from 'react';

import { getAppTheme } from './ThemeProvider.helpers';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const themeConfig = useTypedSelector((state) => state.common.themeConfig);

  const appTheme = getAppTheme(themeConfig);

  // переопределяем глобальные переменные css
  useEffect(() => {
    if (appTheme.token) {
      for (const [key, value] of Object.entries(appTheme.token)) {
        document.documentElement.style.setProperty(
          `--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`,
          value.toString(),
        );
      }
    }
  }, [appTheme]);

  return (
    <ConfigProvider theme={appTheme}>
      <div className="App">{children}</div>
    </ConfigProvider>
  );
};

export default ThemeProvider;
