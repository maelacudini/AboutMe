import {
  NextRequest,
  NextResponse 
} from "next/server";
import connectMongoDB from "@/lib/mongo/DBConnection";
import User from "@/lib/mongo/models/User";
import { PAGINATIOIN_LIMIT } from "@/utils/constants";
import xss from "xss";
import { genericValidationAj } from "@/lib/arcjet/ArcjetRules";

// PUBLIC
// GET ALL USERS
export async function GET(req: NextRequest) {
  const decision = await genericValidationAj.protect(req);
    
  if (decision.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    const filter = req.nextUrl.searchParams.get("filter") || '';
    const sortParam = req.nextUrl.searchParams.get("sort") || 'asc';
    const pageParam = req.nextUrl.searchParams.get("page") || '1';
    const page = parseInt(pageParam, 10);    
  
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { statusText: "Please set the correct page." },
        { status: 400 }
      );
    }

    const sanitizedFilter = xss(filter)
    
    await connectMongoDB()    

    const query = sanitizedFilter ? {
      $or: [
        { username: { $regex: sanitizedFilter, $options: 'i' } },
        { email: { $regex: sanitizedFilter, $options: 'i' } }
      ]
    } : {};
    const sortOrder = sortParam === 'desc' ? -1 : 1;
    const users = await User.find(query).select('-password -_id').sort({ username: sortOrder }).skip((page - 1) * PAGINATIOIN_LIMIT).limit(PAGINATIOIN_LIMIT).lean();
    
    const totalUsers = await User.countDocuments(query); 
    const hasMore = page * PAGINATIOIN_LIMIT < totalUsers;
    
    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalUsers,
        hasMore,
      },
    }, { statusText: 'Fetched all users succesfully.', status: 200 })
  } catch (error) {
    return NextResponse.json(
      { statusText: "There was an error fetching the users." },
      { status: 500 }
    );
  }
}