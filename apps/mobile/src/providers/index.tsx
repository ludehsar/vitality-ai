import React from 'react';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <GluestackUIProvider>{children}</GluestackUIProvider>;
};

export default Providers;
