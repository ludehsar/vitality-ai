import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <GluestackUIProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </GluestackUIProvider>
  );
};

export default Providers;
