import {
  IElemCoords,
  IPointCoords,
  KeyCodeTypes,
  PointPositionTypes,
} from 'common/interfaces';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CoordsService from 'services/CoordsService';
import { changeElemStyles } from 'store/reducers/elems.slice';

export default function useChangeBorderRadius(
  id: string,
  ref: React.RefObject<HTMLElement>,
  pressedKeys: string[],
): (event: React.MouseEvent) => void {
  const dispatch = useDispatch();

  const getCornerPoint = (
    handlerPosition: PointPositionTypes,
    elemCoords: IElemCoords,
  ): IPointCoords => {
    switch (handlerPosition) {
      case PointPositionTypes.TOP_RIGHT:
        return { x: elemCoords.right, y: elemCoords.top };
      case PointPositionTypes.TOP_LEFT:
        return { x: elemCoords.left, y: elemCoords.top };
      case PointPositionTypes.BOTTOM_RIGHT:
        return { x: elemCoords.right, y: elemCoords.bottom };
      case PointPositionTypes.BOTTOM_LEFT:
        return { x: elemCoords.left, y: elemCoords.bottom };
      default:
        return { x: elemCoords.right, y: elemCoords.top };
    }
  };

  const changeBorderRadiusHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      const elem = ref.current;

      if (elem && !pressedKeys.includes(KeyCodeTypes.SPACE)) {
        document.body.style.cursor = `pointer`;

        const elemCoords = CoordsService.getCoords(elem);

        const eventInitialPoint = {
          x: event.pageX,
          y: event.pageY,
        };

        const centerPoint = {
          x: elemCoords.left + elem.offsetWidth / 2,
          y: elemCoords.top + elem.offsetHeight / 2,
        };

        const handlerPosition = CoordsService.getPositionRelativeToPoint(
          centerPoint,
          eventInitialPoint,
        );

        const cornerPoint = getCornerPoint(handlerPosition, elemCoords);

        const totalSpace = CoordsService.findSpaceBetweenPoints(
          centerPoint,
          cornerPoint,
        );

        const changeBorderRadius = (pageX: number, pageY: number): void => {
          document.body.style.cursor = `pointer`;

          const cursorPoint = { x: pageX, y: pageY };

          const cursorSpace = CoordsService.findSpaceBetweenPoints(
            cursorPoint,
            cornerPoint,
          );
          const centerCursorSpace = CoordsService.findSpaceBetweenPoints(
            cursorPoint,
            centerPoint,
          );

          const maxRadius = Math.min(elem.offsetHeight, elem.offsetWidth) / 2;

          let radius = Math.round((cursorSpace * maxRadius) / totalSpace);

          const cursorPosition = CoordsService.getPositionRelativeToPoint(
            centerPoint,
            cursorPoint,
          );

          if (
            centerCursorSpace >= totalSpace &&
            cursorPosition === handlerPosition
          ) {
            radius = 0;
          }

          elem.style.borderRadius = radius + 'px';
        };

        const onMouseMove = (event: MouseEvent): void => {
          changeBorderRadius(event.pageX, event.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);

          document.body.style.cursor = 'inherit';

          dispatch(
            changeElemStyles({
              id,
              styles: {
                borderRadius: elem.style.borderRadius,
              },
            }),
          );
          document.onmouseup = null;
        };
      }
    },
    [id, dispatch, pressedKeys, ref],
  );

  return changeBorderRadiusHandler;
}
