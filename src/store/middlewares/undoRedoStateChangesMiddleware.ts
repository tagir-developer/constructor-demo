import {
  AnyAction,
  ListenerMiddlewareInstance,
  ThunkDispatch,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import CollectionService from 'services/CollectionService';
import { redoAction, undoAction } from 'store/reducers/common.slice';
import {
  IInitialElemsState,
  updateAllElemsState,
} from 'store/reducers/elems.slice';
import {
  IInitialGuidesState,
  updateAllGuidesState,
} from 'store/reducers/guides.slice';
import { AppStartListening } from 'store/store';

export const undoRedoStateChangesMiddleware = (): {
  undoRedoActionsListener: ListenerMiddlewareInstance<
    unknown,
    ThunkDispatch<unknown, unknown, AnyAction>,
    unknown
  >;
} => {
  const undoRedoActionsListener = createListenerMiddleware();

  const startAppChangesListening =
    undoRedoActionsListener.startListening as AppStartListening;

  startAppChangesListening({
    matcher: isAnyOf(undoAction, redoAction),
    effect: (action, listenerApi) => {
      const changesHistory = listenerApi.getState().common.history.before;

      if (!changesHistory.length) return;

      const prevHistoryState = changesHistory[changesHistory.length - 1];

      // извлекаем из истории предыдущее состояние для elemsSlice
      const guidesSliceStateKeys = Object.keys(listenerApi.getState().guides);

      const prevElemsSliceState = CollectionService.omit(
        prevHistoryState,
        guidesSliceStateKeys as Array<keyof IInitialGuidesState>,
      );

      //  извлекаем из истории предыдущее состояние для guidesSlice
      const elemsSliceStateKeys = Object.keys(listenerApi.getState().elems);

      const prevGuidesSliceState = CollectionService.omit(
        prevHistoryState,
        elemsSliceStateKeys as Array<keyof IInitialElemsState>,
      );

      // обновляем состояние приложения
      listenerApi.dispatch(updateAllElemsState(prevElemsSliceState));
      listenerApi.dispatch(updateAllGuidesState(prevGuidesSliceState));
    },
  });

  return { undoRedoActionsListener };
};
