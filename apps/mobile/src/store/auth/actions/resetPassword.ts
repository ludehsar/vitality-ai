import { AuthError, resetPassword, ResetPasswordInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type ResetPasswordParams = {
  email: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  UserNotFoundException: 'User not found',
  NotAuthorizedException: 'Not authorized',
};

export const userResetPassword =
  (params: ResetPasswordParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestInput: ResetPasswordInput = {
        username: params.email,
      };
      const response = await resetPassword(requestInput);
      dispatch(
        authSlice.actions.setCurrentStep(
          response.nextStep?.resetPasswordStep || 'resetPassword'
        )
      );
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('resetPassword'));
      console.error('Error resetting password', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
