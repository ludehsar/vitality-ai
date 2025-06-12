import './styles/global.css';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  AuthenticatorProps,
} from '@aws-amplify/ui-react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigations/RootStack';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import {
  SignInScreen,
  SignUpScreen,
  ConfirmSignUpScreen,
  ForgotPasswordScreen,
  ConfirmResetPasswordScreen,
} from './screens/auth';

import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const authComponents: AuthenticatorProps['components'] = {
  ConfirmResetPassword: ConfirmResetPasswordScreen,
  // ConfirmSignIn,
  ConfirmSignUp: ConfirmSignUpScreen,
  // ConfirmVerifyUser,
  // ForceNewPassword,
  ForgotPassword: ForgotPasswordScreen,
  // SelectMfaType,
  // SetupEmail,
  // SetupTotp,
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  // VerifyUser,
};

export const App = () => {
  return (
    <GluestackUIProvider>
      <NavigationContainer>
        <Authenticator.Provider>
          <Authenticator components={authComponents}>
            <RootStack />
          </Authenticator>
        </Authenticator.Provider>
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;
