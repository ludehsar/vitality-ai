import {
  AuthError,
  confirmResetPassword,
  ConfirmResetPasswordInput,
} from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type ConfirmResetPasswordParams = {
  username: string;
  code: string;
  newPassword: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  InvalidParameterException: 'Invalid code',
  ExpiredCodeException: 'Code expired',
};

export const userConfirmResetPassword =
  (params: ConfirmResetPasswordParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestData: ConfirmResetPasswordInput = {
        username: params.username,
        confirmationCode: params.code,
        newPassword: params.newPassword,
      };
      await confirmResetPassword(requestData);
      dispatch(authSlice.actions.setCurrentStep('signIn'));
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('resetPassword'));
      console.error('Error confirming reset password', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
