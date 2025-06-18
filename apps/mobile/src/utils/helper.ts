import { KeyboardTypeOptions } from 'react-native';

export const getKeyboardType = (
  type: 'email' | 'phone' | 'password' | 'default'
): KeyboardTypeOptions => {
  switch (type) {
    case 'email':
      return 'email-address';
    case 'phone':
      return 'phone-pad';
    case 'password':
      return 'default';
    default:
      return 'default';
  }
};
