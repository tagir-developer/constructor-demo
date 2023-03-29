import { AnyAction } from '@reduxjs/toolkit';
import { getLayerNameByElemType } from 'common/helpers';
import { ElemTypes, IElement } from 'common/interfaces';
import Shape from 'components/Shape';
import { CSSProperties, Dispatch } from 'react';
import { addNewElem } from 'store/reducers/elems.slice';
import { v4 } from 'uuid';

import { IAddElemCardItem } from './AddBasicComponent.interfaces';

class AddElemService {
  constructor(
    readonly dispatch: Dispatch<AnyAction>,
    readonly setIsAddElemMenuOpen: React.Dispatch<
      React.SetStateAction<boolean>
    >,
  ) {}

  addShape = (): void => {
    const elemId = v4();

    const shapeDefaultStyles: CSSProperties = {
      width: 200,
      height: 200,
      background: '#629e62',
      position: 'absolute',
      top: document.documentElement.scrollHeight / 2 - 100,
      left: document.documentElement.scrollWidth / 2 - 100,
    };

    const newElem: IElement = {
      id: elemId,
      elem: <Shape id={elemId} />,
      styles: shapeDefaultStyles,
      elemType: ElemTypes.BLOCK,
      children: null,
      groupId: null,
      layerName: getLayerNameByElemType(ElemTypes.BLOCK),
      isHidden: false,
      isBlocked: false,
    };

    this.dispatch(addNewElem(newElem));
    this.setIsAddElemMenuOpen(false);
  };
}

export const getAddElemCardItems = (
  dispatch: Dispatch<AnyAction>,
  setIsAddElemMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
): IAddElemCardItem[] => {
  const handlers = new AddElemService(dispatch, setIsAddElemMenuOpen);

  return [
    {
      title: 'Текст',
      iconType: 'icon-add-text',
      onClick: handlers.addShape,
    },
    {
      title: 'Фигура',
      iconType: 'icon-new-add-shape',
      onClick: handlers.addShape,
    },
    {
      title: 'Картинка',
      iconType: 'icon-add-image',
      onClick: handlers.addShape,
    },
    {
      title: 'Видео',
      iconType: 'icon-add-video',
      onClick: handlers.addShape,
    },
    {
      title: 'Кнопка',
      iconType: 'icon-add-button',
      onClick: handlers.addShape,
    },
    {
      title: 'Форма',
      iconType: 'icon-add-form',
      onClick: handlers.addShape,
    },
    {
      title: 'Галерея',
      iconType: 'icon-add-gallery',
      onClick: handlers.addShape,
    },
  ];
};
