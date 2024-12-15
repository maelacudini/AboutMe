import Hero from "../_components/organisms/Hero";
import Main from "../_components/layouts/Main"
import { useTranslations } from "next-intl";
import HeroImage from "../_components/organisms/HeroImage";

const Discover = () => {
  const t = useTranslations('discover');

  return (
    <Main>
      <Hero title={t('hero_title')}/>
      <HeroImage src={'/discover.jpg'}/>
    </Main>
  )
}

export default Discover
