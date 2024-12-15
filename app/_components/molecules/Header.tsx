'use client'
import Link from "next/link"
import {
  links , availableLocales 
} from "@/utils/data"
import { useTheme } from "next-themes"
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger 
} from "../shadcn/menubar"
import {
  Languages,
  Moon, Sun 
} from "lucide-react"
import { setLocale } from "@/utils/serverFn"

const Header = () => {
  const { setTheme, theme } = useTheme()

  return (
    <header className="flex justify-center m-4 fixed top-0 left-0 right-0 z-[99]">
      <Menubar>
        <MenubarMenu key={'theme'}>
          <MenubarTrigger onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon height={16} width={16} /> : <Sun height={16} width={16}/>}
          </MenubarTrigger>
        </MenubarMenu>
        {links.map((link) => (
          <MenubarMenu key={link.label}>
            <MenubarTrigger>
              <Link href={link.href}>{link.label}</Link>
            </MenubarTrigger>
          </MenubarMenu>
        ))}
        <MenubarMenu key={'lang'}>
          <MenubarTrigger>
            <Languages height={16} width={16}/>
          </MenubarTrigger>
          <MenubarContent>
            {availableLocales.map((locale) => (
              <MenubarItem key={`locale_${locale.tag}`} onClick={() => setLocale(locale.tag)}>{locale.label}</MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </header>
  )
}

export default Header
