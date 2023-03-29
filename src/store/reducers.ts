import { combineReducers } from '@reduxjs/toolkit';

import { api } from './api/api';
import commonSlice from './reducers/common.slice';
import elemsSlice from './reducers/elems.slice';
import guidesSlice from './reducers/guides.slice';

export const rootReducers = combineReducers({
  [api.reducerPath]: api.reducer,
  common: commonSlice,
  elems: elemsSlice,
  guides: guidesSlice,
});
