'use client'

import {
  getUsersWithPaginationAndFilter, GetUsersWithPaginationAndFilterResponseType 
} from "@/utils/api/usersApi"
import React, {
  useMemo, useState 
} from "react"
import { Skeleton } from "../shadcn/skeleton"
import { toast } from "sonner"
import { Input } from "../shadcn/input"
import { Button } from "../shadcn/button"
import { debounce } from "@/utils/functions"
import { Label } from "../shadcn/label"
import { UsersList } from "./UsersList"

export type UsersPropsType = {
  usersAndPagination: GetUsersWithPaginationAndFilterResponseType
}

const Users = ( props: UsersPropsType ) => {
  const { usersAndPagination } = props
  const [users, setUsers] = useState<GetUsersWithPaginationAndFilterResponseType['users']>(usersAndPagination.users)
  const [pagination, setPagination] = useState<GetUsersWithPaginationAndFilterResponseType['pagination']>(usersAndPagination.pagination)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = async (page: number, filter: string = '') => {
    setIsLoading(true);
    try {
      const response = await getUsersWithPaginationAndFilter(page, filter);

      setUsers(response.users);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch (error) {
      toast.error('Could not fetch users');
      setIsLoading(false);
    }
  };

  const next = async () => {
    if (!pagination.hasMore) {return;}
    const nextPage = pagination.currentPage + 1;

    fetchUsers(nextPage);
  };

  const previous = async () => {
    if (pagination.currentPage === 1) {return;}
    const previousPage = pagination.currentPage - 1;

    fetchUsers(previousPage);
  };

  const debouncedFetchUsers = useMemo(() => debounce(fetchUsers, 500), []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = e.currentTarget.value;

    debouncedFetchUsers(1, newFilter);    
  };

  return (
    <section className="space-y-4">
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="filter">Looking for someone?</Label>
        <Input onChange={handleFilterChange} id="filter" type="text" placeholder="Search by username or email" />
      </div>

      {isLoading ?
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-60 rounded-xl border" />
          ))}
        </div> : <UsersList users={users}/>}

      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground">{pagination?.currentPage}</p>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={()=> previous()}
            disabled={pagination?.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={()=> next()}
            disabled={pagination?.hasMore === false}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Users