import { KeyCodeTypes } from 'common/interfaces';
import useAddEventListener from 'hooks/useAddEventListener';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DragAndDropService } from 'services/DragAndDropService';
import { setIsMultipleStateUpdateEvent } from 'store/reducers/common.slice';
import { moveSelectedElemsByIds } from 'store/reducers/elems.slice';

export default function useMultiSelectDragAndDrop(
  selectedElemsIds: string[],
  elemRef: React.RefObject<HTMLDivElement>,
  setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties | null>>,
  pressedKeys: string[],
  isBlocked: boolean,
): void {
  const dispatch = useDispatch();

  const dragAndDropHandler = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();

      if (isBlocked) return;

      const domElem = elemRef.current;
      const target = event.target as HTMLElement;

      if (
        domElem &&
        !pressedKeys.includes(KeyCodeTypes.SPACE) &&
        (domElem.isEqualNode(target) ||
          (target.hasAttribute('data-multiselection') &&
            target.hasAttribute('data-draggable')))
      ) {
        dispatch(setIsMultipleStateUpdateEvent(true));

        const dragAndDropService = new DragAndDropService(
          '',
          domElem,
          event,
          pressedKeys,
          [],
          dispatch,
        );

        const changeStateCallback = (
          leftOffset: number,
          topOffset: number,
        ): void => {
          dispatch(
            moveSelectedElemsByIds({
              ids: selectedElemsIds,
              offset: { left: leftOffset, top: topOffset },
            }),
          );
        };

        const moveHandler =
          dragAndDropService.getMoveMultiSelectionHandler(changeStateCallback);

        const onMouseMove = (event: MouseEvent): void => {
          moveHandler(event.pageX, event.pageY);
        };

        const onMouseUp = (): void => {
          setStyles((prev) => ({
            ...prev,
            top: domElem.style.top,
            left: domElem.style.left,
          }));
          dispatch(setIsMultipleStateUpdateEvent(false));
        };

        dragAndDropService.addListenersWithFinishCallback(
          onMouseMove,
          onMouseUp,
        );
      }
    },
    [selectedElemsIds, dispatch, pressedKeys, elemRef, setStyles, isBlocked],
  );

  useAddEventListener(elemRef, 'mousedown', dragAndDropHandler);
}
