'use client'
import {
  useActionState, useEffect 
} from "react"
import Main from "../_components/layouts/Main"
import { createUser } from "@/utils/server/actions/user"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "../_components/shadcn/form"
import { Input } from "../_components/shadcn/input"
import { Button } from "../_components/shadcn/button"
import { signUpSchema } from "@/lib/zod/ValidationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Separator } from "../_components/shadcn/separator"
import Link from "next/link"
import { z } from "zod"
import Heading from "../_components/atoms/Heading"
import { PartyPopper } from "lucide-react"
import { useTranslations } from "next-intl"
import { INITIAL_STATE } from "@/utils/constants"
import { toast } from "sonner"
 
const Signup = () => {  
  const t = useTranslations("forms");
  const [state, formAction, pending] = useActionState(createUser, INITIAL_STATE)
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { 
      email: '',
      username: '',
      password: '',
    },
    mode: 'onBlur'
  })

  useEffect(() => {
    if (state.message && state.message.trim().length !== 0) {
      toast.error(state.message)      
    }
  }, [state.message, state.timestamp])
  
  return (
    <Main className="h-lvh flex justify-center items-center gap-8">
      <Form {...form}>
        <form action={formAction} className="space-y-4 max-w-xs w-full">
          <div className="flex items-center gap-2">
            <Heading tag="h4" size="text-2xl">{t("signup.form_title")}</Heading>
            <PartyPopper height={16} width={16}/>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Email"
                    {...field} 
                    type="email"
                    name="email" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Username"
                    {...field} 
                    type="username"
                    name="username" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Password"
                    {...field} 
                    type="password" 
                    name="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">
            <Button type="submit" disabled={pending || !form.formState.isValid} variant='outline'>{t("form_buttons.submit")}</Button>
            <Button type="reset" disabled={pending} variant='default' onClick={()=>form.reset()}>{t("form_buttons.reset")}</Button>            
          </div>
        </form>
      </Form>
      <Separator className="max-w-xs w-full" decorative={true} />
      <div className="text-center space-y-2">
        <p>{t("signup.form_redirect.question")} <Link href='/login' className="underline hover:underline-offset-4 transition-all duration-300">{t("signup.form_redirect.link")}</Link></p>
      </div>
    </Main>
  )
}

export default Signup