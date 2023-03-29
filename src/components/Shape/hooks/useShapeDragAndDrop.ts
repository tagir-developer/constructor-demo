import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { IElement, KeyCodeTypes } from 'common/interfaces';
import useAddEventListener from 'hooks/useAddEventListener';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useCallback, useState } from 'react';
import CollectionService from 'services/CollectionService';
import { DragAndDropService } from 'services/DragAndDropService';
import KeyboardService from 'services/KeyboardService';
import { changeElemStyles } from 'store/reducers/elems.slice';

interface IUseShapeDragAndDrop {
  isDragAndDropAction: boolean;
}

export default function useShapeDragAndDrop(
  id: string,
  elemRef: React.RefObject<HTMLDivElement>,
  elems: IElement[],
  pressedKeys: string[],
  dispatch: Dispatch<AnyAction>,
): IUseShapeDragAndDrop {
  const stickyPoints = useTypedSelector((state) => state.guides.stickyPoints);

  const [isDragAndDropAction, setIsDragAndDropAction] = useState(false);

  const dragAndDropHandler = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();

      const elem = CollectionService.findElemById(elems, id);

      const groupElem = elem?.groupId
        ? CollectionService.findElemById(elems, elem.groupId)
        : null;

      if (groupElem || elem?.isHidden || elem?.isBlocked) return;

      const domElem = elemRef.current;
      const target = event.target as HTMLElement;

      if (
        domElem &&
        !KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
          KeyCodeTypes.SPACE,
          KeyCodeTypes.SHIFT_LEFT,
          KeyCodeTypes.SHIFT_RIGHT,
        ]) &&
        (domElem.isEqualNode(target) || target.hasAttribute('data-drag-target'))
      ) {
        const dragAndDropService = new DragAndDropService(
          id,
          domElem,
          event,
          pressedKeys,
          stickyPoints,
          // elems,
          // guides,
          dispatch,
        );

        const onMouseMove = (event: MouseEvent): void => {
          setIsDragAndDropAction(true);

          dragAndDropService.moveAt(event.pageX, event.pageY);
        };

        const onMouseUp = (): void => {
          setIsDragAndDropAction(false);

          dispatch(
            changeElemStyles({
              id,
              styles: { top: domElem.style.top, left: domElem.style.left },
            }),
          );
        };

        dragAndDropService.addListenersWithFinishCallback(
          onMouseMove,
          onMouseUp,
        );
      }
    },
    [id, dispatch, pressedKeys, elems, elemRef, stickyPoints],
  );

  useAddEventListener(elemRef, 'mousedown', dragAndDropHandler);

  return { isDragAndDropAction };
}
