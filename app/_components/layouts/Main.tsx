import { cn } from "@/utils/fn";
import {
  DetailedHTMLProps, HTMLAttributes, ReactNode 
} from "react"

export interface MainPropsType extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  children: ReactNode,
}

const Main = (props: MainPropsType) => {
  const { className, children } = props;

  return (
    <main className={cn("flex flex-col gap-4 m-4", className)}>
      {children}
    </main>
  )
}

export default Main
