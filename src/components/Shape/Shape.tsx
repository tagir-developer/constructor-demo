import classNames from 'classnames';
import { FC } from 'react';

import elemStyles from './Shape.module.scss';
import useShapeEventHandlers from './hooks/useShapeEventHandlers';

interface IProps {
  id: string;
}

const Shape: FC<IProps> = ({ id }) => {
  const {
    styles,
    isBlocked,
    elemRef,
    rotatedElemRef,
    elemSize,
    resizeHandlers,
    rotateHandler,
    changeRadiusHandler,
    isHiddenHandlersVisible,
    isSelectionWrapperVisible,
  } = useShapeEventHandlers(id);

  if (isSelectionWrapperVisible)
    return (
      <div
        style={{
          ...styles,
          background: 'none',
          transform: 'none',
        }}
        ref={elemRef}
      >
        <div className={elemStyles.wrapper} data-drag-target>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: styles.background,
              transform: styles.transform,
              borderRadius: styles.borderRadius,
              zIndex: 0,
            }}
            ref={rotatedElemRef}
          ></div>

          <div
            className={elemStyles.border}
            data-drag-target
            data-selected-shape
          />

          {!isBlocked && (
            <>
              <div
                className={elemStyles['top-side']}
                onMouseDown={resizeHandlers.top}
              />
              <div
                className={elemStyles['right-side']}
                onMouseDown={resizeHandlers.right}
              />
              <div
                className={elemStyles['bottom-side']}
                onMouseDown={resizeHandlers.bottom}
              />
              <div
                className={elemStyles['left-side']}
                onMouseDown={resizeHandlers.left}
              />

              <div
                className={elemStyles['top-left']}
                onMouseDown={resizeHandlers.topLeft}
              />
              <div
                className={elemStyles['top-right']}
                onMouseDown={resizeHandlers.topRight}
              />
              <div
                className={elemStyles['bottom-right']}
                onMouseDown={resizeHandlers.bottomRight}
              />
              <div
                className={elemStyles['bottom-left']}
                onMouseDown={resizeHandlers.bottomLeft}
              />

              <div
                className={elemStyles['rotate-top-left']}
                onMouseDown={rotateHandler}
              />
              <div
                className={elemStyles['rotate-top-right']}
                onMouseDown={rotateHandler}
              />
              <div
                className={elemStyles['rotate-bottom-right']}
                onMouseDown={rotateHandler}
              />
              <div
                className={elemStyles['rotate-bottom-left']}
                onMouseDown={rotateHandler}
              />

              <div
                className={classNames(elemStyles['border-radius-top-left'], {
                  [elemStyles['hidden']]: !isHiddenHandlersVisible,
                })}
                onMouseDown={changeRadiusHandler}
              />
              <div
                className={classNames(elemStyles['border-radius-top-right'], {
                  [elemStyles['hidden']]: !isHiddenHandlersVisible,
                })}
                onMouseDown={changeRadiusHandler}
              />
              <div
                className={classNames(
                  elemStyles['border-radius-bottom-right'],
                  {
                    [elemStyles['hidden']]: !isHiddenHandlersVisible,
                  },
                )}
                onMouseDown={changeRadiusHandler}
              />
              <div
                className={classNames(elemStyles['border-radius-bottom-left'], {
                  [elemStyles['hidden']]: !isHiddenHandlersVisible,
                })}
                onMouseDown={changeRadiusHandler}
              />
            </>
          )}

          <div className={elemStyles['size-wrapper']}>
            <div className={elemStyles['size-options']}>
              <span>{elemSize.width + ' x ' + elemSize.height}</span>
            </div>
          </div>
        </div>
      </div>
    );

  return <div style={styles} ref={elemRef}></div>;
};

export default Shape;
