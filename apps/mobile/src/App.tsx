import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { RootStack } from './navigations/RootStack';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';

import './styles/global.css';

import outputs from '../amplify_outputs.json';
import { Button, ButtonGroup, ButtonText } from './components/ui/button';

Amplify.configure(outputs);

const Navigation = createStaticNavigation(RootStack);

export const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator
        Footer={() => (
          <ButtonGroup>
            <Button variant="solid" action="primary">
              <ButtonText>Sign Out</ButtonText>
            </Button>
          </ButtonGroup>
        )}
      >
        <GluestackUIProvider>
          <Navigation />
        </GluestackUIProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
