import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  SliceSelectors,
} from '@reduxjs/toolkit';
import type { AuthUser, CodeDeliveryDetails } from 'aws-amplify/auth';
import type {
  SignInSchema,
  SignUpSchema,
  ConfirmSignUpSchema,
  ResetPasswordSchema,
  ConfirmResetPasswordSchema,
  ConfirmSignInWithPasswordSchema,
  SelectMfaTypeSchema,
  VerifyUserSchema,
  ForceNewPasswordSchema,
} from '../../features/auth/schema/auth.schema';

export type AuthStep =
  | 'signIn'
  | 'signUp'
  | 'confirmSignUp'
  | 'resetPassword'
  | 'confirmResetPassword'
  | 'mfa'
  | 'verifyUser'
  | 'forceNewPassword'
  | 'authenticated'
  | 'idle';

type AuthState = {
  userData?: AuthUser;
  isAuthenticated: boolean;
  currentStep: AuthStep;
  loading: boolean;
  error?: string;
  signInForm?: Partial<SignInSchema>;
  signUpForm?: Partial<SignUpSchema>;
  confirmSignUpForm?: Partial<ConfirmSignUpSchema>;
  resetPasswordForm?: Partial<ResetPasswordSchema>;
  confirmResetPasswordForm?: Partial<ConfirmResetPasswordSchema>;
  confirmSignInWithPasswordForm?: Partial<ConfirmSignInWithPasswordSchema>;
  selectMfaTypeForm?: Partial<SelectMfaTypeSchema>;
  verifyUserForm?: Partial<VerifyUserSchema>;
  forceNewPasswordForm?: Partial<ForceNewPasswordSchema>;
  codeDeliveryDetails?: CodeDeliveryDetails;
};

const initialState: AuthState = {
  isAuthenticated: false,
  currentStep: 'idle',
  loading: false,
};

export const authSlice = createSlice<
  AuthState,
  SliceCaseReducers<AuthState>,
  'auth',
  SliceSelectors<AuthState>
>({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<AuthUser | undefined>) => {
      state.userData = action.payload;
      state.isAuthenticated = !!action.payload;
      state.currentStep = action.payload ? 'authenticated' : 'signIn';
    },
    setCurrentStep: (state, action: PayloadAction<AuthStep>) => {
      state.currentStep = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    setSignInForm: (state, action: PayloadAction<Partial<SignInSchema>>) => {
      state.signInForm = { ...state.signInForm, ...action.payload };
    },
    setSignUpForm: (state, action: PayloadAction<Partial<SignUpSchema>>) => {
      state.signUpForm = { ...state.signUpForm, ...action.payload };
    },
    setConfirmSignUpForm: (
      state,
      action: PayloadAction<Partial<ConfirmSignUpSchema>>
    ) => {
      state.confirmSignUpForm = {
        ...state.confirmSignUpForm,
        ...action.payload,
      };
    },
    setResetPasswordForm: (
      state,
      action: PayloadAction<Partial<ResetPasswordSchema>>
    ) => {
      state.resetPasswordForm = {
        ...state.resetPasswordForm,
        ...action.payload,
      };
    },
    setConfirmResetPasswordForm: (
      state,
      action: PayloadAction<Partial<ConfirmResetPasswordSchema>>
    ) => {
      state.confirmResetPasswordForm = {
        ...state.confirmResetPasswordForm,
        ...action.payload,
      };
    },
    setConfirmSignInWithPasswordForm: (
      state,
      action: PayloadAction<Partial<ConfirmSignInWithPasswordSchema>>
    ) => {
      state.confirmSignInWithPasswordForm = {
        ...state.confirmSignInWithPasswordForm,
        ...action.payload,
      };
    },
    setSelectMfaTypeForm: (
      state,
      action: PayloadAction<Partial<SelectMfaTypeSchema>>
    ) => {
      state.selectMfaTypeForm = {
        ...state.selectMfaTypeForm,
        ...action.payload,
      };
    },
    setVerifyUserForm: (
      state,
      action: PayloadAction<Partial<VerifyUserSchema>>
    ) => {
      state.verifyUserForm = { ...state.verifyUserForm, ...action.payload };
    },
    setForceNewPasswordForm: (
      state,
      action: PayloadAction<Partial<ForceNewPasswordSchema>>
    ) => {
      state.forceNewPasswordForm = {
        ...state.forceNewPasswordForm,
        ...action.payload,
      };
    },
    setCodeDeliveryDetails: (
      state,
      action: PayloadAction<CodeDeliveryDetails>
    ) => {
      state.codeDeliveryDetails = action.payload;
    },
    logout: () => initialState,
    reset: () => initialState,
  },
});

export default authSlice.reducer;
