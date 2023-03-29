import { FC } from 'react';

import elemStyles from './MultiSelectShape.module.scss';
import useMultiSelectShape from './hooks/useMultiSelectShape';

const MultiSelectShape: FC = () => {
  const { styles, elemRef, elemSize, resizeHandlers, isBlocked } =
    useMultiSelectShape();

  return (
    <div
      style={styles ?? { display: 'none' }}
      className={elemStyles.main}
      ref={elemRef}
      data-multiselection
    >
      <div className={elemStyles.wrapper} data-multiselection data-draggable>
        {!isBlocked && (
          <>
            <div
              className={elemStyles['top-left']}
              onMouseDown={resizeHandlers.topLeft}
              data-multiselection
            />
            <div
              className={elemStyles['top-right']}
              onMouseDown={resizeHandlers.topRight}
              data-multiselection
            />
            <div
              className={elemStyles['bottom-right']}
              onMouseDown={resizeHandlers.bottomRight}
              data-multiselection
            />
            <div
              className={elemStyles['bottom-left']}
              onMouseDown={resizeHandlers.bottomLeft}
              data-multiselection
            />
            <div
              className={elemStyles['top-side']}
              onMouseDown={resizeHandlers.top}
              data-multiselection
            />
            <div
              className={elemStyles['right-side']}
              onMouseDown={resizeHandlers.right}
              data-multiselection
            />
            <div
              className={elemStyles['bottom-side']}
              onMouseDown={resizeHandlers.bottom}
              data-multiselection
            />
            <div
              className={elemStyles['left-side']}
              onMouseDown={resizeHandlers.left}
              data-multiselection
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
};

export default MultiSelectShape;
