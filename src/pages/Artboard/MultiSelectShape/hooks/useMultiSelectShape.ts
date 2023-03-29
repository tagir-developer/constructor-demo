import {
  IElemSizes,
  IElement,
  IStylesByElemId,
  KeyCodeTypes,
} from 'common/interfaces';
import { ResizeHandlerPositions } from 'hooks/hooks.interfaces';
import useMultiselectResize from 'hooks/useMultiselectResize';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useEffect, useRef, useState } from 'react';
import CollectionService from 'services/CollectionService';
import ElemsService from 'services/ElemsService';
import KeyboardService from 'services/KeyboardService';

import useMultiSelectDragAndDrop from './useMultiSelectDragAndDrop';

export type TypeResizeHandler = (
  event: React.MouseEvent<Element, MouseEvent>,
) => void;

interface IUseEventHandlers {
  elemSize: IElemSizes;
  styles: React.CSSProperties | null;
  elemRef: React.RefObject<HTMLDivElement>;
  isBlocked: boolean;
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
}

export default function useMultiSelectShape(): IUseEventHandlers {
  const [elemSize, setElemSize] = useState<IElemSizes>({
    width: 0,
    height: 0,
  });

  const [selectedElems, setSelectedElems] = useState<IElement[]>([]);

  const [styles, setStyles] = useState<React.CSSProperties | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const selectedElemsIds = useTypedSelector(
    (state) => state.elems.selectedElemsIds,
  );
  const elems = useTypedSelector((state) => state.elems.elems);
  const pressedKeys = useTypedSelector((state) => state.common.pressedKeys);

  const elemRef = useRef<HTMLDivElement>(null);

  useMultiSelectDragAndDrop(
    selectedElemsIds,
    elemRef,
    setStyles,
    pressedKeys,
    isBlocked,
  );

  useEffect(() => {
    if (selectedElemsIds.length > 1) {
      const selectedElems = CollectionService.getAllByIds(
        elems,
        selectedElemsIds,
      );

      const elemsStyles: IStylesByElemId[] = selectedElems.map((elem) => ({
        id: elem.id,
        styles: elem.styles,
      }));

      setSelectedElems(selectedElems);

      const selectedElemsLimitValues =
        ElemsService.getGroupLimitValues(elemsStyles);

      const shapeStyles: React.CSSProperties = {
        ...selectedElemsLimitValues,
      };

      const isBlocked = ElemsService.checkIsBlockElemsSelection(selectedElems);

      setIsBlocked(isBlocked);
      setStyles(shapeStyles);
      setElemSize({
        width: Math.round(selectedElemsLimitValues.width),
        height: Math.round(selectedElemsLimitValues.height),
      });
    } else {
      setStyles(null);
    }
    // eslint-disable-next-line
  }, [selectedElemsIds]);

  useEffect(() => {
    if (selectedElemsIds.length > 1) {
      const selectedElems = CollectionService.getAllByIds(
        elems,
        selectedElemsIds,
      );

      const isBlocked = ElemsService.checkIsBlockElemsSelection(selectedElems);

      setIsBlocked(isBlocked);
      setSelectedElems(selectedElems);

      if (
        KeyboardService.checkIfPressedOneKeyOf(pressedKeys, [
          KeyCodeTypes.ARROW_TOP,
          KeyCodeTypes.ARROW_RIGHT,
          KeyCodeTypes.ARROW_BOTTOM,
          KeyCodeTypes.ARROW_LEFT,
        ])
      ) {
        const elemsStyles: IStylesByElemId[] = selectedElems.map((elem) => ({
          id: elem.id,
          styles: elem.styles,
        }));

        const selectedElemsLimitValues =
          ElemsService.getGroupLimitValues(elemsStyles);

        const shapeStyles: React.CSSProperties = {
          ...selectedElemsLimitValues,
        };

        setStyles(shapeStyles);
      }
    }
    // eslint-disable-next-line
  }, [elems, pressedKeys]);

  const bottomRightResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.BOTTOM_RIGHT_CORNER,
  );

  const topLeftResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.TOP_LEFT_CORNER,
  );

  const bottomLeftResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.BOTTOM_LEFT_CORNER,
  );

  const topRightResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.TOP_RIGHT_CORNER,
  );

  const topSideResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.TOP_SIDE,
  );

  const bottomSideResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.BOTTOM_SIDE,
  );

  const leftSideResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.LEFT_SIDE,
  );

  const rightSideResizeHandler = useMultiselectResize(
    selectedElems,
    elemRef,
    pressedKeys,
    setElemSize,
    ResizeHandlerPositions.RIGHT_SIDE,
  );

  return {
    styles,
    elemRef,
    isBlocked,
    elemSize,
    resizeHandlers: {
      top: topSideResizeHandler,
      right: rightSideResizeHandler,
      bottom: bottomSideResizeHandler,
      left: leftSideResizeHandler,
      topRight: topRightResizeHandler,
      bottomRight: bottomRightResizeHandler,
      bottomLeft: bottomLeftResizeHandler,
      topLeft: topLeftResizeHandler,
    },
  };
}
