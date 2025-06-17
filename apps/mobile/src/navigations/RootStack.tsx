import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { HomeScreen } from '../features/home/screen/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ConfirmResetPasswordScreen,
  ConfirmSignInWithCodeScreen,
  ConfirmSignUpScreen,
  SignInScreen,
  SignUpScreen,
  ResetPasswordScreen,
  SetupEmailScreen,
  SelectMfaTypeScreen,
  ConfirmVerifyUserScreen,
  SetupTotpScreen,
  VerifyUserScreen,
  UpdatePasswordScreen,
  ConfirmSignInWithPasswordScreen,
} from '../features/auth/screens';
import { CodeDeliveryDetails } from 'aws-amplify/auth';

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ConfirmSignUp: {
    username: string;
    codeDeliveryDetails: CodeDeliveryDetails;
  };
  ConfirmResetPassword: {
    username: string;
    codeDeliveryDetails: CodeDeliveryDetails;
  };
  ConfirmSignInWithCode: {
    username: string;
    codeDeliveryDetails: CodeDeliveryDetails;
  };
  SelectMfaType: {
    allowedMfaTypes: ('SMS' | 'EMAIL' | 'TOTP')[];
  };
  SetupEmail: undefined;
  SetupTotp: {
    username: string;
  };
  ResetPassword: undefined;
  ConfirmVerifyUser: {
    codeDeliveryDetails: CodeDeliveryDetails;
  };
  VerifyUser: undefined;
  ForceNewPassword: undefined;
  ConfirmSignInWithPassword: {
    challengeName: 'NEW_PASSWORD_REQUIRED' | 'PASSWORD_VERIFIER';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const { authStatus } = useAuthenticator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
          flex: 1,
          justifyContent: 'center',
          padding: 16,
        },
      }}
    >
      {authStatus === 'authenticated' ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ConfirmVerifyUser"
            component={ConfirmVerifyUserScreen}
          />
          <Stack.Screen name="VerifyUser" component={VerifyUserScreen} />
          <Stack.Screen
            name="ForceNewPassword"
            component={UpdatePasswordScreen}
          />
          <Stack.Screen name="SelectMfaType" component={SelectMfaTypeScreen} />
          <Stack.Screen name="SetupEmail" component={SetupEmailScreen} />
          <Stack.Screen name="SetupTotp" component={SetupTotpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
          <Stack.Screen
            name="ConfirmResetPassword"
            component={ConfirmResetPasswordScreen}
          />
          <Stack.Screen
            name="ConfirmSignInWithCode"
            component={ConfirmSignInWithCodeScreen}
          />
          <Stack.Screen
            name="ConfirmSignInWithPassword"
            component={ConfirmSignInWithPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
