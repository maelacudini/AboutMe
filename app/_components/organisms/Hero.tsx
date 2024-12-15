import Heading from "../atoms/Heading"

export interface HeroPropsType {
    title: string
}

const Hero = (props: HeroPropsType) => {
  const { title } = props


  return (
    <div className="h-[80lvh] w-full flex items-end">
      <Heading size="text-7xl" tag="h1">{title}</Heading>
    </div>
  )
}

export default Hero
