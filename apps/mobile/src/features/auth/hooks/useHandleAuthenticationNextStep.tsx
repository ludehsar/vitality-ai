import { useDispatch } from 'react-redux';
import { authSlice } from '../../../store/auth/authSlice';
import type {
  SignInOutput,
  SignUpOutput,
  ResetPasswordOutput,
} from 'aws-amplify/auth';

export const useHandleAuthenticationNextStep = () => {
  const dispatch = useDispatch();

  const handleSignInNextStep = async (nextStep: SignInOutput['nextStep']) => {
    switch (nextStep.signInStep) {
      case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
        dispatch(
          authSlice.actions.setCurrentStep('CONFIRM_SIGN_IN_WITH_SMS_CODE')
        );
        dispatch(
          authSlice.actions.setCodeDeliveryDetails(nextStep.codeDeliveryDetails)
        );
        break;
      case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
        dispatch(
          authSlice.actions.setCurrentStep(
            'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
          )
        );
        break;
      case 'DONE':
        dispatch(authSlice.actions.setCurrentStep('authenticated'));
        break;
      default:
        dispatch(authSlice.actions.setCurrentStep('signIn'));
        break;
    }
  };

  const handleSignUpNextStep = async (nextStep: SignUpOutput['nextStep']) => {
    dispatch(authSlice.actions.setCurrentStep(nextStep.signUpStep || 'signUp'));
  };

  const handleResetPasswordNextStep = async (
    nextStep: ResetPasswordOutput['nextStep']
  ) => {
    dispatch(
      authSlice.actions.setCurrentStep(
        nextStep.resetPasswordStep || 'resetPassword'
      )
    );
  };

  return {
    handleSignInNextStep,
    handleSignUpNextStep,
    handleResetPasswordNextStep,
  };
};
