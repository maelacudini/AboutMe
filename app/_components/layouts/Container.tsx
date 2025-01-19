import { cn } from "@/utils/functions";
import {
  DetailedHTMLProps, HTMLAttributes, ReactNode 
} from "react"

export interface ContainerPropsType extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  children: ReactNode,
}

const Container = (props: ContainerPropsType) => {
  const { className, children } = props;

  return (
    <div className={cn("flex flex-col gap-8 items-center p-4", className)}>
      {children}
    </div>
  )
}

export default Container
