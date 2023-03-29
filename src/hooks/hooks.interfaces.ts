import { IPointCoords, PointPositionTypes } from 'common/interfaces';

export enum ResizeHandlerPositions {
  RIGHT_SIDE = 'RIGHT_SIDE',
  LEFT_SIDE = 'LEFT_SIDE',
  TOP_SIDE = 'TOP_SIDE',
  BOTTOM_SIDE = 'BOTTOM_SIDE',
  BOTTOM_RIGHT_CORNER = 'BOTTOM_RIGHT_CORNER',
  BOTTOM_LEFT_CORNER = 'BOTTOM_LEFT_CORNER',
  TOP_LEFT_CORNER = 'TOP_LEFT_CORNER',
  TOP_RIGHT_CORNER = 'TOP_RIGHT_CORNER',
}

export type TypeResizeHandler = (x: number, y: number) => void;

interface IQuarterData {
  position: PointPositionTypes;
  checkPoint: IPointCoords;
}
export interface IRotateActionZones {
  firstQuarter: IQuarterData;
  secondQuarter: IQuarterData;
  thirdQuarter: IQuarterData;
  lastQuarter: IQuarterData;
}
