import { UserInterface } from "@/app/api/auth/[...nextauth]/next-auth"
import { getBaseUrlBasedOnServer } from "../functions"

export type CleanUserType = Omit<UserInterface, 'password' | '_id'>

export type GetUsersWithPaginationAndFilterResponseType = {
  users: CleanUserType[] | [],
  pagination: {
    currentPage: number,
    totalUsers: number,
    hasMore: boolean
  }
}

export async function getUsersWithPaginationAndFilter(page: number, filter: string = ''): Promise<GetUsersWithPaginationAndFilterResponseType> {
  const baseUrl = getBaseUrlBasedOnServer()
  const url = `${baseUrl}/api/users?page=${page}&filter=${filter}`;
  const res = await fetch(url, { 
    next: { tags: ['getUsersWithPaginationAndFilter'] },
    cache: 'no-store'
  })
      
  return await res.json()
}