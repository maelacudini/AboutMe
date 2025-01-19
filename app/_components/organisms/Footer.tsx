import { ArrowRight } from "lucide-react"
import Heading from "../atoms/Heading"
import { Button } from "../shadcn/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { ICONS_SIZES } from "@/utils/constants"

export const Footer = async () => {
  const t = await getTranslations()

  return (
    <footer className="w-full max-w-screen-xl space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-4 md:col-span-2">
          <Heading tag="h3" size="text-2xl">{t('footer.title')}</Heading>
          <Button variant='default' aria-label="hello.about@gmail.com"><ArrowRight size={ICONS_SIZES.sm} />hello.about@gmail.com</Button>
        </div>
        <div className="flex md:justify-end gap-4">
          <Link href='/'>{t('navigation.home')}</Link>
          <Link href='/login'>{t('navigation.login')}</Link>
          <Link href='/signup'>{t('navigation.signup')}</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <p className="text-sm text-muted-foreground">
          {t('footer.subtitle')} <a href="www.linkedin.com/in/maelacudini" target="_blank" rel="noopener noreferrer">@maelacudini</a>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <p>{t('footer.sitemap').toUpperCase()}</p>
            <div className="flex flex-col gap-2">
              <Link href='/'>Home</Link>
              <Link href='/login'>Login</Link>
              <Link href='/signup'>Signup</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p>{t('footer.follow_us').toUpperCase()}</p>
            <div className="flex flex-col gap-2">
              <Link href='/'>Twitter</Link>
              <Link href='/login'>Instagram</Link>
              <Link href='/signup'>Facebook</Link>
              <Link href='/signup'>Pinterest</Link>
              <Link href='/signup'>TikTok</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
