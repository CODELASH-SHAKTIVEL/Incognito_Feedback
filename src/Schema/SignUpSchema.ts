import { z } from "zod";

export const UserNameValidation = z
  .string()
  .min(2, "UserName should be at least 2 characters")
  .max(12, "UserName shouldn't be more than 12 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const SignUpSchema = z.object({
    Username : UserNameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
