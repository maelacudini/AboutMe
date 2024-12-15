'use client'
import {
  motion, useScroll, useTransform 
} from "motion/react"
import Image from "next/image"

const HeroImage = ({ src } : {src: string}) => {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 0.9], [0.9, 1])

  return (
    <motion.div style={{ scale }} className="w-full h-lvh relative">
      <Image alt="Hero image" src={src} fill priority className={`object-cover`} quality={75}/>
    </motion.div>
  )
}

export default HeroImage
