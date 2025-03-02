'use server'
import connectMongoDB from "@/lib/mongo/DBConnection";
import User from "@/lib/mongo/models/User";
import {
  deleteUserSchema,
  signUpSchema, socialSchema, updatePasswordSchema, 
  updateUserDataSchema
} from "@/lib/zod/ValidationSchemas";
import xss from "xss";
import { saltAndHashPassword } from "../functions/auth";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";
import {
  SocialsInterface, UserInterface 
} from "@/app/api/auth/[...nextauth]/next-auth";
import { redirect } from "next/navigation";
import { request } from "@arcjet/next";
import {
  genericValidationAj, 
  emailValidationAj
} from "../../../lib/arcjet/ArcjetRules";
import { authOptions } from "@/lib/nextAuth/AuthOptions";

// PUBLIC
// POST, SIGN UP
export async function createUser(prevState: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { status: 400, message: 'Incorrect formData', timestamp: Date.now() };
  }

  const req = await request()
  const decision = await genericValidationAj.protect(req)

  if (decision.isDenied()) {
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }

  try {
    const formDataObject = Object.fromEntries(formData.entries())
    const parsedFormDataObject = await signUpSchema.parseAsync(formDataObject)

    const sanitizedPassword = xss(parsedFormDataObject.password)
    const sanitizedEmail = xss(parsedFormDataObject.email)
    const sanitizedUsername = xss(parsedFormDataObject.username)

    const decision = await emailValidationAj.protect(req, { email: sanitizedEmail })

    if (decision.isDenied()) {
      return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
    }

    await connectMongoDB()

    const existingUser = await User.findOne({
      $or: [
        { email: sanitizedEmail },
        { username: sanitizedUsername }
      ]
    })
   
    if (existingUser) {
      if (existingUser.email === sanitizedEmail) {
        return { status: 409, message: 'User already exists', timestamp: Date.now() };
      } else if (existingUser.username === sanitizedUsername) {
        return { status: 409, message: 'Username is already taken', timestamp: Date.now() };
      }
    }

    const hashedPassword = await saltAndHashPassword(sanitizedPassword)    
  
    await User.create({
      email: sanitizedEmail,
      username: sanitizedUsername,
      password: hashedPassword,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return { status: 400, message: error.message, timestamp: Date.now() };
    }    
     
    return { status: 500, message: 'Could not signup', timestamp: Date.now() };
  } 

  revalidateTag('getUsersWithPaginationAndFilter')
  redirect('/login')
}

// PRIVATE
// POST, UPDATE USER PASSWORD
export async function updateUserPassword(prevState: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { status: 400, message: 'Incorrect formData', timestamp: Date.now() };
  }

  const req = await request()
  const decision = await genericValidationAj.protect(req)
  
  if (decision.isDenied()) {
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }

  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const formDataObject = Object.fromEntries(formData.entries())
    const parsedFormDataObject = await updatePasswordSchema.parseAsync(formDataObject)

    const sanitizedCurrentPassword = xss(parsedFormDataObject.currentPassword)
    const sanitizedNewPassword = xss(parsedFormDataObject.newPassword)

    await connectMongoDB()
    
    const user = await User.findById(session.user.id).lean<UserInterface | null>();

    if (!user) {
      return { status: 404, message: 'No user found', timestamp: Date.now() };
    }

    if (user._id.toString() !== session.user.id) {      
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() };
    }

    const match = await bcrypt.compare(sanitizedCurrentPassword, user.password);

    if (!match) {
      return { status: 400, message: 'Your current password does not match', timestamp: Date.now() };
    }

    const hashedNewPassword = await bcrypt.hash(sanitizedNewPassword, 10)

    await User.findByIdAndUpdate(session.user.id, { password: hashedNewPassword }, { new: true })

    return { status: 200, message: 'Your password has been successfully updated', timestamp: Date.now() };
  } catch (error) {
    if (error instanceof ZodError) {
      return { status: 400, message: error.message, timestamp: Date.now() };
    }
     
    return { status: 500, message: 'Could not signup', timestamp: Date.now() };
  }
}

