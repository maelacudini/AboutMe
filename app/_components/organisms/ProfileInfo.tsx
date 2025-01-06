'use client'
import { useTranslations } from "next-intl"
import {
  useActionState, useEffect 
} from "react"
import { updateUserData } from "@/utils/server/actions/user"
import { INITIAL_STATE } from "@/utils/constants"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserDataSchema } from "@/lib/zod/ValidationSchemas"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "../shadcn/form"
import { Input } from "../shadcn/input"
import { Button } from "../shadcn/button"
import { Textarea } from "../shadcn/textarea"
import { toast } from "sonner"
import Heading from "../atoms/Heading"
import {
  Avatar, AvatarFallback, AvatarImage 
} from "../../_components/shadcn/avatar";
import { CleanUserType } from "@/utils/api/usersApi"

export type ProfileInfoPropsType = {
    user: CleanUserType
}

export const ProfileInfo = (props: ProfileInfoPropsType) => {
  const { user } = props

  const t = useTranslations();  
  const [state, formAction, pending] = useActionState(updateUserData, INITIAL_STATE)
  const form = useForm<z.infer<typeof updateUserDataSchema>>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: { 
      email: user.email,
      avatar: user.avatar && user.avatar,
      bio: user.bio && user.bio,
      username: user.username,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (state.message && state.message.trim().length !== 0) {
      toast.error(state.message)      
    }
  }, [state.message, state.timestamp])  

  return (
    <section className="space-y-4">
      <Heading tag="h3" size="text-3xl">Edit your general info</Heading>
      <div className="flex justify-center">
        <Avatar className="w-40 h-40">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.username.slice(0,2)}</AvatarFallback>
        </Avatar>
      </div>
      <Form {...form}>
        <form action={formAction} className="grid md:grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className="col-span-3 md:col-span-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={user.email}
                    {...field} 
                    type="text"
                    name='email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem className="col-span-3 md:col-span-1">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field} 
                    type="text"
                    name='username'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='avatar'
            render={({ field }) => (
              <FormItem className="col-span-3 md:col-span-1">
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your avatar"
                    type="text"
                    name='avatar'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add your bio"
                    rows={5}
                    name='bio'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4 justify-between items-center w-full">
            <Button type="submit" disabled={pending || !form.formState.isValid} variant='outline'>{t("forms.form_buttons.submit")}</Button>
            <Button type="reset" disabled={pending} variant='default' onClick={()=>form.reset()}>{t("forms.form_buttons.reset")}</Button>            
          </div>
        </form>
      </Form>
    </section>
  )
}
