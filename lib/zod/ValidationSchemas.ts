import {
  array,
  literal,
  object, 
  string 
} from "zod"
 
export const logInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
})

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const updatePasswordSchema = object({
  currentPassword: string({ required_error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: string({ required_error: "New password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
})

export const deleteUserSchema = object({
  password: string({ required_error: "Current password is required" })
    .min(1, "Current password is required")
})

export const updateUserDataSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Invalid email")
    .min(1)
    .max(50),
  username: string({ required_error: "Username is required" })
    .min(1)
    .max(50),
  bio: string()
    .trim()
    .max(400)
    .optional(),
  avatar: string()
    .trim()
    .url("Invalid url")
    .or(literal("")) 
    .optional()
})

export const socialSchema = object({
  label: string({ required_error: "Label is required" })
    .min(1, "Label is required")
    .max(50),
  tag: string({ required_error: "Tag is required" })
    .min(1, "Tag is required")
    .max(50),
  url: string({ required_error: "Url is required" })
    .min(1, "Url is required")
    .max(50)
    .url()
})

export const socialsArraySchema = object({ socials: array(socialSchema), });