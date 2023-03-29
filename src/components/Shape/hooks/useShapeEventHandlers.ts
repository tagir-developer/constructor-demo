import { IElemSizes } from 'common/interfaces';
import { ResizeHandlerPositions } from 'hooks/hooks.interfaces';
import useChangeBorderRadius from 'hooks/useChangeBorderRadius';
import useResizeHandler from 'hooks/useResizeHandler';
import useRotateHandler from 'hooks/useRotateHandler';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CollectionService from 'services/CollectionService';

import useShapeDragAndDrop from './useShapeDragAndDrop';
import useShapeSelection from './useShapeSelection';

export type TypeResizeHandler = (
  event: React.MouseEvent<Element, MouseEvent>,
) => void;

interface IUseEventHandlers {
  elemSize: IElemSizes;
  styles: React.CSSProperties;
  isBlocked: boolean;
  elemRef: React.RefObject<HTMLDivElement>;
  rotatedElemRef: React.RefObject<HTMLDivElement>;
  resizeHandlers: {
    top: TypeResizeHandler;
    right: TypeResizeHandler;
    bottom: TypeResizeHandler;
    left: TypeResizeHandler;
    topRight: TypeResizeHandler;
    bottomRight: TypeResizeHandler;
    bottomLeft: TypeResizeHandler;
    topLeft: TypeResizeHandler;
  };
  rotateHandler: (event: React.MouseEvent<Element, MouseEvent>) => void;
  changeRadiusHandler: (event: React.MouseEvent<Element, MouseEvent>) => void;
  isHiddenHandlersVisible: boolean;
  isSelectionWrapperVisible: boolean;
}

export default function useShapeEventHandlers(id: string): IUseEventHandlers {
  const dispatch = useDispatch();

  const [elemSize, setElemSize] = useState<IElemSizes>({
    width: 0,
    height: 0,
  });
  const [isHiddenHandlersVisible, setIsHiddenHandlersVisible] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const elemRef = useRef<HTMLDivElement>(null);
  const rotatedElemRef = useRef<HTMLDivElement>(null);

  const elems = useTypedSelector((state) => state.elems.elems);
  const pressedKeys = useTypedSelector((state) => state.common.pressedKeys);
  const selectedElemsIds = useTypedSelector(
    (state) => state.elems.selectedElemsIds,
  );

  const styles = useMemo(() => {
    const elem = CollectionService.findElemById(elems, id);

    if (!elem) return {} as React.CSSProperties;

    setElemSize({
      width: Math.round(parseInt(String(elem.styles.width))),
      height: Math.round(parseInt(String(elem.styles.height))),
    });

    if (elem.isHidden) {
      return { ...elem.styles, display: 'none' };
    }

    setIsBlocked(elem.isBlocked);

    return elem.styles;
  }, [elems, id]);

  const { isDragAndDropAction } = useShapeDragAndDrop(
    id,
    elemRef,
    elems,
    pressedKeys,
    dispatch,
  );

  const { isSelected } = useShapeSelection(
    id,
    elemRef,
    elems,
    pressedKeys,
    selectedElemsIds,
    dispatch,
  );

  const startResizeWidthRightHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.RIGHT_SIDE,
  );

  const startResizeWidthLeftHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.LEFT_SIDE,
  );

  const startResizeHeightTopHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.TOP_SIDE,
  );

  const startResizeHeightBottomHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.BOTTOM_SIDE,
  );

  const bottomRightCornerHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.BOTTOM_RIGHT_CORNER,
  );

  const bottomLeftCornerHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.BOTTOM_LEFT_CORNER,
  );

  const topRightCornerHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.TOP_RIGHT_CORNER,
  );

  const topLeftCornerHandler = useResizeHandler(
    id,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.TOP_LEFT_CORNER,
  );

  const rotateHandler = useRotateHandler(id, rotatedElemRef, pressedKeys);

  const changeRadiusHandler = useChangeBorderRadius(
    id,
    rotatedElemRef,
    pressedKeys,
  );

  useEffect(() => {
    const domElem = elemRef.current;

    if (domElem) {
      const actionWhenCursorOverElem = (): void => {
        setIsHiddenHandlersVisible(true);
      };
      const actionWhenCursorLeaveElem = (): void => {
        setIsHiddenHandlersVisible(false);
      };

      const removeListeners = (): void => {
        domElem.removeEventListener('mouseenter', actionWhenCursorOverElem);
        domElem.removeEventListener('mouseleave', actionWhenCursorLeaveElem);
      };

      domElem.addEventListener('mouseenter', actionWhenCursorOverElem);
      domElem.addEventListener('mouseleave', actionWhenCursorLeaveElem);

      return () => removeListeners();
    }
  }, [elemRef]);

  const isSelectionWrapperVisible =
    isSelected && selectedElemsIds.length <= 1 && !isDragAndDropAction;

  return {
    styles,
    isBlocked,
    elemRef,
    elemSize,
    rotatedElemRef,
    resizeHandlers: {
      top: startResizeHeightTopHandler,
      right: startResizeWidthRightHandler,
      bottom: startResizeHeightBottomHandler,
      left: startResizeWidthLeftHandler,
      topRight: topRightCornerHandler,
      bottomRight: bottomRightCornerHandler,
      bottomLeft: bottomLeftCornerHandler,
      topLeft: topLeftCornerHandler,
    },
    rotateHandler,
    changeRadiusHandler,
    isHiddenHandlersVisible,
    isSelectionWrapperVisible,
  };
}
