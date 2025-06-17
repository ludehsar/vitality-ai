import { AuthError, confirmSignUp, ConfirmSignUpInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type ConfirmSignUpParams = {
  username: string;
  code: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  CodeMismatchException: 'Invalid code',
  ExpiredCodeException: 'Code expired',
  LimitExceededException: 'Code limit exceeded',
  NotAuthorizedException: 'Not authorized',
};

export const userConfirmSignUp =
  (params: ConfirmSignUpParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestData: ConfirmSignUpInput = {
        confirmationCode: params.code,
        username: params.username,
      };
      const response = await confirmSignUp(requestData);
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
      console.error('Error confirming sign up', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
