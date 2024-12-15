import Hero from "../_components/organisms/Hero";
import Main from "../_components/layouts/Main"
import { useTranslations } from "next-intl";
import HeroImage from "../_components/organisms/HeroImage";

const Profile = () => {
  const t = useTranslations('profile');

  return (
    <Main>
      <Hero title={t('hero_title')}/>
      <HeroImage src={'/profile.jpg'}/>
    </Main>
  )
}

export default Profile
