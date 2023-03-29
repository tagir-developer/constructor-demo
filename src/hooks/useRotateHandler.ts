import {
  IPointCoords,
  KeyCodeTypes,
  PointPositionTypes,
} from 'common/interfaces';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CoordsService from 'services/CoordsService';
import { changeElemStyles } from 'store/reducers/elems.slice';

import { IRotateActionZones } from './hooks.interfaces';

export default function useRotateHandler(
  id: string,
  ref: React.RefObject<HTMLElement>,
  pressedKeys: string[],
): (event: React.MouseEvent) => void {
  const dispatch = useDispatch();

  const startResizeHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      const elem = ref.current;

      if (elem && !pressedKeys.includes(KeyCodeTypes.SPACE)) {
        document.body.style.cursor = `pointer`;

        const elemCoords = CoordsService.getCoords(elem);

        const centerPoint = {
          x: elemCoords.left + elem.offsetWidth / 2,
          y: elemCoords.top + elem.offsetHeight / 2,
        };

        const startPoint = { x: event.pageX, y: event.pageY };

        const topPoint = {
          x: elemCoords.left + elem.offsetWidth / 2,
          y: elemCoords.top,
        };

        const leftPoint = {
          x: elemCoords.left,
          y: elemCoords.top + elem.offsetHeight / 2,
        };

        const bottomPoint = {
          x: elemCoords.left + elem.offsetWidth / 2,
          y: elemCoords.bottom,
        };

        const rightPoint = {
          x: elemCoords.right,
          y: elemCoords.top + elem.offsetHeight / 2,
        };

        const handlerPosition = CoordsService.getPositionRelativeToPoint(
          centerPoint,
          startPoint,
        );

        const getRotateActionZones = (
          handlerPosition: PointPositionTypes,
        ): IRotateActionZones => {
          switch (handlerPosition) {
            case PointPositionTypes.TOP_LEFT:
              return {
                firstQuarter: {
                  position: PointPositionTypes.TOP_LEFT,
                  checkPoint: { x: 0, y: 0 },
                },
                secondQuarter: {
                  position: PointPositionTypes.BOTTOM_LEFT,
                  checkPoint: leftPoint,
                },
                thirdQuarter: {
                  position: PointPositionTypes.BOTTOM_RIGHT,
                  checkPoint: bottomPoint,
                },
                lastQuarter: {
                  position: PointPositionTypes.TOP_RIGHT,
                  checkPoint: rightPoint,
                },
              };
            case PointPositionTypes.BOTTOM_LEFT:
              return {
                firstQuarter: {
                  position: PointPositionTypes.BOTTOM_LEFT,
                  checkPoint: { x: 0, y: 0 },
                },
                secondQuarter: {
                  position: PointPositionTypes.BOTTOM_RIGHT,
                  checkPoint: bottomPoint,
                },
                thirdQuarter: {
                  position: PointPositionTypes.TOP_RIGHT,
                  checkPoint: rightPoint,
                },
                lastQuarter: {
                  position: PointPositionTypes.TOP_LEFT,
                  checkPoint: topPoint,
                },
              };
            case PointPositionTypes.BOTTOM_RIGHT:
              return {
                firstQuarter: {
                  position: PointPositionTypes.BOTTOM_RIGHT,
                  checkPoint: { x: 0, y: 0 },
                },
                secondQuarter: {
                  position: PointPositionTypes.TOP_RIGHT,
                  checkPoint: rightPoint,
                },
                thirdQuarter: {
                  position: PointPositionTypes.TOP_LEFT,
                  checkPoint: topPoint,
                },
                lastQuarter: {
                  position: PointPositionTypes.BOTTOM_LEFT,
                  checkPoint: leftPoint,
                },
              };
            case PointPositionTypes.TOP_RIGHT:
              return {
                firstQuarter: {
                  position: PointPositionTypes.TOP_RIGHT,
                  checkPoint: { x: 0, y: 0 },
                },
                secondQuarter: {
                  position: PointPositionTypes.TOP_LEFT,
                  checkPoint: topPoint,
                },
                thirdQuarter: {
                  position: PointPositionTypes.BOTTOM_LEFT,
                  checkPoint: leftPoint,
                },
                lastQuarter: {
                  position: PointPositionTypes.BOTTOM_RIGHT,
                  checkPoint: bottomPoint,
                },
              };
            default:
              return {
                firstQuarter: {
                  position: PointPositionTypes.TOP_LEFT,
                  checkPoint: { x: 0, y: 0 },
                },
                secondQuarter: {
                  position: PointPositionTypes.BOTTOM_LEFT,
                  checkPoint: leftPoint,
                },
                thirdQuarter: {
                  position: PointPositionTypes.BOTTOM_RIGHT,
                  checkPoint: bottomPoint,
                },
                lastQuarter: {
                  position: PointPositionTypes.TOP_RIGHT,
                  checkPoint: rightPoint,
                },
              };
          }
        };

        const zones = getRotateActionZones(handlerPosition);

        const getZeroPoint = (
          handlerPosition: PointPositionTypes,
        ): IPointCoords => {
          switch (handlerPosition) {
            case PointPositionTypes.TOP_LEFT:
              return topPoint;
            case PointPositionTypes.BOTTOM_LEFT:
              return leftPoint;
            case PointPositionTypes.BOTTOM_RIGHT:
              return bottomPoint;
            case PointPositionTypes.TOP_RIGHT:
              return rightPoint;
            default:
              return topPoint;
          }
        };

        const zeroPoint = getZeroPoint(handlerPosition);

        const getDiffAngle = (handlerPosition: PointPositionTypes): number => {
          switch (handlerPosition) {
            case PointPositionTypes.TOP_LEFT:
              return CoordsService.findAngle(
                startPoint,
                centerPoint,
                leftPoint,
              );
            case PointPositionTypes.BOTTOM_LEFT:
              return CoordsService.findAngle(
                startPoint,
                centerPoint,
                bottomPoint,
              );
            case PointPositionTypes.BOTTOM_RIGHT:
              return CoordsService.findAngle(
                startPoint,
                centerPoint,
                rightPoint,
              );
            case PointPositionTypes.TOP_RIGHT:
              return CoordsService.findAngle(startPoint, centerPoint, topPoint);
            default:
              return CoordsService.findAngle(
                startPoint,
                centerPoint,
                leftPoint,
              );
          }
        };

        const diffAngle = getDiffAngle(handlerPosition);

        const zeroStartDiffAngle = 90 - diffAngle;

        const elemAngle = Number(
          elem.style.transform.match(/(rotate\(-?)(\d+(\.\d+)?)(?=deg)/)?.[2],
        );

        const rotateHandler = (pageX: number, pageY: number): void => {
          const cursorPoint = { x: pageX, y: pageY };

          let angle = 0;

          const cursorPosition = CoordsService.getPositionRelativeToPoint(
            centerPoint,
            cursorPoint,
          );

          const zeroCursorDiffAngle = CoordsService.findAngle(
            zeroPoint,
            centerPoint,
            cursorPoint,
          );

          if (cursorPosition === zones.firstQuarter.position) {
            if (zeroCursorDiffAngle >= zeroStartDiffAngle) {
              angle = CoordsService.findAngle(
                startPoint,
                centerPoint,
                cursorPoint,
              );
            } else {
              angle = 270 + diffAngle + zeroCursorDiffAngle;
            }
          } else if (cursorPosition === zones.secondQuarter.position) {
            const cursorAndLeftPoinAngle = CoordsService.findAngle(
              cursorPoint,
              centerPoint,
              zones.secondQuarter.checkPoint,
            );

            angle = diffAngle + cursorAndLeftPoinAngle;
          } else if (cursorPosition === zones.thirdQuarter.position) {
            const diffAngle2 = diffAngle + 90;

            const cursorAndBottomPoinAngle = CoordsService.findAngle(
              cursorPoint,
              centerPoint,
              zones.thirdQuarter.checkPoint,
            );

            angle = diffAngle2 + cursorAndBottomPoinAngle;
          } else if (cursorPosition === zones.lastQuarter.position) {
            const diffAngle3 = diffAngle + 180;

            const cursorAndRightPoinAngle = CoordsService.findAngle(
              cursorPoint,
              centerPoint,
              zones.lastQuarter.checkPoint,
            );

            angle = diffAngle3 + cursorAndRightPoinAngle;
          }

          if (elemAngle && Number.isFinite(elemAngle)) {
            angle = elemAngle + angle;
          }

          elem.style.transform = `rotate(-${angle}deg)`;
        };

        const onMouseMove = (event: MouseEvent): void => {
          rotateHandler(event.pageX, event.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);

          document.body.style.cursor = 'inherit';

          dispatch(
            changeElemStyles({
              id,
              styles: {
                transform: elem.style.transform,
              },
            }),
          );
          document.onmouseup = null;
        };
      }
    },
    [id, dispatch, pressedKeys, ref],
  );

  return startResizeHandler;
}
