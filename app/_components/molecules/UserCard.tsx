import {
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "../shadcn/card"
import {
  Avatar, AvatarFallback, AvatarImage 
} from "../shadcn/avatar"
import { Button } from "../shadcn/button"
import { Separator } from "../shadcn/separator"
import { useRouter } from "next/navigation"
import { CleanUserType } from "@/utils/api/usersApi"

export type UserCardPropsType = {
  user: CleanUserType
}

export const UserCard = (props: UserCardPropsType) => {
  const { user } = props
  const router = useRouter()
  const userBio = user.bio ? (user.bio.length > 100 ? `${user.bio.slice(0,100)}...` : user.bio) : 'User has no bio yet.'
  const userUsername = user.username ? user.username : user.email
  const userHasSocials = user.socials && user.socials.length !== 0
  // const isShowSocialsDisabled = !user.socials || user.socials.length > 5
      
  return (
    <Card>
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.email.slice(0,1)}</AvatarFallback>
        </Avatar>
        <CardHeader>
          <CardTitle>{userUsername}</CardTitle>
        </CardHeader>
      </div>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{userBio}</p>
        <div className="flex gap-2 items-center overflow-x-scroll w-full">
          {userHasSocials ? 
            user.socials.map((social) => (
              <div key={social.label} className="flex items-center gap-2">
                <a href={social.url} target="_blank" rel="noopener noreferrer">{social.label}</a>
                <Separator orientation="vertical" className="h-4" />
              </div>
            )) : 
            <p className="text-sm text-muted-foreground">This user has no socials yet.</p>
          }
        </div>
      </CardContent>
      <CardFooter>
        <Button variant='default' type="button" onClick={()=>router.push(`/${user.username}`)}>See more</Button>
      </CardFooter>
    </Card>
  )
}
