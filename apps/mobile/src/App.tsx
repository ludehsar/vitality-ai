import { createStaticNavigation } from '@react-navigation/native';
import { RootStack } from './navigations/RootStack';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';

import './styles/global.css';

const Navigation = createStaticNavigation(RootStack);

export const App = () => {
  return (
    <GluestackUIProvider>
      <Navigation />
    </GluestackUIProvider>
  );
};

export default App;
