import ThemeProvider from 'providers/ThemeProvider';
import React, { FC } from 'react';

import AppRoutes from './routes/Routes';

import 'styles/global.scss';


const App: FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
