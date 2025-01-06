'use server'
import connectMongoDB from "@/lib/mongo/DBConnection";
import User from "@/lib/mongo/models/User";
import {
  signUpSchema, socialSchema, updatePasswordSchema 
} from "@/lib/zod/ValidationSchemas";
import xss from "xss";
import { saltAndHashPassword } from "../functions/auth";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";
import { SocialsInterface } from "@/app/api/auth/[...nextauth]/next-auth";

// PUBLIC
// POST, SIGN UP
export async function createUser(prevState: any, formData: FormData) {
  try {
    const rawFormData = {
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
    }
  
    const { email, username, password } = rawFormData  
  
    await signUpSchema.parseAsync(rawFormData)

    const sanitizedPassword = xss(password!.toString())
    const sanitizedEmail = xss(email!.toString())
    const sanitizedUsername = xss(username!.toString())

    await connectMongoDB()

    const query = {
      $or: [
        { email: sanitizedEmail },
        { username: sanitizedUsername }
      ]
    }

    const existingUser = await User.findOne(query)
   
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

  return { status: 200, message: 'User succesfully created', timestamp: Date.now() };
}

// PRIVATE
// POST, UPDATE USER PASSWORD
export async function updateUserPassword(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const rawFormData = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
    }
  
    const { currentPassword, newPassword } = rawFormData

    await updatePasswordSchema.parseAsync(rawFormData)
  
    const sanitizedCurrentPassword = xss(currentPassword!.toString())
    const sanitizedNewPassword = xss(newPassword!.toString())

    await connectMongoDB()
    
    const user = await User.findById(session.user.id)

    if (!user) {
      return { status: 404, message: 'No user found', timestamp: Date.now() };
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
export async function updateUserData(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const rawFormData = {
      email: formData.get('email'),
      username: formData.get('username'),
      bio: formData.get('bio'),
      avatar: formData.get('avatar'),
    }
  
    const { email, username, bio, avatar } = rawFormData  

    const sanitizedData: Record<string, string> = {};

    if (email) {sanitizedData.email = xss(email.toString());}
    if (username) {sanitizedData.username = xss(username.toString());}
    if (bio) {
      sanitizedData.bio = xss(bio.toString())
    } else {
      sanitizedData.bio = ''
    }
    if (avatar) {
      sanitizedData.avatar = xss(avatar.toString())
    } else {
      sanitizedData.avatar = ''
    }    

    await connectMongoDB()

    // Exclude the current user from the query by adding the `user.id` to the condition
    const query = {
      $or: [
        { email: sanitizedData.email },
        { username: sanitizedData.username }
      ],
      _id: { $ne: session.user.id }
    };

    const existingUser = await User.findOne(query);
   
    if (existingUser) {
      if (existingUser.email === sanitizedData.email) {
        return { message: 'User already exists', timestamp: Date.now() };
      } else if (existingUser.username === sanitizedData.username) {
        return { message: 'Username is already taken', timestamp: Date.now() };
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      sanitizedData,
      { new: true }
    );

    if (!updatedUser) {
      return { status: 404, message: 'User not found', timestamp: Date.now() };
    }
    
  } catch (error) {
    return { status: 500, message: 'Could not update field', timestamp: Date.now() } 
  } 

  revalidateTag('getUser')
  revalidateTag('getUsersWithPaginationAndFilter')

  return { status: 200, message: 'user updated', timestamp: Date.now() }
}

// PRIVATE
// POST, UPDATE CURRENT USER SOCIALS
export async function updateUserSocials(prevState: any, formData: FormData) {
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

    const { socials } = user

    const updatedSocials = await Promise.all(
      socials.map(async (social: SocialsInterface) => {
        const url = formData.get(`url_${social.label}`);
        const tag = formData.get(`tag_${social.label}`);
        const isDeleted = formData.get(`isDeleted_${social.label}`) === 'true';

        if (isDeleted) {return null}

        return {
          label: social.label,
          url: url || social.url,
          tag: tag || social.tag,
          isDeleted: false,
        };
      })
    );

    user.socials = updatedSocials.filter((social): social is SocialsInterface => social !== null);
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
// POST, CREATE USER SOCIALS
export async function createSocial(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { status: 401, message: 'Unauthorized', timestamp: Date.now() }
    }

    const rawFormData = {
      label: formData.get('label'),
      tag: formData.get('tag'),
      url: formData.get('url'),
      isDeleted: false
    }

    const { label, tag, url } = rawFormData

    await socialSchema.parseAsync(rawFormData)

    const sanitizedLabel = xss(label!.toString())
    const sanitizedTag = xss(tag!.toString())
    const sanitizedUrl = xss(url!.toString())
    
    const user = await User.findById(session.user.id)

    if (!user) {
      return { status: 404, message: 'User not found', timestamp: Date.now() };
    }

    user.socials.push({ label: sanitizedLabel, tag: sanitizedTag, url: sanitizedUrl, isDeleted: false });
    await user.save();
  } catch (error) {
    if (error instanceof ZodError) {
      return { status: 400, message: error.message, timestamp: Date.now() };
    }

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