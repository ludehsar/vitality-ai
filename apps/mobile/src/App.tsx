import './styles/global.css';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { RootStack } from './navigations/RootStack';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';

import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const Navigation = createStaticNavigation(RootStack);

export const App = () => {
  return (
    <GluestackUIProvider>
      <Authenticator.Provider>
        <Authenticator>
          <Navigation />
        </Authenticator>
      </Authenticator.Provider>
    </GluestackUIProvider>
  );
};

export default App;
