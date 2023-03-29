import { parseInt } from 'common/helpers';
import { IElemCoords, IStickyPoints, KeyCodeTypes } from 'common/interfaces';
import { ResizeHandlerPositions } from 'hooks/hooks.interfaces';

import CoordsService from './CoordsService';
import KeyboardService from './KeyboardService';

export class ResizeService {
  readonly stickingDist: number;

  constructor(
    readonly domElem: HTMLElement,
    readonly setElemSize: (
      value: React.SetStateAction<{
        width: number;
        height: number;
      }>,
    ) => void,
    readonly pressedKeys: string[],
    readonly stickyPoints: IStickyPoints[],
    readonly disableAltKeyTransform = false,
  ) {
    this.stickingDist = 10;
  }

  _getElemWidth(
    pageX: number,
    elemCoords: IElemCoords,
    handlerType: ResizeHandlerPositions,
  ): number {
    if (
      handlerType === ResizeHandlerPositions.BOTTOM_RIGHT_CORNER ||
      handlerType === ResizeHandlerPositions.TOP_RIGHT_CORNER
    ) {
      return Math.round(pageX - elemCoords.left);
    }

    if (
      handlerType === ResizeHandlerPositions.BOTTOM_LEFT_CORNER ||
      handlerType === ResizeHandlerPositions.TOP_LEFT_CORNER
    ) {
      return Math.round(elemCoords.right - pageX);
    }

    return 10;
  }

  _getElemHeight(
    pageY: number,
    elemCoords: IElemCoords,
    handlerType: ResizeHandlerPositions,
  ): number {
    if (
      handlerType === ResizeHandlerPositions.BOTTOM_RIGHT_CORNER ||
      handlerType === ResizeHandlerPositions.BOTTOM_LEFT_CORNER
    ) {
      return Math.round(pageY - elemCoords.top);
    }

    if (
      handlerType === ResizeHandlerPositions.TOP_RIGHT_CORNER ||
      handlerType === ResizeHandlerPositions.TOP_LEFT_CORNER
    ) {
      return Math.round(elemCoords.bottom - pageY);
    }

    return 10;
  }

  _handleCornerSetSize(
    width: number,
    height: number,
    elemCoords: IElemCoords,
    handlerType: ResizeHandlerPositions,
  ): void {
    if (handlerType === ResizeHandlerPositions.TOP_LEFT_CORNER) {
      this.domElem.style.top = elemCoords.bottom - height + 'px';
      this.domElem.style.left = elemCoords.right - width + 'px';
    }

    if (handlerType === ResizeHandlerPositions.TOP_RIGHT_CORNER) {
      this.domElem.style.top = elemCoords.bottom - height + 'px';
      this.domElem.style.left = elemCoords.left + 'px';
    }

    if (handlerType === ResizeHandlerPositions.BOTTOM_RIGHT_CORNER) {
      this.domElem.style.top = elemCoords.top + 'px';
      this.domElem.style.left = elemCoords.left + 'px';
    }

    if (handlerType === ResizeHandlerPositions.BOTTOM_LEFT_CORNER) {
      this.domElem.style.top = elemCoords.top + 'px';
      this.domElem.style.left = elemCoords.right - width + 'px';
    }

    this.domElem.style.width = width + 'px';
    this.domElem.style.height = height + 'px';

    this.setElemSize({ width, height });
  }

  _isValueInsideStickyZone(value: number, stickyPointValue: number): boolean {
    return (
      value > stickyPointValue - this.stickingDist &&
      value < stickyPointValue + this.stickingDist
    );
  }

