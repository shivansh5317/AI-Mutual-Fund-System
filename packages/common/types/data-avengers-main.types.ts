import { z } from 'zod';

const baseUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits long')
    .max(10, 'Phone number must be at most 10 digits long')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Phone number must be in valid E.164 format'),
});

export const signupFormSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
});


export type SignupFormSchemaType = z.infer<typeof signupFormSchema>;