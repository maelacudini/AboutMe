import CustomAlert from "../molecules/CustomAlert"
import { UserCard } from "../molecules/UserCard"
import { CleanUserType } from "@/utils/api/usersApi"

export type UsersListPropsType = {
    users: [] | CleanUserType[]
}

export const UsersList = (props: UsersListPropsType) => {
  const { users } = props

  if (!users || users.length === 0) {
    return (
      <div className="w-full h-60">
        <CustomAlert title="Uh-oh..." description="We could not find any users." />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {users.map((user) => (
        <UserCard user={user} key={user.email}/>
      ))}
    </div>
  )
}
