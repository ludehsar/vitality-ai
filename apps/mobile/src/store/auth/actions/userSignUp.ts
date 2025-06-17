import { AuthError, signUp, SignUpInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type SignUpParams = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  UsernameExistsException: 'Email already in use',
  UserNotConfirmedException: 'User is not confirmed',
  UserNotFoundException: 'User not found',
  NotAuthorizedException: 'Invalid email or password',
};

export const userSignUp =
  (params: SignUpParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      if (params.password !== params.confirmPassword) {
        dispatch(authSlice.actions.setError('Passwords do not match'));
        dispatch(authSlice.actions.setLoading(false));
        return;
      }
      const requestInput: SignUpInput = {
        username: params.email,
        password: params.password,
        options: {
          userAttributes: {
            email: params.email,
            family_name: params.lastName,
            given_name: params.firstName,
            phone_number: params.phoneNumber,
          },
        },
      };
      const response = await signUp(requestInput);
      dispatch(
        authSlice.actions.setCurrentStep(
          response.nextStep?.signUpStep || 'signUp'
        )
      );
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('signUp'));
      console.error('Error signing up', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
