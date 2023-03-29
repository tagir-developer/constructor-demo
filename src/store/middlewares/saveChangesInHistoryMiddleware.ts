import {
  AnyAction,
  ListenerMiddlewareInstance,
  ThunkDispatch,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import CollectionService from 'services/CollectionService';
import {
  IStateHistoryItem,
  saveStateInHistory,
} from 'store/reducers/common.slice';
import {
  COPY_ELEM_WHEN_DRAG_AND_DROP,
  UPDATE_ALL_ELEMS_STATE,
} from 'store/reducers/elems.slice';
import { UPDATE_ALL_GUIDES_STATE } from 'store/reducers/guides.slice';
import { AppStartListening } from 'store/store';

export const saveChangesInHistoryMiddleware = (): {
  appChangesListener: ListenerMiddlewareInstance<
    unknown,
    ThunkDispatch<unknown, unknown, AnyAction>,
    unknown
  >;
} => {
  const appChangesListener = createListenerMiddleware();

  const startAppChangesListening =
    appChangesListener.startListening as AppStartListening;

  startAppChangesListening({
    // фильтруем экшены для которых нужно обновлять историю
    predicate: (action, currentState, previousState) => {
      let isNeedToSaveAppStateInHistory =
        !currentState.common.isMultipleStateUpdateEvent &&
        (!CollectionService.isEqual(
          previousState.elems.elems,
          currentState.elems.elems,
        ) ||
          !CollectionService.isEqual(
            previousState.guides.guides,
            currentState.guides.guides,
          ) ||
          !CollectionService.isEqual(
            previousState.guides.isGuidesVisible,
            currentState.guides.isGuidesVisible,
          ));

      const isStateMultipleUpdateFinalChange =
        previousState.common.isMultipleStateUpdateEvent &&
        !currentState.common.isMultipleStateUpdateEvent;

      if (isStateMultipleUpdateFinalChange) {
        isNeedToSaveAppStateInHistory = true;
      }

      if (
        action.type.includes(UPDATE_ALL_ELEMS_STATE) ||
        action.type.includes(UPDATE_ALL_GUIDES_STATE) ||
        action.type.includes(COPY_ELEM_WHEN_DRAG_AND_DROP)
      ) {
        isNeedToSaveAppStateInHistory = false;
      }

      return isNeedToSaveAppStateInHistory;
    },
    effect: (action, listenerApi) => {
      const historyItem: IStateHistoryItem = {
        ...listenerApi.getState().elems,
        ...listenerApi.getState().guides,
      };

      listenerApi.dispatch(saveStateInHistory(historyItem));
    },
  });

  return { appChangesListener };
};
