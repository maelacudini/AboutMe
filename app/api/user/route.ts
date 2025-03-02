import { getServerSession } from "next-auth"
import {
  NextRequest, NextResponse 
} from "next/server"
import User from "@/lib/mongo/models/User"
import connectMongoDB from "@/lib/mongo/DBConnection"
import { UserInterface } from "../auth/[...nextauth]/next-auth"
import { authOptions } from "@/lib/nextAuth/AuthOptions"
import { genericValidationAj } from "@/lib/arcjet/ArcjetRules"

// PRIVATE
// GET USER
export async function GET(req: NextRequest) {
  const decision = await genericValidationAj.protect(req);

  if (decision.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    const session = await getServerSession(authOptions)    
    
    if (!session) {
      return NextResponse.json(
        { statusText: "Unauthorized." },
        { status: 401 }
      )
    }
  
    await connectMongoDB()

    const user = await User.findById(session.user.id).select('-password').lean<UserInterface | null>();

    if (!user) {
      return NextResponse.json(
        { statusText: "User not found." },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { statusText: 'Fetched user succesfully.', status: 200 })
  } catch (error) {    
    return NextResponse.json(
      { statusText: "There was an error fetching the user." },
      { status: 500 }
    )  
  }  
}