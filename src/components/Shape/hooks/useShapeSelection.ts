import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { IElement, KeyCodeTypes } from 'common/interfaces';
import useAddEventListener from 'hooks/useAddEventListener';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useCallback, useMemo } from 'react';
import CollectionService from 'services/CollectionService';
import KeyboardService from 'services/KeyboardService';
import {
  addSelectedElemId,
  removeSelectedElemId,
  setSelectedChildElem,
} from 'store/reducers/elems.slice';

// TODO: хук выделения мало отличается от хука выделения группы, может лучше сделать универсальный
export default function useShapeSelection(
  id: string,
  elemRef: React.RefObject<HTMLDivElement>,
  elems: IElement[],
  pressedKeys: string[],
  selectedElemsIds: string[],
  dispatch: Dispatch<AnyAction>,
): { isSelected: boolean } {
  const canvasRef = useTypedSelector((state) => state.common.canvasRef);

  const isSelected = useMemo((): boolean => {
    return selectedElemsIds.includes(id);
  }, [selectedElemsIds, id]);

  const selectElem = useCallback((): void => {
    const elem = CollectionService.findElemById(elems, id);

    if (elem?.isHidden || elem?.isBlocked) return;

    if (
      !isSelected &&
      !KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
        KeyCodeTypes.SPACE,
      ]) &&
      !elem?.groupId
    ) {
      dispatch(addSelectedElemId(id));
    }
  }, [id, dispatch, isSelected, pressedKeys, elems]);

  const handleDoubleClick = useCallback(
    (e: MouseEvent): void => {
      const elem = CollectionService.findElemById(elems, id);

      if (!elem?.groupId) return;

      dispatch(setSelectedChildElem(elem));
    },
    [elems, id, dispatch],
  );

  const removeElemSelection = useCallback((): void => {
    if (
      !KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
        KeyCodeTypes.SHIFT_LEFT,
        KeyCodeTypes.SHIFT_RIGHT,
        KeyCodeTypes.SPACE,
      ])
    ) {
      dispatch(removeSelectedElemId(id));
    }
  }, [id, dispatch, pressedKeys]);

  useAddEventListener(elemRef, 'mousedown', selectElem);

  useAddEventListener(elemRef, 'dblclick', handleDoubleClick);

  useOnClickOutside(elemRef, removeElemSelection, canvasRef);

  return { isSelected };
}
