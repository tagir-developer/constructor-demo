import { TypedStartListening, configureStore } from '@reduxjs/toolkit';

import { api } from './api/api';
import { saveChangesInHistoryMiddleware } from './middlewares/saveChangesInHistoryMiddleware';
import { undoRedoStateChangesMiddleware } from './middlewares/undoRedoStateChangesMiddleware';
import { rootReducers } from './reducers';

const { appChangesListener } = saveChangesInHistoryMiddleware();
const { undoRedoActionsListener } = undoRedoStateChangesMiddleware();

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .prepend(
        undoRedoActionsListener.middleware,
        appChangesListener.middleware,
      )
      .concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type TypeRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStartListening = TypedStartListening<TypeRootState, AppDispatch>;

export default store;
