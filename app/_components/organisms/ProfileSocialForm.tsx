import { Plus } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "../shadcn/alertdialog"
import { Input } from "../shadcn/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { socialSchema } from "@/lib/zod/ValidationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useActionState, useEffect 
} from "react"
import { createSocial } from "@/utils/server/actions/user"
import { INITIAL_STATE } from "@/utils/constants"
import { toast } from "sonner"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "../shadcn/form"
import { useTranslations } from "next-intl"

export const ProfileSocialForm = () => {
  const t = useTranslations("forms");
  const [state, formAction, pending] = useActionState(createSocial, INITIAL_STATE)
  const form = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      label: '',
      tag: '',
      url: '',
      isDeleted: false
    },
    mode: 'onBlur'
  })
 
  useEffect(() => {
    if (state.message && state.message.trim().length !== 0) {
      toast.error(state.message)      
    }
  }, [state.message, state.timestamp])

  return (
    <AlertDialog>
      <AlertDialogTrigger><Plus height={16} width={16} /></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add social</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form action={formAction} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. Twitter"
                          type="text"
                          name="label" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. @your_twitter_username"
                          type="text"
                          name="tag" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Url</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. https://twitter.com"
                          type="url"
                          name="url" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">
                  <AlertDialogAction type="submit" disabled={pending || !form.formState.isValid}>{t("form_buttons.submit")}</AlertDialogAction>
                  <AlertDialogCancel type="reset" onClick={()=>form.reset()}>{t("form_buttons.reset")}</AlertDialogCancel>
                </div>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
