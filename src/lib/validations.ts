import { z } from 'zod'
import { VALIDATION } from '@/lib/constants'

/**
 * Authentication schemas
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(VALIDATION.email.maxLength, `Email must be ${VALIDATION.email.maxLength} characters or less`)
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
    .max(VALIDATION.password.maxLength, `Password must be ${VALIDATION.password.maxLength} characters or less`),
})

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .max(VALIDATION.email.maxLength, `Email must be ${VALIDATION.email.maxLength} characters or less`)
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
      .max(VALIDATION.password.maxLength, `Password must be ${VALIDATION.password.maxLength} characters or less`)
      .regex(
        VALIDATION.password.pattern,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

/**
 * Profile schemas
 */
export const onboardingSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.name.minLength, `Name must be at least ${VALIDATION.name.minLength} characters`)
    .max(VALIDATION.name.maxLength, `Name must be ${VALIDATION.name.maxLength} characters or less`)
    .regex(VALIDATION.name.pattern, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  therapist_tone: z.enum(['supportive', 'analytical', 'gentle'], {
    required_error: 'Please select a therapist tone',
  }),
  theme_preference: z.enum(['dark', 'light', 'system'], {
    required_error: 'Please select a theme preference',
  }),
  typing_speed: z
    .number()
    .min(10, 'Typing speed must be at least 10')
    .max(100, 'Typing speed must be at most 100')
    .default(50),
})

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.name.minLength, `Name must be at least ${VALIDATION.name.minLength} characters`)
    .max(VALIDATION.name.maxLength, `Name must be ${VALIDATION.name.maxLength} characters or less`)
    .regex(VALIDATION.name.pattern, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  therapist_tone: z.enum(['supportive', 'analytical', 'gentle']).optional(),
  theme_preference: z.enum(['dark', 'light', 'system']).optional(),
  typing_speed: z
    .number()
    .min(10, 'Typing speed must be at least 10')
    .max(100, 'Typing speed must be at most 100')
    .optional(),
})

/**
 * Chat schemas
 */
export const messageSchema = z.object({
  content: z
    .string()
    .min(VALIDATION.message.minLength, 'Message cannot be empty')
    .max(VALIDATION.message.maxLength, `Message must be ${VALIDATION.message.maxLength} characters or less`)
    .transform((str) => str.trim()),
})

export const chatTitleSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.chatTitle.minLength, 'Title cannot be empty')
    .max(VALIDATION.chatTitle.maxLength, `Title must be ${VALIDATION.chatTitle.maxLength} characters or less`)
    .transform((str) => str.trim()),
})

/**
 * Settings schemas
 */
export const settingsSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
  typingSpeed: z
    .number()
    .min(10, 'Typing speed must be at least 10')
    .max(100, 'Typing speed must be at most 100'),
})

/**
 * Utility function to validate data against a schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  errors: Record<string, string[]>
} {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string[]> = {}
  
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  }
  
  return { success: false, errors }
}

/**
 * Type exports for form data
 */
export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type MessageFormData = z.infer<typeof messageSchema>
export type ChatTitleFormData = z.infer<typeof chatTitleSchema>
export type SettingsFormData = z.infer<typeof settingsSchema> 