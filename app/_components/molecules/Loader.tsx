import { LoaderCircle } from "lucide-react"

export const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <LoaderCircle height={16} width={16} className="animate-spin"/>
    </div>
  )
}
