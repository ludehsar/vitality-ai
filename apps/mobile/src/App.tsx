import './styles/global.css';

import { Amplify } from 'aws-amplify';

import outputs from '../amplify_outputs.json';
import Providers from './providers';
import { RootNavigation } from './navigations/RootStack';
import {
  Authenticator,
  AuthenticatorProps,
} from '@aws-amplify/ui-react-native';
import {
  ConfirmResetPasswordScreen,
  ConfirmSignInScreen,
  ConfirmSignUpScreen,
  ConfirmVerifyUserScreen,
  ForceNewPasswordScreen,
  ResetPasswordScreen,
  SelectMfaTypeScreen,
  SetupEmailScreen,
  SetupTotpScreen,
  SignInScreen,
  SignUpScreen,
  VerifyUserScreen,
} from './features/auth/screens';

Amplify.configure(outputs);

const AuthenticatorComponents: AuthenticatorProps['components'] = {
  ConfirmResetPassword: ConfirmResetPasswordScreen,
  ConfirmSignIn: ConfirmSignInScreen,
  ConfirmSignUp: ConfirmSignUpScreen,
  ConfirmVerifyUser: ConfirmVerifyUserScreen,
  ForceNewPassword: ForceNewPasswordScreen,
  ForgotPassword: ResetPasswordScreen,
  SelectMfaType: SelectMfaTypeScreen,
  SetupEmail: SetupEmailScreen,
  SetupTotp: SetupTotpScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  VerifyUser: VerifyUserScreen,
};

export const App = () => {
  return (
    <Providers>
      <Authenticator.Provider>
        <Authenticator
          loginMechanisms={['email', 'phone_number']}
          signUpAttributes={[
            'given_name',
            'family_name',
            'email',
            'phone_number',
          ]}
          socialProviders={['google', 'facebook']}
          components={AuthenticatorComponents}
        >
          <RootNavigation />
        </Authenticator>
      </Authenticator.Provider>
    </Providers>
  );
};

export default App;