  _updateElemSizeIfCursorInStickyZone(
    cursorX: number,
    cursorY: number,
    elemWidth: number | null,
    elemHeight: number | null,
    handlerType: ResizeHandlerPositions,
  ): { updatedWidth: number; updatedHeight: number } {
    let updatedWidth = elemWidth ?? 0;
    let updatedHeight = elemHeight ?? 0;

    const elemCoords = CoordsService.getCoords(this.domElem);

    let ignoreVerticalGuidesSticking = false;
    let ignoreHorizontalGuidesSticking = false;

    for (const pointsData of this.stickyPoints) {
      const isGuidePointsData = pointsData.xPoints.length === 1;

      if (
        !isGuidePointsData &&
        (cursorX > Math.max(...pointsData.xPoints) + this.stickingDist ||
          cursorX < Math.min(...pointsData.xPoints) - this.stickingDist ||
          cursorY > Math.max(...pointsData.yPoints) + this.stickingDist ||
          cursorY < Math.min(...pointsData.yPoints) - this.stickingDist)
      ) {
        continue;
      }

      for (const stickyValue of pointsData.xPoints) {
        if (ignoreVerticalGuidesSticking || !elemWidth) break;

        if (this._isValueInsideStickyZone(cursorX, stickyValue)) {
          ignoreVerticalGuidesSticking = true;

          switch (handlerType) {
            case ResizeHandlerPositions.RIGHT_SIDE:
            case ResizeHandlerPositions.TOP_RIGHT_CORNER:
            case ResizeHandlerPositions.BOTTOM_RIGHT_CORNER: {
              updatedWidth = Math.abs(stickyValue - elemCoords.left);
              break;
            }
            case ResizeHandlerPositions.LEFT_SIDE:
            case ResizeHandlerPositions.BOTTOM_LEFT_CORNER:
            case ResizeHandlerPositions.TOP_LEFT_CORNER: {
              updatedWidth = Math.abs(elemCoords.right - stickyValue);
              break;
            }
            default:
              break;
          }

          break;
        }

        ignoreVerticalGuidesSticking = false;
      }

      for (const stickyValue of pointsData.yPoints) {
        if (ignoreHorizontalGuidesSticking || !elemHeight) break;

        if (this._isValueInsideStickyZone(cursorY, stickyValue)) {
          ignoreHorizontalGuidesSticking = true;

          switch (handlerType) {
            case ResizeHandlerPositions.BOTTOM_SIDE:
            case ResizeHandlerPositions.BOTTOM_LEFT_CORNER:
            case ResizeHandlerPositions.BOTTOM_RIGHT_CORNER: {
              updatedHeight = Math.abs(stickyValue - elemCoords.top);
              break;
            }
            case ResizeHandlerPositions.TOP_SIDE:
            case ResizeHandlerPositions.TOP_RIGHT_CORNER:
            case ResizeHandlerPositions.TOP_LEFT_CORNER: {
              updatedHeight = Math.abs(elemCoords.bottom - stickyValue);
              break;
            }
            default:
              break;
          }

          break;
        }

        ignoreHorizontalGuidesSticking = false;
      }
    }

    return { updatedWidth, updatedHeight };
  }

  sideHorizontalResize(
    handlerType: ResizeHandlerPositions,
    pageX: number,
    pageY: number,
  ): void {
    const elemCoords = CoordsService.getCoords(this.domElem);

    let width: number;

    if (handlerType === ResizeHandlerPositions.LEFT_SIDE) {
      if (
        !this.disableAltKeyTransform &&
        KeyboardService.checkIfPressedOneKeyOf(this.pressedKeys, [
          KeyCodeTypes.ALT_LEFT,
          KeyCodeTypes.ALT_RIGHT,
        ])
      ) {
        const offset = Math.round(elemCoords.left - pageX);
        let right = elemCoords.right + offset;
        let left = elemCoords.left - offset;
        width = right - left;

        const center =
          parseInt(this.domElem.style.left) +
          parseInt(this.domElem.style.width) / 2;

        if (width <= 10) {
          width = 10;
          left = center - 5;
          right = left + 10;
        }

        this.domElem.style.right = right + 'px';
        this.domElem.style.left = left + 'px';
        this.domElem.style.width = width + 'px';
      } else {
        width = Math.round(elemCoords.right - pageX);

        const { updatedWidth } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          width,
          null,
          handlerType,
        );

        width = updatedWidth;

        if (width <= 10) width = 10;

        this.domElem.style.left = elemCoords.right - width + 'px';
        this.domElem.style.width = width + 'px';
      }
    }

