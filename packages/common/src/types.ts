import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string({ message: "username should be string." })
    .min(3, { message: "username should at least 3 chars long." })
    .max(50, { message: "username should at most 50 chars long." })
    .optional(),
  email: z
    .string({ message: "email should be string." })
    .email({ message: "user@example.com" }),
  password: z
    .string({ message: "password should be string." })
    .min(6, { message: "password should at least 6 chars long." })
    .max(15, { message: "password should at most 80 chars long." }),
  firstName: z
    .string({ message: "firstName should be string." })
    .min(3, { message: "firstName should at least 3 chars long." })
    .max(30, { message: "firstName should at most 30 chars long." }),
  lastName: z
    .string({ message: "lastName should be string." })
    .min(3, { message: "lastName should at least 3 chars long." })
    .max(30, { message: "lastName should at most 30 chars long." }),
  avatar: z.string({ message: "avatar should be aws bucket url." }).optional(),
});

export const userLoginSchema = z
  .object({
    username: z
      .string({ message: "username must be string." })
      .min(3, { message: "username should at least 3 chars long." })
      .max(50, { message: "username should at most 50 chars long." })
      .optional(),
    email: z
      .string({ message: "email must be string" })
      .email({ message: "user@example.com" })
      .optional(),
    password: z
      .string({ message: "password should be string" })
      .min(6, { message: "password should at least 6 chars long." })
      .max(15, { message: "username should at most 15 chars long." }),
  })
  .refine((data) => data.username || data.email, {
    message: "username or email must be provided to login.",
    path: ["username", "email"],
  });

export const createRoomSchema = z.object({
  name: z.string().min(3).max(20),
  slug: z.string().min(3).max(20),
});
