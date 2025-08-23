import {z} from "zod";

export const messaageSchemaValidation = z.object({
    content: z
    .string()
    .min(12, {message: "Atleast 12 characters are required to send message!"})
    .max(300 , {message: "Message limit should not exceeds by 300 characters!   "})
}) 