import { ElemTypes, IElement, ISettingPanel } from 'common/interfaces';
import ElemColorSettings from 'components/ElemColorSettings';

import { commonSettingsPanels } from './SettingsPanels.constants';

export const getBlockSettingsPanels = (): ISettingPanel[] => {
  return [
    {
      id: '1',
      title: 'Цвет фона',
      elem: <ElemColorSettings defaultColor="#fff" />,
    },
    {
      id: '2',
      title: 'Еще блок цвета',
      elem: <ElemColorSettings defaultColor="#d31111" />,
    },
  ];
};

export const getTextSettingsPanels = (): ISettingPanel[] => {
  return [
    {
      id: '1',
      title: 'Цвет текста',
      elem: <ElemColorSettings defaultColor="#fff" />,
    },
  ];
};

export const getInitialPanels = (
  selectedElems: IElement[],
): ISettingPanel[] => {
  let panels: ISettingPanel[] = [];

  if (selectedElems.length) {
    const selectedElemsTypes: ElemTypes[] = selectedElems.map(
      (item) => item.elemType,
    );

    if (selectedElemsTypes.includes(ElemTypes.BLOCK)) {
      panels = [...panels, ...getBlockSettingsPanels()];
    }

    if (selectedElemsTypes.includes(ElemTypes.TEXT)) {
      panels = [...panels, ...getTextSettingsPanels()];
    }
  } else {
    panels = [...commonSettingsPanels];
  }

  return panels;
};
