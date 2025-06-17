import { AuthError, confirmSignIn, ConfirmSignInInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type SelectMfaTypeParams = {
  mfaType: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  NotAuthorizedException: 'Not authorized',
  InvalidParameterException: 'Invalid MFA type',
};

export const userSelectMfaType =
  (params: SelectMfaTypeParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestData: ConfirmSignInInput = {
        challengeResponse: params.mfaType,
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
      dispatch(authSlice.actions.setCurrentStep('mfa'));
      console.error('Error selecting MFA type', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
