import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email is invalid' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine(
      (val) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          val
        );
      },
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }
    ),
  confirmPassword: z.string({ required_error: 'Confirm password is required' }),
  firstName: z.string({ required_error: 'First name is required' }),
  lastName: z.string({ required_error: 'Last name is required' }),
  phoneNumber: z.string({ required_error: 'Phone number is required' }),
});

export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email is invalid' }),
  password: signUpSchema.shape.password,
});

export const confirmSignUpSchema = z.object({
  code: z.string({ required_error: 'Code is required' }),
});

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'Email is required' }),
});

export const confirmResetPasswordSchema = z.object({
  code: z.string({ required_error: 'Code is required' }),
  newPassword: signUpSchema.shape.password,
  confirmNewPassword: signUpSchema.shape.confirmPassword,
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type ConfirmSignUpSchema = z.infer<typeof confirmSignUpSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ConfirmResetPasswordSchema = z.infer<
  typeof confirmResetPasswordSchema
>;
