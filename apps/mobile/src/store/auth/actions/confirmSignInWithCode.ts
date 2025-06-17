import { AuthError, confirmSignIn, ConfirmSignInInput } from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type ConfirmSignInWithCodeParams = {
  code: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  CodeMismatchException: 'Invalid code',
  ExpiredCodeException: 'Code expired',
  LimitExceededException: 'Code limit exceeded',
};

export const userConfirmSignInWithCode =
  (params: ConfirmSignInWithCodeParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      const requestData: ConfirmSignInInput = {
        challengeResponse: params.code,
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
        authSlice.actions.setCurrentStep('CONFIRM_SIGN_IN_WITH_SMS_CODE')
      );
      console.error('Error confirming sign in with code', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
