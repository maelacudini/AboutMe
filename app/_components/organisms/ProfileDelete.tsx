'use client'
import { INITIAL_STATE } from "@/utils/constants"
import { showToast } from "@/utils/functions"
import { deleteUser } from "@/utils/server/actions/user"
import {
  useActionState, useEffect,
  useState, 
} from "react"
import { Label } from "../shadcn/label"
import { Input } from "../shadcn/input"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger
} from "../shadcn/alertdialog"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "../shadcn/card"
import { useTranslations } from "next-intl"
import { signOut } from "next-auth/react"

export const ProfileDelete = () => {
  const [state, formAction, pending] = useActionState(deleteUser, INITIAL_STATE)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const t = useTranslations();  

  useEffect(() => {
    if (state.message && state.message.trim().length !== 0) {
      showToast(state.status, state.message)
    }

    if (state.status === 200) {
      signOut({ callbackUrl: "/login" })
    }
  }, [state])

  return (
    <form id="delete_profile" action={formAction}>
      <Card className="w-full border border-destructive bg-destructive/[0.05]">
        <CardHeader>
          <CardTitle>{t('profile.delete_profile_card_title')}</CardTitle>
          <CardDescription>{t('profile.delete_profile_card_description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="space-y-2 w-full">
            <Label htmlFor="password">{t('profile.delete_profile_confirm_password')}</Label>
            <div className="flex gap-1">
              <Input type="password" id="password" name="password" form="delete_profile" min={1} onChange={(e) => setIsDirty(!!e.target.value.trim())} required placeholder={t('profile.delete_profile_confirm_password_placeholder')} />
              <AlertDialog>
                <AlertDialogTrigger
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2"
                  type="button"
                  disabled={!isDirty}
                >
                  {t('buttons.confirm')}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('profile.delete_profile_alert_title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('profile.delete_profile_alert_description')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">{t('buttons.cancel')}</AlertDialogCancel>
                    <AlertDialogAction type="submit" form="delete_profile" disabled={pending}>{t('buttons.confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
