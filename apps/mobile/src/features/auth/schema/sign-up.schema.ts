import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z
    .string({ required_error: 'Confirm password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  pendingVerification: z.boolean(),
  code: z.string({ required_error: 'Code is required' }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
