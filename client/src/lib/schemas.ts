import * as z from "zod";

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  role: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
