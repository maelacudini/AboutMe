'use client'
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger 
} from "../shadcn/menubar"
import {
  Languages,
  Moon, Sun 
} from "lucide-react"
import {
  signOut, useSession 
} from "next-auth/react"
import { useTranslations } from "next-intl"
import { AVAILABLE_LOCALES } from "@/utils/constants"
import { setUserLocale } from "@/utils/server/functions/locale"

const Header = () => {
  const t = useTranslations("navigation");
  const { status } = useSession()
  const { setTheme, theme } = useTheme()
  
  return (
    <header className="flex justify-center p-4 fixed top-0 left-0 right-0 z-[99]">
      <Menubar>
        <MenubarMenu key={'theme'}>
          <MenubarTrigger onClick={() => setTheme(!theme || theme === 'light' ? 'dark' : 'light')}>
            {(!theme || theme === 'light') ? <Moon height={16} width={16} /> : <Sun height={16} width={16}/>}
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu key='home'>
          <MenubarTrigger>
            <Link href='/'>{t("home")}</Link>
          </MenubarTrigger>
        </MenubarMenu>
        {status === 'authenticated' ?
          <>
            <MenubarMenu key='profile'>
              <MenubarTrigger>
                <Link href='/profile'>{t("profile")}</Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu key='logout'>
              <MenubarTrigger onClick={() => signOut()}>
                <p>{t("logout")}</p>
              </MenubarTrigger>
            </MenubarMenu>
          </> 
          :
          <>
            <MenubarMenu key='signup'>
              <MenubarTrigger>
                <Link href={'/signup'}>{t("signup")}</Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu key='login'>
              <MenubarTrigger>
                <Link href={'/login'}>{t("login")}</Link>
              </MenubarTrigger>
            </MenubarMenu>
          </>
        }
        <MenubarMenu key={'lang'}>
          <MenubarTrigger>
            <Languages height={16} width={16}/>
          </MenubarTrigger>
          <MenubarContent>
            {AVAILABLE_LOCALES.map((locale) => (
              <MenubarItem key={`locale_${locale.tag}`} onClick={() => setUserLocale(locale.tag)}>{locale.label}</MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </header>
  )
}

export default Header
