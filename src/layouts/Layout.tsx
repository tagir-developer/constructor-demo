import Header from 'modules/Header';
import LayersSidebar from 'modules/LayersSidebar';
import SettingsSidebar from 'modules/SettingsSidebar';
import { FC, PropsWithChildren } from 'react';

interface IProps {
  title: string;
}

const Layout: FC<PropsWithChildren<IProps>> = ({ title, children }) => {
  return (
    <div>
      <Header />

      <main>
        <LayersSidebar />

        <SettingsSidebar />

        {children}
      </main>
    </div>
  );
};

export default Layout;