// PRIVATE
// POST, UPDATE USER GENERAL DATA
type SanitizedData = {
  email: string;
  username: string;
  bio?: string | null;
  avatar?: string | null;
}

// eslint-disable-next-line complexity
export async function updateUserData(prevState: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { status: 400, message: 'Incorrect formData', timestamp: Date.now() };
  }

  const req = await request()  
  const decision = await genericValidationAj.protect(req)

  if (decision.isDenied()) {
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }

  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const formDataObject = Object.fromEntries(formData.entries())
    const parsedFormDataObject = await updateUserDataSchema.parseAsync(formDataObject)
    
    const decision = await emailValidationAj.protect(req, { email: parsedFormDataObject.email })

    if (decision.isDenied()) {
      return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
    }

    await connectMongoDB()

    // Check if the user exists and if the user trying to edit data is the user that owns that data
    const user = await User.findById(session.user.id).lean<UserInterface | null>();

    if (!user) {
      return { status: 404, message: 'No user found', timestamp: Date.now() };
    }

    if (user._id.toString() !== session.user.id) {      
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() };
    }
    
    const sanitizedData: SanitizedData = {
      email: parsedFormDataObject.email ? xss(parsedFormDataObject.email) : user.email,
      username: parsedFormDataObject.username ? xss(parsedFormDataObject.username) : user.username,
      avatar: parsedFormDataObject.avatar || parsedFormDataObject.avatar === '' ? (parsedFormDataObject.avatar === '' ? null : xss(parsedFormDataObject.avatar)) : user.avatar,
      bio: parsedFormDataObject.bio || parsedFormDataObject.bio === '' ? xss(parsedFormDataObject.bio) : user.bio
    };

    // Check if the entered username and/or email are already taken, those are unique values
    // Exclude the current user from the query by adding the `user.id` to the condition
    const existingUser = await User.findOne({
      $or: [
        { email: sanitizedData.email },
        { username: sanitizedData.username }
      ],
      _id: { $ne: session.user.id }
    });
  
    if (existingUser) {
      if (existingUser.email === sanitizedData.email) {
        return { status: 409, message: 'User already exists', timestamp: Date.now() };
      } else if (existingUser.username === sanitizedData.username) {
        return { status: 409, message: 'Username is already taken', timestamp: Date.now() };
      }
    }
    
    // If the user exists and if the user trying to edit the data owns the data and if the email/username are not already taken, you can update the user data
    await User.updateOne(
      {  _id: session.user.id },
      { $set: sanitizedData }
    );
  } catch (error) {
    return { status: 500, message: 'Could not update field', timestamp: Date.now() } 
  } 

  revalidateTag('getUser')
  revalidateTag('getUsersWithPaginationAndFilter')

  return { status: 200, message: 'User updated', timestamp: Date.now() }
}

// PRIVATE
// POST, UPDATE CURRENT USER SOCIALS
export async function updateUserSocials(prevState: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { status: 400, message: 'Incorrect formData', timestamp: Date.now() };
  }

  const req = await request()  
  const decision = await genericValidationAj.protect(req)

  if (decision.isDenied()) {
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }
  
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    await connectMongoDB()
    const user = await User.findById(session.user.id)

    if (!user) {
      return { status: 404, message: 'User not found', timestamp: Date.now() };
    }

    if (user._id.toString() !== session.user.id) {      
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() };
    }

    user.socials = user.socials.map((social: SocialsInterface) => ({
      label: social.label,
      url: formData.get(`url_${social.label}`) || social.url,
      tag: formData.get(`tag_${social.label}`) || social.tag,
    }));

    await user.save();
  } catch (error) {
    return { status: 500, message: 'Could not update socials', timestamp: Date.now() } 
  }

  revalidateTag('getUser')
  revalidateTag('getUsersWithPaginationAndFilter')

  return {
    status: 200,
    message: "Socials updated successfully",
    timestamp: Date.now()
  };
}

