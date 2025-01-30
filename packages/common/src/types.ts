import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(80),
  firstName: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30)
})
