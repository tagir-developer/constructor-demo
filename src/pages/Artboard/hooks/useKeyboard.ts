import { KeyCodeTypes } from 'common/interfaces';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  IStateHistory,
  addPressedKeys,
  deletePressedKeys,
  redoAction,
  undoAction,
} from 'store/reducers/common.slice';
import {
  addElemsFromBuffer,
  bringSelectedElemsToFront,
  deleteSelectedElems,
  groupElemsByIds,
  lockSelectedElems,
  moveSelectedElemsDown,
  moveSelectedElemsOnKeyDown,
  moveSelectedElemsUp,
  sendSelectedElemsToBack,
  setElemsToBufferByIds,
  ungroupElemsByIds,
  unlockSelectedElems,
} from 'store/reducers/elems.slice';
import {
  deleteGuidesByIds,
  lockSelectedGuides,
  unlockSelectedGuides,
} from 'store/reducers/guides.slice';

export default function useKeyboard(): void {
  const history = useTypedSelector((state) => state.common.history);
  const pressedKeys = useTypedSelector((state) => state.common.pressedKeys);
  const needToGroupAgainCollection = useTypedSelector(
    (state) => state.elems.needToGroupAgainCollection,
  );
  const selectedElemsIds = useTypedSelector(
    (state) => state.elems.selectedElemsIds,
  );
  const selectedGuidesIds = useTypedSelector(
    (state) => state.guides.selectedGuidesIds,
  );

  const dispatch = useDispatch();

  // смещение холста с нажатым пробелом
  useEffect(() => {
    const offsetCanvasOnDrag = (event: MouseEvent): void => {
      if (pressedKeys.includes(KeyCodeTypes.SPACE)) {
        const startPointX = event.pageX;
        const startPointY = event.pageY;

        const offsetCanvasBy = (offsetX: number, offsetY: number): void => {
          window.scrollBy(offsetX, offsetY);
        };

        const onMouseMove = (event: MouseEvent): void => {
          offsetCanvasBy(startPointX - event.pageX, startPointY - event.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);
        };
      }
    };

    document.addEventListener('mousedown', offsetCanvasOnDrag);

    return () => document.removeEventListener('mousedown', offsetCanvasOnDrag);
  }, [pressedKeys]);

  // отслеживаем нажатие клавиш
  useEffect(() => {
    const spyOnPressedKey = (event: KeyboardEvent): void => {
      event.preventDefault();

      const elem = event.target as HTMLElement;

      if (event.code === KeyCodeTypes.SPACE && elem.tagName !== 'INPUT') {
        event.preventDefault();
      }

      if (event.code === KeyCodeTypes.DELETE) {
        if (selectedElemsIds.length) {
          dispatch(deleteSelectedElems(selectedElemsIds));
        }

        if (selectedGuidesIds.length) {
          dispatch(deleteGuidesByIds(selectedGuidesIds));
        }
      }

      if (event.code === KeyCodeTypes.KEY_L) {
        if (selectedElemsIds.length) {
          dispatch(lockSelectedElems());
        }

        if (selectedGuidesIds.length) {
          dispatch(lockSelectedGuides());
        }
      }

      if (event.code === KeyCodeTypes.KEY_U) {
        if (selectedElemsIds.length) {
          dispatch(unlockSelectedElems());
        }

        if (selectedGuidesIds.length) {
          dispatch(unlockSelectedGuides());
        }
      }

      if (!event.repeat) {
        dispatch(addPressedKeys(event.code));

        if (event.code === KeyCodeTypes.SPACE) {
          document.body.style.cursor = 'grab';
        }
      }

      if (
        event.code === KeyCodeTypes.KEY_C &&
        (event.ctrlKey || event.metaKey)
      ) {
        dispatch(setElemsToBufferByIds(selectedElemsIds));
      }

      if (
        event.code === KeyCodeTypes.KEY_V &&
        (event.ctrlKey || event.metaKey)
      ) {
        dispatch(addElemsFromBuffer());
      }

      if (event.code === KeyCodeTypes.KEY_Z) {
        if (!event.shiftKey && history.before.length > 1) {
          dispatch(undoAction());
        }

        if (event.shiftKey) {
          dispatch(redoAction());
        }
      }

      if (
        event.code === KeyCodeTypes.ARROW_TOP ||
        event.code === KeyCodeTypes.ARROW_RIGHT ||
        event.code === KeyCodeTypes.ARROW_BOTTOM ||
        event.code === KeyCodeTypes.ARROW_LEFT
      ) {
        dispatch(
          moveSelectedElemsOnKeyDown({
            direction:
              event.code === KeyCodeTypes.ARROW_TOP
                ? 'top'
                : event.code === KeyCodeTypes.ARROW_RIGHT
                ? 'right'
                : event.code === KeyCodeTypes.ARROW_BOTTOM
                ? 'bottom'
                : 'left',
            withShiftKey: event.shiftKey,
          }),
        );
      }

      if (
        event.code === KeyCodeTypes.KEY_G &&
        (event.ctrlKey || event.metaKey) &&
        needToGroupAgainCollection.length === 0
      ) {
        if (event.shiftKey) {
          dispatch(ungroupElemsByIds(selectedElemsIds));
        } else if (selectedElemsIds.length > 1) {
          dispatch(groupElemsByIds(selectedElemsIds));
        }
      }

      if (
        event.code === KeyCodeTypes.BRACKET_LEFT &&
        (event.ctrlKey || event.metaKey) &&
        selectedElemsIds.length
      ) {
        if (event.shiftKey) {
          dispatch(sendSelectedElemsToBack(selectedElemsIds));
        } else {
          dispatch(moveSelectedElemsDown(selectedElemsIds));
        }
      }

      if (
        event.code === KeyCodeTypes.BRACKET_RIGHT &&
        (event.ctrlKey || event.metaKey) &&
        selectedElemsIds.length
      ) {
        if (event.shiftKey) {
          dispatch(bringSelectedElemsToFront(selectedElemsIds));
        } else {
          dispatch(moveSelectedElemsUp(selectedElemsIds));
        }
      }
    };

    const spyOnUnpressedKey = (event: KeyboardEvent): void => {
      event.preventDefault();
      dispatch(deletePressedKeys(event.code));

      if (event.code === KeyCodeTypes.SPACE) {
        document.body.style.cursor = 'inherit';
      }
    };

    document.addEventListener('keydown', spyOnPressedKey);
    document.addEventListener('keyup', spyOnUnpressedKey);
    return () => {
      document.removeEventListener('keydown', spyOnPressedKey);
      document.removeEventListener('keyup', spyOnUnpressedKey);
    };
  }, [
    pressedKeys,
    dispatch,
    selectedElemsIds,
    needToGroupAgainCollection,
    selectedGuidesIds,
    history,
  ]);
}
