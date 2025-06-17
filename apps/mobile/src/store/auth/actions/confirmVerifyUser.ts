import {
  AuthError,
  confirmUserAttribute,
  ConfirmUserAttributeInput,
  VerifiableUserAttributeKey,
} from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type ConfirmVerifyUserParams = {
  userAttributeKey: string;
  code: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  InvalidParameterException: 'Invalid unverified user attribute',
  NotAuthorizedException: 'Not authorized',
  LimitExceededException: 'Limit exceeded',
};

export const userConfirmVerifyUser =
  (params: ConfirmVerifyUserParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestInput: ConfirmUserAttributeInput = {
        userAttributeKey: params.userAttributeKey as VerifiableUserAttributeKey,
        confirmationCode: params.code,
      };
      await confirmUserAttribute(requestInput);
      dispatch(authSlice.actions.setCurrentStep('authenticated'));
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('verifyUser'));
      console.error('Error confirming user attribute verification', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
