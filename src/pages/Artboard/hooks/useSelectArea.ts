import { KeyCodeTypes } from 'common/interfaces';
import useAddEventListener from 'hooks/useAddEventListener';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DragAndDropService } from 'services/DragAndDropService';
import ElemsService from 'services/ElemsService';
import KeyboardService from 'services/KeyboardService';
import { setSelectedElemsIds } from 'store/reducers/elems.slice';

export default function useSelectArea(
  canvasRef: React.RefObject<HTMLDivElement>,
): void {
  const dispatch = useDispatch();

  const pressedKeys = useTypedSelector((state) => state.common.pressedKeys);
  const elems = useTypedSelector((state) => state.elems.elems);

  const selectAreaHandler = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();

      const elem = canvasRef.current;
      const target = event.target as HTMLElement;

      if (
        elem &&
        !KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
          KeyCodeTypes.SPACE,
        ]) &&
        (elem.isEqualNode(target) ||
          target.hasAttribute('data-select-area-target'))
      ) {
        const areaElem = document.createElement('div');

        const dragAndDropService = new DragAndDropService(
          '',
          areaElem,
          event,
          pressedKeys,
          [],
          dispatch,
        );

        const setSelectionAreaSize =
          dragAndDropService.addSelectionElemAndGetResizeHandler();

        const onMouseMove = (event: MouseEvent): void => {
          setSelectionAreaSize(event.pageX, event.pageY);
        };

        const onMouseUp = (): void => {
          const elemsIds = ElemsService.getSelectableElemsIds(areaElem, elems);

          if (elemsIds.length) {
            dispatch(setSelectedElemsIds(elemsIds));
          }

          areaElem.remove();
        };

        dragAndDropService.addListenersWithFinishCallback(
          onMouseMove,
          onMouseUp,
        );
      }
    },
    [dispatch, pressedKeys, elems, canvasRef],
  );

  useAddEventListener(canvasRef, 'mousedown', selectAreaHandler);
}
