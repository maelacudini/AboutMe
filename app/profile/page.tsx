import Heading from "../_components/atoms/Heading";
import { ProfileInfo } from "../_components/organisms/ProfileInfo";
import { getUser } from "@/utils/api/userApi";
import Hero from "../_components/organisms/Hero";
import { getTranslations } from "next-intl/server";
import { ProfileSocials } from "../_components/organisms/ProfileSocials";
import { ProfileDelete } from "../_components/organisms/ProfileDelete";
import Main from "../_components/layouts/Main";

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

  return (
    <Main>
      <Hero title={t('hero_title', { name: user.username })}/>
      <ProfileInfo user={user}/>
      <ProfileSocials socials={user.socials}/>
      <ProfileDelete />
    </Main>
  )
}

export default Profile
