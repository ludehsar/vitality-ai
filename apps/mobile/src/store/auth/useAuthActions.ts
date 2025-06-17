import { useMemo } from 'react';

import { useAppDispatch } from '../hooks';
import forgotPassword from './actions/forgotPassword';
import loginViaAccessToken from './actions/loginViaAccessToken';
import type { LoginParams } from './actions/userLogin';
import userLogin from './actions/userLogin';
import { loginSlice } from './authSlice';

const useLoginActions = () => {
  const dispatch = useAppDispatch();
  return useMemo(() => {
    return {
      loginUser: (params: LoginParams) => {
        dispatch(userLogin(params));
      },
      logoutUser: () => {
        dispatch(loginSlice.actions.logoutUser());
      },
      resetPassword: (email: string) => {
        dispatch(forgotPassword({ email }));
      },
      accessTokenLogin: () => {
        dispatch(loginViaAccessToken());
      },
    };
  }, [dispatch]);
};

export default useLoginActions;
