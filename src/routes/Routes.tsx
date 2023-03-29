import Artboard from 'pages/Artboard';
import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Pages, paths } from './constants';

const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths[Pages.ARTBOARD]}>
          <Route index element={<Artboard />} />

          <Route path="*" element={<Navigate to={paths[Pages.ARTBOARD]} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
