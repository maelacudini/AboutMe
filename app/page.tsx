import Hero from "./_components/organisms/Hero";
import Main from "./_components/layouts/Main";
import { getTranslations } from 'next-intl/server';
import { getUsersWithPaginationAndFilter } from "@/utils/api/usersApi";
import Users from "./_components/organisms/Users";

export default async function Home() {
  const t = await getTranslations("home");
  const usersAndPagination = await getUsersWithPaginationAndFilter(1)

  return (
    <Main>
      <Hero title={t("hero_title")} />
      <Users usersAndPagination={usersAndPagination}/>
    </Main>
  );
}
