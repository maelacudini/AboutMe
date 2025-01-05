import {
  Alert, AlertDescription, AlertTitle, 
  alertVariants
} from '../shadcn/alert'
// eslint-disable-next-line import/named
import { VariantProps } from 'class-variance-authority'
import {
  Info, TriangleAlert 
} from 'lucide-react'

export interface CustomAlertProps extends VariantProps<typeof alertVariants> {
  title: string,
  description?: string | undefined
}

const CustomAlert = (props: CustomAlertProps) => {
  const { variant = 'default', title, description } = props;

  return (
    <Alert variant={variant}>
      {variant === 'default' ? <Info height={16} width={16} /> : <TriangleAlert height={16} width={16} />}
      <div className='space-y-1'>
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </div>
    </Alert>
  )
}

export default CustomAlert