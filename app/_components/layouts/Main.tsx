import { cn } from "@/utils/functions";
import {
  DetailedHTMLProps, HTMLAttributes, ReactNode 
} from "react"

export interface MainPropsType extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  children: ReactNode,
}

const Main = (props: MainPropsType) => {
  const { className, children } = props;

  return (
    <main className={cn("flex flex-col gap-8 my-0 mx-auto p-4 max-w-screen-xl", className)}>
      {children}
    </main>
  )
}

export default Main
