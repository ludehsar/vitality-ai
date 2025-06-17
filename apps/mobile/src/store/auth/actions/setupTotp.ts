import {
  AuthError,
  setUpTOTP,
  verifyTOTPSetup,
  VerifyTOTPSetupInput,
} from 'aws-amplify/auth';
import type { AppDispatch } from '../../../store';
import { authSlice } from '../authSlice';

export type SetupTotpParams = {
  username: string;
  code: string;
  successCallback?: () => void;
};

const errorMessages: Record<string, string> = {
  InvalidCodeException: 'The code you entered is incorrect. Please try again.',
  ExpiredCodeException: 'The code you entered is expired. Please try again.',
};

export const userSetupTotp =
  (params: SetupTotpParams) => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.setError(undefined));
    try {
      // Step 1: Set up TOTP and get the secret/URI
      const totpSetupDetails = await setUpTOTP();
      // Optionally, store totpSetupDetails in the store if needed
      // Step 2: Verify the TOTP code
      const request: VerifyTOTPSetupInput = {
        code: params.code,
      };
      await verifyTOTPSetup(request);
      dispatch(authSlice.actions.setCurrentStep('authenticated'));
      if (params.successCallback) params.successCallback();
    } catch (error) {
      let message = 'An unknown error occurred. Please try again.';
      if (error instanceof AuthError && error.name in errorMessages) {
        message = errorMessages[error.name];
      }
      dispatch(authSlice.actions.setError(message));
      dispatch(authSlice.actions.setCurrentStep('setupTotp'));
      console.error('Error setting up TOTP', error);
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  };
