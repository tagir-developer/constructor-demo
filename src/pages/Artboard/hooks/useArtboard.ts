import { ResizeHandlerPositions } from 'hooks/hooks.interfaces';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useRef } from 'react';

import useArtboardResizeHandler from './useArtboardResizeHandler';

interface IUseArtboard {
  artboardRef: React.RefObject<HTMLDivElement>;
  resizeArtboardWidthHandler: (
    event: React.MouseEvent<Element, MouseEvent>,
  ) => void;
  resizeArtboardHeightHandler: (
    event: React.MouseEvent<Element, MouseEvent>,
  ) => void;
}

export default function useArtboard(): IUseArtboard {
  const pressedKeys = useTypedSelector((state) => state.common.pressedKeys);

  const artboardRef = useRef<HTMLDivElement>(null);

  const resizeArtboardWidthHandler = useArtboardResizeHandler(
    artboardRef,
    pressedKeys,
    ResizeHandlerPositions.RIGHT_SIDE,
  );
  const resizeArtboardHeightHandler = useArtboardResizeHandler(
    artboardRef,
    pressedKeys,
    ResizeHandlerPositions.BOTTOM_SIDE,
  );

  return {
    artboardRef,
    resizeArtboardWidthHandler,
    resizeArtboardHeightHandler,
  };
}
