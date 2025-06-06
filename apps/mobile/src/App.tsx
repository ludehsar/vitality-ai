import { createStaticNavigation } from '@react-navigation/native';
import { RootStack } from './navigations/RootStack';

const Navigation = createStaticNavigation(RootStack);

export const App = () => {
  return <Navigation />;
};

export default App;
