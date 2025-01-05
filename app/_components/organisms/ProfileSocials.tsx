import { SocialsInterface } from "@/app/api/auth/[...nextauth]/next-auth"
import { Label } from "../shadcn/label"
import { Input } from "../shadcn/input"
import Heading from "../atoms/Heading"
import { getTranslations } from "next-intl/server"
import { Button } from "../shadcn/button"

export type ProfileSocialsPropsType = {
    socials: SocialsInterface[]
}
export const ProfileSocials = async (props: ProfileSocialsPropsType) => {
  const { socials } = props
  const t = await getTranslations();  

  return (
    <section className="space-y-4">
      <Heading tag="h3" size="text-3xl">Edit your socials</Heading>
      <form action="" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {socials.map((social) => {
          return (
            <div key={social.label} className="space-y-2">
              <Label htmlFor={social.label.toLowerCase()}>{social.label}</Label>
              <Input type="text" min={1} id={social.label.toLowerCase()} placeholder={social.tag} defaultValue={social.tag}/>
            </div>
          )
        })}
        <div className="grid grid-cols-2 gap-4 justify-between items-center w-full">
          <Button type="submit" variant='outline'>{t("forms.form_buttons.submit")}</Button>
          <Button type="reset" variant='default'>{t("forms.form_buttons.reset")}</Button>            
        </div>
      </form>
    </section>
  )
}
