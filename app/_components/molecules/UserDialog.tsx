import { UserInterface } from "@/app/api/auth/[...nextauth]/next-auth";
import { User, } from "lucide-react";
import Image from "next/image";
import { GetImageWithPlaiceholderResponseType } from "@/app/api/plaiceholder/route";
import {
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "../shadcn/tabs";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "../shadcn/card";
import { Badge } from "../shadcn/badge";

export type UserDialogPropsType = {
    user: Omit<UserInterface, "password">,
    onSubmit: ()=>void
}

export interface UserImageType extends GetImageWithPlaiceholderResponseType {}

export const UserDialog = (props: UserDialogPropsType) => {
  const { user, onSubmit= () => {} } = props

  return (
    <div className="fixed inset-0 z-[99] flex justify-center items-center p-4">
      <div
        className="bg-black/80 absolute inset-0"
        onClick={() => {
          onSubmit();
          document.body.style.overflow = "auto";
        }}
      />
      <Tabs defaultValue="info" className="relative w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Infos</TabsTrigger>
          <TabsTrigger value="socials">Socials</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card className="">
            <div className="mb-8">
              {user.avatar ? 
                <Image alt="User avatar" src={user.avatar} width={400} height={400} className="aspect-square object-center object-cover"/>
                :
                <div className="flex justify-center items-center aspect-square">
                  <User height={32} width={32} />
                </div>    
              }
            </div>
            <CardHeader>
              <CardTitle>{user.username ? user.username : user.email}</CardTitle>
              <CardDescription>{user.bio ? user.bio : 'This user has no bio yet.'}</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="socials">
          <Card className="max-h-[32rem] overflow-y-scroll">
            <CardContent className="flex flex-wrap gap-2">
              {user.socials && user.socials.length !== 0 ? user.socials.map((social) => (
                <Badge key={social.label}><a target="_blank" rel="noopener noreferrer" href={social.url}>{social.label}</a></Badge>
              )):<p>This user has no socials yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
