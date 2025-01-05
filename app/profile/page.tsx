import Main from "../_components/layouts/Main"
import Heading from "../_components/atoms/Heading";
import { ProfileInfo } from "../_components/organisms/ProfileInfo";
import { getUser } from "@/utils/api/userApi";
import Hero from "../_components/organisms/Hero";
import { getTranslations } from "next-intl/server";
import { ProfileSocials } from "../_components/organisms/ProfileSocials";

const Profile = async () => {
  const user = await getUser()  
  const t = await getTranslations("profile");

  if (!user) {
    return (
      <Main className="h-lvh flex justify-center items-center gap-8">
        <Heading>No user found.</Heading>
      </Main>
    )
  }  

  const socials = [
    { label: 'Test', tag: '@Test', url: 'hshshs' },
    { label: 'Test', tag: '@Test', url: 'hshshs' },
    { label: 'Test', tag: '@Test', url: 'hshshs' },
    { label: 'Test', tag: '@Test', url: 'hshshs' },
    { label: 'Test', tag: '@Test', url: 'hshshs' },
  ]

  return (
    <Main>
      <Hero title={t('hero_title', { name: user.username })}/>
      <ProfileInfo user={user}/>
      <ProfileSocials socials={socials}/>
    </Main>
  )
}

export default Profile
