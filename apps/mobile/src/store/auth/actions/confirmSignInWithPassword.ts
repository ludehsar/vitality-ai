import { AuthError, confirmSignIn, ConfirmSignInInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type ConfirmSignInWithPasswordParams = {
  password: string;
  confirmPassword?: string;
  challengeName?: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  PasswordResetRequiredException: 'Password reset required',
  NotAuthorizedException: 'Invalid password',
  UserNotConfirmedException: 'User not confirmed',
  UserNotFoundException: 'User not found',
  LimitExceededException: 'Password limit exceeded',
};

export const userConfirmSignInWithPassword =
  (params: ConfirmSignInWithPasswordParams) =>
  async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      if (
        params.challengeName === 'NEW_PASSWORD_REQUIRED' &&
        params.confirmPassword !== params.password
      ) {
        dispatch(authSlice.actions.setError('Passwords do not match'));
        dispatch(authSlice.actions.setLoading(false));
        return;
      }
      const requestData: ConfirmSignInInput = {
        challengeResponse: params.password,
      };
      const response = await confirmSignIn(requestData);
      dispatch(
        authSlice.actions.setCurrentStep(
          response.nextStep?.signInStep || 'authenticated'
        )
      );
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(
        authSlice.actions.setCurrentStep(
          'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
        )
      );
      console.error('Error confirming sign in with password', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
