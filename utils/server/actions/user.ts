/* eslint-disable complexity */
/* eslint-disable no-undef */
'use server'
import connectMongoDB from "@/lib/mongo/DBConnection";
import User from "@/lib/mongo/models/User";
import {
  signUpSchema, updatePasswordSchema 
} from "@/lib/zod/ValidationSchemas";
import xss from "xss";
import { saltAndHashPassword } from "../functions/auth";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";

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
  
    await signUpSchema.parseAsync({ email: email, username: username, password: password });

    if (!email || !password || !username) {
      return { message: 'Please enter valid credentials' }
    }

    const sanitizedPassword = xss(password.toString())
    const sanitizedEmail = xss(email.toString())
    const sanitizedUsername = xss(username.toString())

    await connectMongoDB()

    const query = {
      $or: [
        { email: sanitizedEmail },
        { username: sanitizedUsername }
      ]
    };    

    const existingUser = await User.findOne(query);
   
    if (existingUser) {
      if (existingUser.email === sanitizedEmail) {
        return { message: 'User already exists', timestamp: Date.now() };
      } else if (existingUser.username === sanitizedUsername) {
        return { message: 'Username is already taken', timestamp: Date.now() };
      }
    }

    const hashedPassword = await saltAndHashPassword(sanitizedPassword)    
  
    await User.create({
      email: sanitizedEmail,
      username: sanitizedUsername,
      password: hashedPassword,
    })

    revalidateTag('getUsersWithPaginationAndFilter')

    return { message: 'User succesfully created', timestamp: Date.now() };
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.message }
    }
     
    return { message: 'Could not signup' } 
  } 
}

// PRIVATE
// POST, UPDATE USER PASSWORD
export async function updateUserPassword(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { message: 'Unauthorized' }
    }

    const rawFormData = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      userId: formData.get('userId'),
    }
  
    const { currentPassword, newPassword, userId } = rawFormData

    await updatePasswordSchema.parseAsync({ userId, currentPassword, newPassword });

    if (!currentPassword || !newPassword || !userId) {
      return { message: 'Please make sure to fill in all required fields' }
    }
  
    const sanitizedCurrentPassword = xss(currentPassword.toString())
    const sanitizedNewPassword = xss(newPassword.toString())
    const sanitizedUserId = xss(userId.toString())

    await connectMongoDB()
    
    const user = await User.findById(sanitizedUserId)

    if (!user) {
      return { message: 'No user found' }
    }

    const match = await bcrypt.compare(sanitizedCurrentPassword, user.password);

    if (!match) {
      return { message: 'Your current password does not match' }
    }

    const hashedNewPassword = await bcrypt.hash(sanitizedNewPassword, 10)

    await User.findByIdAndUpdate(sanitizedUserId, { password: hashedNewPassword }, { new: true })

    return { message: 'Your password has been successfully updated' }
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.message }
    }
     
    return { message: 'Could not update password' } 
  }
}

// PRIVATE
// POST, UPDATE USER GENERAL DATA
export async function updateUserData(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { message: 'Unauthorized' }
    }

    const rawFormData = {
      email: formData.get('email'),
      username: formData.get('username'),
      bio: formData.get('bio'),
      avatar: formData.get('avatar'),
    }
  
    const { email, username, bio, avatar } = rawFormData  

    if (!session.user.id) {      
      return { message: 'No valid user id', timestamp: Date.now() }
    }

    const sanitizedData: Record<string, string> = {};

    if (email) {sanitizedData.email = xss(email.toString());}
    if (username) {sanitizedData.username = xss(username.toString());}
    if (bio) {sanitizedData.bio = xss(bio.toString());}
    if (avatar) {sanitizedData.avatar = xss(avatar.toString());}

    await connectMongoDB()

    // TODO: find out if email or username are already in use
    const query = {
      $or: [
        { email: sanitizedData.email },
        { username: sanitizedData.username }
      ]
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
      return { message: 'User not found', status: 404, timestamp: Date.now() };
    }

    revalidateTag('getUser')
    revalidateTag('getUsersWithPaginationAndFilter')
    
    return { message: 'user updated', timestamp: Date.now() }
  } catch (error) {
    return { message: 'Could not update field', timestamp: Date.now() } 
  } 
}

// PRIVATE
// POST, UPDATE OR CREATE USER SOCIALS
export async function updateUserSocials(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
  
    if (!session) {
      return { message: 'Unauthorized' }
    }

    await connectMongoDB()
    const user = await User.findById(session.user.id)

    if (!user) {
      return { message: 'No valid user id', timestamp: Date.now() }
    }

    //TODO: find a way to gather user socials from mapping them in FE and update the ones modified

    const socials = JSON.parse(formData.get("socials") as string || "[]");

    if (!Array.isArray(socials)) {
      return { status: 400, message: "Invalid socials data" };
    }

    user.socials = socials.map((social) => ({
      label: social.label || "",
      tag: social.tag || "",
    }));

    await user.save();

    return {
      status: 200,
      message: "Socials updated successfully",
      socials: user.socials,
    };

  } catch (error) {
    return { message: 'Could not update socials', timestamp: Date.now() } 
  }
}