import { KeyCodeTypes } from 'common/interfaces';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ResizeService } from 'services/ResizeService';
import { changeElemStyles } from 'store/reducers/elems.slice';

import { ResizeHandlerPositions, TypeResizeHandler } from './hooks.interfaces';
import { useTypedSelector } from './useTypedSelector';

export default function useResizeHandler(
  id: string,
  ref: React.RefObject<HTMLElement>,
  pressedKeys: string[],
  setElemSize: (
    value: React.SetStateAction<{
      width: number;
      height: number;
    }>,
  ) => void,
  handlerType: ResizeHandlerPositions,
): (event: React.MouseEvent) => void {
  const stickyPoints = useTypedSelector((state) => state.guides.stickyPoints);
  const dispatch = useDispatch();

  const startResizeHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      const elem = ref.current;

      if (elem && !pressedKeys.includes(KeyCodeTypes.SPACE)) {
        const filteredStickyPoints = stickyPoints.filter(
          (item) => item.id !== id,
        );

        const Resize = new ResizeService(
          elem,
          setElemSize,
          pressedKeys,
          filteredStickyPoints,
        );

        const getResizeHandlerByType = (
          handlerType: ResizeHandlerPositions,
        ): TypeResizeHandler | null => {
          switch (handlerType) {
            case ResizeHandlerPositions.RIGHT_SIDE:
            case ResizeHandlerPositions.LEFT_SIDE:
              return (pageX, pageY) =>
                Resize.sideHorizontalResize(handlerType, pageX, pageY);
            case ResizeHandlerPositions.TOP_SIDE:
            case ResizeHandlerPositions.BOTTOM_SIDE:
              return (pageX, pageY) =>
                Resize.sideVerticalResize(handlerType, pageX, pageY);
            case ResizeHandlerPositions.BOTTOM_RIGHT_CORNER:
            case ResizeHandlerPositions.BOTTOM_LEFT_CORNER:
            case ResizeHandlerPositions.TOP_RIGHT_CORNER:
            case ResizeHandlerPositions.TOP_LEFT_CORNER:
              return (pageX, pageY) =>
                Resize.cornerResize(handlerType, pageX, pageY, pressedKeys);
            default:
              return null;
          }
        };

        const resizeHandler = getResizeHandlerByType(handlerType);

        if (!resizeHandler) return;

        document.body.style.cursor = Resize.getCursorType(handlerType);

        const onMouseMove = (event: MouseEvent): void => {
          resizeHandler(event.pageX, event.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);

          document.body.style.cursor = 'inherit';

          dispatch(
            changeElemStyles({
              id,
              styles: {
                width: elem.style.width,
                height: elem.style.height,
                right: elem.style.right,
                left: elem.style.left,
                top: elem.style.top,
                bottom: elem.style.bottom,
              },
            }),
          );
          document.onmouseup = null;
        };
      }
    },
    [id, dispatch, pressedKeys, ref, setElemSize, handlerType, stickyPoints],
  );

  return startResizeHandler;
}
