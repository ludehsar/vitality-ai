import {
  AuthError,
  updatePassword,
  UpdatePasswordInput,
} from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type UpdatePasswordParams = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  NotAuthorizedException: 'Invalid password',
};

export const userUpdatePassword =
  (params: UpdatePasswordParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      if (params.newPassword !== params.confirmNewPassword) {
        dispatch(authSlice.actions.setError('Passwords do not match'));
        dispatch(authSlice.actions.setLoading(false));
        return;
      }
      const requestData: UpdatePasswordInput = {
        oldPassword: params.oldPassword,
        newPassword: params.newPassword,
      };
      await updatePassword(requestData);
      dispatch(authSlice.actions.setCurrentStep('authenticated'));
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('forceNewPassword'));
      console.error('Error updating password', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
