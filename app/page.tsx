import Hero from "./_components/organisms/Hero";
import Main from "./_components/layouts/Main";
import { useTranslations } from "next-intl";
import HeroImage from "./_components/organisms/HeroImage";
import { frameworks } from "@/utils/data";
import Combobox from "./_components/molecules/Combobox";

export default function Home() {
  const t = useTranslations('home');

  return (
    <Main>
      <Hero title={t('hero_title')}/>
      <HeroImage src={'/hero.jpg'}/>
      <Combobox data={frameworks} buttonLabel="Search for dishes" inputLabel="What are you craving?"/>
    </Main>
  )
}
