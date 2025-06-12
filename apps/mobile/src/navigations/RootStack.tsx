import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ConfirmSignUpScreen,
  ForgotPasswordScreen,
  SignInScreen,
  SignUpScreen,
} from '../screens/auth';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const { authStatus } = useAuthenticator();
  return (
    <Stack.Navigator>
      {authStatus === 'authenticated' ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
