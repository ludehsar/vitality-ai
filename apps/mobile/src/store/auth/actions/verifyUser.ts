import {
  AuthError,
  sendUserAttributeVerificationCode,
  SendUserAttributeVerificationCodeInput,
} from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type VerifyUserParams = {
  unverifiedUserAttribute: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  InvalidParameterException: 'Invalid unverified user attribute',
  NotAuthorizedException: 'Not authorized',
  LimitExceededException: 'Limit exceeded',
};

export const userVerifyUser =
  (params: VerifyUserParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestInput: SendUserAttributeVerificationCodeInput = {
        userAttributeKey: params.unverifiedUserAttribute,
      };
      const response = await sendUserAttributeVerificationCode(requestInput);
      dispatch(authSlice.actions.setCodeDeliveryDetails(response));
      dispatch(authSlice.actions.setCurrentStep('verifyUser'));
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('verifyUser'));
      console.error('Error sending user attribute verification code', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
