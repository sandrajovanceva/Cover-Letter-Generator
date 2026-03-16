import { z } from "zod";

export const generateRequestSchema = z.object({
  resumeText: z.string().min(50, "Please provide at least a short resume."),
  jobText: z
    .string()
    .min(50, "Please paste a reasonably detailed job description.")
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

