import Heading from "../atoms/Heading"

export interface HeroPropsType {
  title: string
}

const Hero = (props: HeroPropsType) => {
  const { title } = props

  return (
    <section className="h-[80lvh] w-full flex items-end">
      <Heading size="text-8xl" tag="h1">{title}</Heading>
    </section>
  )
}

export default Hero
