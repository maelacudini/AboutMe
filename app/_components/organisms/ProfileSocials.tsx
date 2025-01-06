'use client'

import { SocialsInterface } from "@/app/api/auth/[...nextauth]/next-auth"
import { Label } from "../shadcn/label"
import { Input } from "../shadcn/input"
import Heading from "../atoms/Heading"
import { Button } from "../shadcn/button"
import { updateUserSocials } from "@/utils/server/actions/user"
import { useTranslations } from "next-intl"
import {
  Fragment,
  useActionState, useEffect, useState 
} from "react"
import { INITIAL_STATE } from "@/utils/constants"
import { toast } from "sonner"
import { ProfileSocialForm } from "./ProfileSocialForm"
import { v4 as uuidv4 } from 'uuid';

export type ProfileSocialsPropsType = {
  socials: SocialsInterface[]
}

export type SocialPropsType = {
  social: SocialsInterface
}

export const ProfileSocials = (props: ProfileSocialsPropsType) => {
  const { socials } = props
  const t = useTranslations();  
  const [state, formAction, pending] = useActionState(updateUserSocials, INITIAL_STATE)
  const userHasSocials = !socials || socials.length === 0

  useEffect(() => {
    if (state.message && state.message.trim().length !== 0) {
      if (state.status === 200) {
        toast.success(state.message)
      } toast.error(state.message)
    }
  }, [state])

  return (
    <Fragment>
      <section className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <Heading tag="h3" size="text-3xl">Edit your socials</Heading>
          <ProfileSocialForm />
        </div>
        {!userHasSocials ?
          <form action={formAction} className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
            {socials.map((social) => (
              <Social social={social} key={uuidv4()}/>
            ))}
            <div className="grid grid-cols-3 gap-4 justify-between items-center w-full sm:col-span-2 md:col-span-4">
              <Button type="submit" variant='outline' disabled={pending}>{t("forms.form_buttons.submit")}</Button>
              <Button type="reset" variant='default' disabled={pending}>{t("forms.form_buttons.reset")}</Button>
            </div>
          </form> : <p className="text-sm text-muted-foreground">This user has no socials yet.</p>}
      </section>
    </Fragment>
  )
}

const Social = (props: SocialPropsType) => {
  const { social } = props
  const [isDeleted, setIsDeleted] = useState(social.isDeleted)
  
  return (
    <div key={social.label} className="space-y-2" style={{ opacity: isDeleted ? 0.5 : 1 }}>
      <Label htmlFor={`url_${social.label}`}>{social.label}</Label>
      <Input name={`url_${social.label}`} type="url" min={1} id={`url_${social.label}`} placeholder={social.url} defaultValue={social.url}/>
      <Input name={`tag_${social.label}`} type="text" min={1} id={`tag_${social.label}`} placeholder={social.tag} defaultValue={social.tag}/>
      <Input name={`isDeleted_${social.label}`} type="hidden" value={String(isDeleted)}/>
      <Button type="button" variant='destructive' disabled={social.isDeleted} onClick={() => setIsDeleted(true)}>Delete</Button>
    </div>
  )
}