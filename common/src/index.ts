import z from "zod";

export const signupInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().optional(),
});

export const signinInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const createPostInputSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export const updatePostInputSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
});

export type SignupInputType = z.infer<typeof signupInputSchema>;
export type SigninInputType = z.infer<typeof signinInputSchema>;
export type CreatePostInputType = z.infer<typeof createPostInputSchema>;
export type UpdatePostInputType = z.infer<typeof updatePostInputSchema>;
