import {z} from "zod";

export const verfiyCodeValidation = z.object({
    code: z.string().length(6, "Verify Code is must be 6 Characters!")
});