// PRIVATE
// DELETE SOCIAL
export async function deleteSocial(label: string) {  
  const req = await request()  
  const decision = await genericValidationAj.protect(req)

  if (decision.isDenied()) {        
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }
  
  try {
    const session = await getServerSession(authOptions)    
    
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    if (!label) {
      return { status: 404, message: 'Please pass a label', timestamp: Date.now() };
    }
    
    const sanitizedLabel = xss(label)    
  
    await connectMongoDB()

    const user = await User.findById(session.user.id)

    if (!user) {
      return { status: 404, message: 'User not found', timestamp: Date.now() };
    }

    if (user._id.toString() !== session.user.id) {      
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() };
    }

    const socialIndex = user.socials.findIndex(
      (social: { label: string }) => social.label === sanitizedLabel
    );

    if (socialIndex === -1) {
      return { status: 404, message: 'Social not found', timestamp: Date.now() };
    }

    user.socials.splice(socialIndex, 1);

    await user.save();
  } catch (error) {
    return { status: 500, message: 'Could not delete user', timestamp: Date.now() } 
  }

  revalidateTag('getUser')
  revalidateTag('getUsersWithPaginationAndFilter')

  return {
    status: 200,
    message: "Social deleted successfully",
    timestamp: Date.now()
  };
}

// PRIVATE
// POST, CREATE USER SOCIALS
export async function createSocial(prevState: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { status: 400, message: 'Incorrect formData', timestamp: Date.now() };
  }
  
  const req = await request()
  const decision = await genericValidationAj.protect(req)
  
  if (decision.isDenied()) {
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }

  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const formDataObject = Object.fromEntries(formData.entries())
    const parsedFormDataObject = await socialSchema.parseAsync(formDataObject)

    const sanitizedLabel = xss(parsedFormDataObject.label)
    const sanitizedTag = xss(parsedFormDataObject.tag)
    const sanitizedUrl = xss(parsedFormDataObject.url)

    await connectMongoDB()
    
    const user = await User.findById(session.user.id)

    if (!user) {
      return { status: 404, message: 'User not found', timestamp: Date.now() };
    }
    
    if (user._id.toString() !== session.user.id) {      
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() };
    }

    const existingSocial = user.socials.find(
      (social: SocialsInterface) => social.label === sanitizedLabel
    );
    
    if (existingSocial) {
      return { status: 400, message: 'This label is already in use', timestamp: Date.now() };
    }

    user.socials.push({ label: sanitizedLabel, tag: sanitizedTag, url: sanitizedUrl });
    await user.save();
  } catch (error) {
    if (error instanceof ZodError) {
      return { status: 400, message: error.message, timestamp: Date.now() };
    }

    return { status: 500, message: 'Could not create social', timestamp: Date.now() } 
  }

  revalidateTag('getUser')
  revalidateTag('getUsersWithPaginationAndFilter')

  return {
    status: 200,
    message: "Social created successfully",
    timestamp: Date.now()
  };
}

// PRIVATE
// DELETE USER
export async function deleteUser(prevState: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { status: 400, message: 'Incorrect formData', timestamp: Date.now() };
  }

  const req = await request()
  const decision = await genericValidationAj.protect(req)
  
  if (decision.isDenied()) {
    return { status: 400, message: `Denied: ` + decision.reason.type, timestamp: Date.now() };
  }
  
  try {
    const session = await getServerSession(authOptions)    
    
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const formDataObject = Object.fromEntries(formData.entries())
    const parsedFormDataObject = await deleteUserSchema.parseAsync(formDataObject)

    const sanitizedPassword = xss(parsedFormDataObject.password)
  
    await connectMongoDB()

    const user = await User.findById(session.user.id).lean<UserInterface | null>();

    if (!user) {
      return { status: 404, message: 'User not found', timestamp: Date.now() };
    }

    if (user._id.toString() !== session.user.id) {      
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() };
    }

    const match = await bcrypt.compare(sanitizedPassword, user.password);

    if (!match) {
      return { status: 400, message: 'Incorrect password', timestamp: Date.now() };
    }

    await User.deleteOne({ _id: user._id });
  } catch (error) {
    return { status: 500, message: 'Could not delete user', timestamp: Date.now() } 
  }

  return {
    status: 200,
    message: "User deleted successfully",
    timestamp: Date.now()
  };
}