    if (handlerType === ResizeHandlerPositions.RIGHT_SIDE) {
      if (
        !this.disableAltKeyTransform &&
        KeyboardService.checkIfPressedOneKeyOf(this.pressedKeys, [
          KeyCodeTypes.ALT_LEFT,
          KeyCodeTypes.ALT_RIGHT,
        ])
      ) {
        const offset = Math.round(pageX - elemCoords.right);
        const right = elemCoords.right + offset;
        let left = elemCoords.left - offset;
        width = right - left;

        const center =
          parseInt(this.domElem.style.left) +
          parseInt(this.domElem.style.width) / 2;

        if (width <= 10) {
          width = 10;
          left = center - 5;
        }

        this.domElem.style.left = left + 'px';
        this.domElem.style.width = width + 'px';
      } else {
        width = Math.round(pageX - elemCoords.left);

        const { updatedWidth } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          width,
          null,
          handlerType,
        );

        width = updatedWidth;

        if (width <= 10) width = 10;

        this.domElem.style.left = elemCoords.left + 'px';
        this.domElem.style.width = width + 'px';
      }
    }

    this.setElemSize((prev) => ({ ...prev, width: Math.round(width) }));
  }

  sideVerticalResize(
    handlerType: ResizeHandlerPositions,
    pageX: number,
    pageY: number,
  ): void {
    const elemCoords = CoordsService.getCoords(this.domElem);

    let height: number;

    if (handlerType === ResizeHandlerPositions.BOTTOM_SIDE) {
      if (
        !this.disableAltKeyTransform &&
        KeyboardService.checkIfPressedOneKeyOf(this.pressedKeys, [
          KeyCodeTypes.ALT_LEFT,
          KeyCodeTypes.ALT_RIGHT,
        ])
      ) {
        const offset = Math.round(pageY - elemCoords.bottom);
        const bottom = elemCoords.bottom + offset;
        let top = elemCoords.top - offset;
        height = bottom - top;

        const center =
          parseInt(this.domElem.style.top) +
          parseInt(this.domElem.style.height) / 2;

        if (height <= 10) {
          height = 10;
          top = center - 5;
        }

        this.domElem.style.top = top + 'px';
        this.domElem.style.height = height + 'px';
      } else {
        height = Math.round(pageY - elemCoords.top);

        const { updatedHeight } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          null,
          height,
          handlerType,
        );

        height = updatedHeight;

        if (height <= 10) height = 10;

        this.domElem.style.top = elemCoords.top + 'px';
        this.domElem.style.height = height + 'px';
      }
    }

    if (handlerType === ResizeHandlerPositions.TOP_SIDE) {
      if (
        !this.disableAltKeyTransform &&
        KeyboardService.checkIfPressedOneKeyOf(this.pressedKeys, [
          KeyCodeTypes.ALT_LEFT,
          KeyCodeTypes.ALT_RIGHT,
        ])
      ) {
        const offset = Math.round(elemCoords.top - pageY);
        const bottom = elemCoords.bottom + offset;
        let top = elemCoords.top - offset;
        height = bottom - top;

        const center =
          parseInt(this.domElem.style.top) +
          parseInt(this.domElem.style.height) / 2;

        if (height <= 10) {
          height = 10;
          top = center - 5;
        }

        this.domElem.style.top = top + 'px';
        this.domElem.style.height = height + 'px';
      } else {
        height = Math.round(elemCoords.bottom - pageY);

        const { updatedHeight } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          null,
          height,
          handlerType,
        );

        height = updatedHeight;

        if (height <= 10) height = 10;

        this.domElem.style.top = elemCoords.bottom - height + 'px';
        this.domElem.style.height = height + 'px';
      }
    }

    this.setElemSize((prev) => ({ ...prev, height: Math.round(height) }));
  }

  cornerResize(
    handlerType: ResizeHandlerPositions,
    pageX: number,
    pageY: number,
    pressedKeys: string[],
  ): void {
    const elemCoords = CoordsService.getCoords(this.domElem);

    if (
      KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
        KeyCodeTypes.SHIFT_LEFT,
        KeyCodeTypes.SHIFT_RIGHT,
      ])
    ) {
      const elemWidth = this.domElem.offsetWidth;
      const elemHeight = this.domElem.offsetHeight;

      let height = 0;
      let width = 0;

      if (elemWidth === elemHeight) {
        width = this._getElemWidth(pageX, elemCoords, handlerType);

        const { updatedWidth } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          width,
          null,
          handlerType,
        );

        width = updatedWidth;

        if (width <= 10) width = 10;

        height = width;
      } else if (elemWidth > elemHeight) {
        height = this._getElemHeight(pageY, elemCoords, handlerType);

        const { updatedHeight } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          null,
          height,
          handlerType,
        );

        height = updatedHeight;

        if (height <= 10) height = 10;

        width = Math.round((elemWidth / elemHeight) * height);
      } else {
        width = this._getElemWidth(pageX, elemCoords, handlerType);

        const { updatedWidth } = this._updateElemSizeIfCursorInStickyZone(
          pageX,
          pageY,
          width,
          null,
          handlerType,
        );

        width = updatedWidth;

        if (width <= 10) width = 10;

        height = Math.round((elemHeight / elemWidth) * width);
      }

      this._handleCornerSetSize(width, height, elemCoords, handlerType);
      return;
    }

    if (
      !this.disableAltKeyTransform &&
      KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
        KeyCodeTypes.ALT_LEFT,
        KeyCodeTypes.ALT_RIGHT,
      ])
    ) {
      let width = this._getElemWidth(pageX, elemCoords, handlerType);
      if (width <= 10) width = 10;
      const height = width;

      this._handleCornerSetSize(width, height, elemCoords, handlerType);
      return;
    }

    let width = this._getElemWidth(pageX, elemCoords, handlerType);
    let height = this._getElemHeight(pageY, elemCoords, handlerType);

    const { updatedWidth, updatedHeight } =
      this._updateElemSizeIfCursorInStickyZone(
        pageX,
        pageY,
        width,
        height,
        handlerType,
      );

    width = updatedWidth;
    height = updatedHeight;

    if (width <= 10) {
      width = 10;
    }

    if (height <= 10) {
      height = 10;
    }

    this._handleCornerSetSize(width, height, elemCoords, handlerType);
  }

  getCursorType(handlerType: ResizeHandlerPositions): string {
    switch (handlerType) {
      case ResizeHandlerPositions.RIGHT_SIDE:
      case ResizeHandlerPositions.LEFT_SIDE:
        return 'ew-resize';
      case ResizeHandlerPositions.TOP_SIDE:
      case ResizeHandlerPositions.BOTTOM_SIDE:
        return 'ns-resize';
      case ResizeHandlerPositions.BOTTOM_RIGHT_CORNER:
      case ResizeHandlerPositions.TOP_LEFT_CORNER:
        return 'nwse-resize';
      case ResizeHandlerPositions.TOP_RIGHT_CORNER:
      case ResizeHandlerPositions.BOTTOM_LEFT_CORNER:
        return 'nesw-resize';
      default:
        return 'inherit';
    }
  }
}
