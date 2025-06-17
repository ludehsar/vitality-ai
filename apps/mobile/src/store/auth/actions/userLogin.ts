import { AuthError, signIn, SignInInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type LoginParams = {
  email: string;
  password: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  UserNotConfirmedException: 'User is not confirmed',
  UserNotFoundException: 'User not found',
  NotAuthorizedException: 'Invalid email or password',
};

export const userLogin =
  (params: LoginParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestInput: SignInInput = {
        username: params.email,
        password: params.password,
      };
      const response = await signIn(requestInput);
      dispatch(authSlice.actions.setIsAuthenticated(response.isSignedIn));
      dispatch(authSlice.actions.setCurrentStep(response.nextStep));
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('signIn'));
      console.error('Error signing in', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
