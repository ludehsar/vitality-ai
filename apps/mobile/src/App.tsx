import './styles/global.css';

import { Amplify } from 'aws-amplify';
import { RootStack } from './navigations/RootStack';

import outputs from '../amplify_outputs.json';
import Providers from './providers';

Amplify.configure(outputs);

export const App = () => {
  return (
    <Providers>
      <RootStack />
    </Providers>
  );
};

export default App;
