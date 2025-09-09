import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username atleast more than 2 character!")
    .max(20 , "Username should not exceeds 20 characters!")
    .regex(/^(?=.{3,20}$)(?!.*[._-]{2})[a-zA-Z][a-zA-Z0-9._-]*[a-zA-Z0-9]$/
 , "Username should not contains spacial charcaters!")


export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address!"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters!"}),
})