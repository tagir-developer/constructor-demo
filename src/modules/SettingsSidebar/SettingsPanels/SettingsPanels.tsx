import { Collapse } from 'antd';
import { ISettingPanel } from 'common/interfaces';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { FC, useEffect, useState } from 'react';
import CollectionService from 'services/CollectionService';

import { getInitialPanels } from './SettingsPanels.helpers';
import styles from './SettingsPanels.module.scss';

const { Panel } = Collapse;

const SettingsPanels: FC = () => {
  const selectedElemsIds = useTypedSelector(
    (state) => state.elems.selectedElemsIds,
  );
  const elems = useTypedSelector((state) => state.elems.elems);

  const initialPanels = getInitialPanels([]);

  const [settingsPanels, setSettingsPanels] =
    useState<ISettingPanel[]>(initialPanels);

  const onChangeCollapse = (key: string | string[]): void => {
    console.log(key);
  };

  useEffect(() => {
    const selectedElems = CollectionService.getAllByIds(
      elems,
      selectedElemsIds,
    );

    const settingsPanels = getInitialPanels(selectedElems);
    setSettingsPanels(settingsPanels);
  }, [selectedElemsIds, elems]);

  return (
    <Collapse
      className={styles.collapse}
      defaultActiveKey={['1']}
      onChange={onChangeCollapse}
    >
      {settingsPanels.map((item) => {
        return (
          <Panel header={item.title} key={item.id}>
            {item.elem}
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default SettingsPanels;
