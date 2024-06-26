import z from 'zod';

export const signUpSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Not a valid email'),
  password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long.'),
});
