import { getTranslations } from "next-intl/server";
import Main from "../_components/layouts/Main";
import Hero from "../_components/organisms/Hero";
import { getUserPublic } from "@/utils/api/userPublicApi";
import { notFound } from "next/navigation";
import { getImageWithPlaiceholder } from "@/utils/server/functions/images";
import Image from "next/image";
import { User } from "lucide-react";
import Heading from "../_components/atoms/Heading";
import { Separator } from "../_components/shadcn/separator";

export type ImageDataType = {
  img: {
    src: string;
    height: number;
    width: number;
  }
  base64: string;
}

export default async function UserPublic({ params }: {params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const t = await getTranslations("user");
  const user = await getUserPublic(slug)

  let imageData: ImageDataType | null = null
  
  if (!user) {
    notFound()
  }

  if (user.avatar) {
    const { base64, img } = await getImageWithPlaiceholder(user.avatar);

    imageData = { base64, img }
  }

  const socials = [
    { label: 'Twitter', tag: '@example', url:'' },
    { label: 'Instagram', tag: '@example', url:'' },
    { label: 'Pinterest', tag: '@example', url:'' },
    { label: 'Facebook', tag: '@example', url:'' },
    { label: 'X', tag: '@example', url:'' },
    { label: 'Snapchat', tag: '@example', url:'' },
  ]

  return (
    <Main>
      <Hero title={t("hero_title",  { name: user.username })} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square">
          {imageData ?
            <Image 
              src={imageData.img.src}
              fill
              alt="user avatar" 
              title="User avatar"
              placeholder="blur" 
              blurDataURL={imageData.base64} 
              className="aspect-square object-center object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            :
            <div className="w-96 h-96 aspect-square flex justify-center items-center bg-muted rounded-xl">
              <User height={32} width={32} />
            </div>
          }
        </div>
        <div className="space-y-4">
          <div>
            <Heading size="text-xl" tag="h4">{user.username}</Heading>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Separator />
          <p>{user.bio}</p>
          <div className="flex flex-wrap gap-4">
            {socials.map((social, i) => (
              <div key={social.label + i} className="flex">
                <div className="mr-4">
                  <p>{social.label}</p>
                  <a href={social.url} className="text-sm text-muted-foreground">{social.tag}</a>
                </div>
                <Separator orientation="vertical"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Main>
  )
}