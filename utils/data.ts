import { Locale } from "@/i18n/request"

export const links = [
  { label: 'HOME', href: '/' },
  { label: 'DISCOVER', href: '/discover' },
  { label: 'PROFILE', href: '/profile' },
]

export type LocaleType = {
  label: 'Italiano' | 'English',
  tag: Locale
}

export type AvailableLocalesType = LocaleType[]

export const availableLocales: AvailableLocalesType = [
  { label: 'Italiano', tag: 'it' },
  { label: 'English', tag: 'en' },
]


export const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]