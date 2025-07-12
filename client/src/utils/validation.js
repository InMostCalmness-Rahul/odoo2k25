import { z } from 'zod';

// User registration schema
export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User login schema
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

// Profile update schema
export const profileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  skillsOffered: z.array(z.string())
    .min(1, 'Please add at least one skill you can offer'),
  skillsWanted: z.array(z.string())
    .min(1, 'Please add at least one skill you want to learn'),
  availability: z.array(z.string())
    .min(1, 'Please select your availability'),
  isPublic: z.boolean(),
});

// Swap request schema
export const swapRequestSchema = z.object({
  offeredSkill: z.string()
    .min(1, 'Please select a skill to offer'),
  requestedSkill: z.string()
    .min(1, 'Please select a skill you want to learn'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
});

// Add skill schema
export const addSkillSchema = z.object({
  skill: z.string()
    .min(2, 'Skill must be at least 2 characters')
    .max(50, 'Skill must be less than 50 characters'),
});
