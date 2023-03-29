import {
  IElemCoords,
  IPointCoords,
  PointPositionTypes,
} from 'common/interfaces';

class CoordsService {
  getCoords(elem: HTMLElement): IElemCoords {
    const box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  findAngle(
    A: IPointCoords, // A first point, ex: {x: 0, y: 0}
    B: IPointCoords, // B center point
    C: IPointCoords, // C second point
  ): number {
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return (
      (Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * 180) / Math.PI
    );
  }

  findSpaceBetweenPoints(A: IPointCoords, B: IPointCoords): number {
    const deltaX = Math.abs(A.x - B.x);
    const deltaY = Math.abs(A.y - B.y);

    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return dist;
  }

  getPositionRelativeToPoint(
    zeroPoint: IPointCoords, // точка относительно которой ищем позицию
    point: IPointCoords,
  ): PointPositionTypes {
    if (point.x >= zeroPoint.x && point.y < zeroPoint.y)
      return PointPositionTypes.TOP_RIGHT;
    if (point.x < zeroPoint.x && point.y < zeroPoint.y)
      return PointPositionTypes.TOP_LEFT;
    if (point.x >= zeroPoint.x && point.y >= zeroPoint.y)
      return PointPositionTypes.BOTTOM_RIGHT;
    if (point.x < zeroPoint.x && point.y >= zeroPoint.y)
      return PointPositionTypes.BOTTOM_LEFT;

    return PointPositionTypes.TOP_RIGHT;
  }
}

export default new CoordsService();
