import { ElemTypes } from 'common/interfaces';
import Guide from 'components/Guide';
import { useTypedSelector } from 'hooks/useTypedSelector';
import Layout from 'layouts/Layout';
import MultiSelectShape from 'pages/Artboard/MultiSelectShape';
import React, {
  CSSProperties,
  FC,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import AdaptabilityBar from './AdaptabilityBar';
import styles from './Artboard.module.scss';
import useArtboard from './hooks/useArtboard';
import useCanvas from './hooks/useCanvas';
import useKeyboard from './hooks/useKeyboard';
import useSelectArea from './hooks/useSelectArea';

const Artboard: FC = () => {
  const artboardProps = useTypedSelector((state) => state.common.artboardProps);
  const canvasHeight = useTypedSelector((state) => state.common.canvasHeight);

  const {
    contentLoaded,
    canvasRef,
    elems,
    guides,
    isGuidesVisible,
    addNewBreakpoint,
  } = useCanvas();

  // TODO: потом можно переместить внутрь useCanvas
  useKeyboard();

  useSelectArea(canvasRef);

  const {
    artboardRef,
    resizeArtboardWidthHandler,
    resizeArtboardHeightHandler,
  } = useArtboard();

  const artboardTopValue = useRef<null | number>(null);

  const initialArtboardStyles = useMemo((): CSSProperties => {
    if (!contentLoaded) return { display: 'none' };

    const topValue =
      document.documentElement.scrollHeight / 2 - artboardProps.height / 2;

    if (!artboardTopValue.current) {
      artboardTopValue.current = topValue;
    }

    return {
      width: artboardProps.width,
      height: artboardProps.height,
      left: document.documentElement.scrollWidth / 2 - artboardProps.width / 2,
      top: artboardTopValue?.current ?? topValue,
    };
  }, [artboardProps, contentLoaded, artboardTopValue]);

  return (
    <Layout title="reports">
      <div className={styles['scroll-container']}>
        <div
          style={{ minHeight: canvasHeight }}
          className={styles.canvas}
          ref={canvasRef}
        >
          <div
            style={initialArtboardStyles}
            className={styles.artboard}
            ref={artboardRef}
            data-select-area-target
          >
            <div
              className={styles['relative-container']}
              data-select-area-target
            >
              <AdaptabilityBar
                width={artboardProps.width}
                addNewBreakpoint={addNewBreakpoint}
              />

              <div
                style={{ ...artboardProps.paddings }}
                className={styles['content-wrapper']}
                data-select-area-target
              >
                <div
                  className={styles['content']}
                  data-select-area-target
                ></div>
              </div>

              <div
                className={styles['screen-resize-handler']}
                onMouseDown={resizeArtboardWidthHandler}
              />

              <div
                className={styles['resize-artboard-height-handler']}
                onMouseDown={resizeArtboardHeightHandler}
              />
            </div>
          </div>

          {contentLoaded &&
            elems.map((item, index) => {
              if (item.elemType === ElemTypes.GROUP) {
                return (
                  <item.elem.type key={item.id} {...item.elem.props}>
                    {item.children
                      ? item.children.map((elem) => {
                          return (
                            <elem.elem.type
                              key={elem.id}
                              {...elem.elem.props}
                            />
                          );
                        })
                      : null}
                  </item.elem.type>
                );
              }

              return <item.elem.type key={item.id} {...item.elem.props} />;
            })}

          <MultiSelectShape />

          {isGuidesVisible &&
            guides.map((guide) => {
              return <Guide key={guide.id} guideData={guide} />;
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Artboard;
