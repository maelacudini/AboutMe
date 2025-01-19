import Hero from "./_components/organisms/Hero";
import { getTranslations } from 'next-intl/server';
import { getUsersWithPaginationAndFilter } from "@/utils/api/usersApi";
import Users from "./_components/organisms/Users";
import Main from "./_components/layouts/Main";

export default async function Home() {
  const t = await getTranslations("home");
  const usersAndPagination = await getUsersWithPaginationAndFilter()

  return (
    <Main>
      <Hero title={t("hero_title")} />
      <Users usersAndPagination={usersAndPagination}/>
    </Main>
  );
}
