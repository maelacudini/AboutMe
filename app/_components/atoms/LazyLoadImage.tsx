import { generateBlurDataURL } from "@/utils/server/functions/images";
import Image, { ImageProps } from "next/image"

export interface LazyLoadImagePropsType extends ImageProps {}

// USE THIS ONLY ON SERVER SIDE COMPONENTS
const LazyLoadImage = async (props: LazyLoadImagePropsType) => {
  const { src, alt, ...rest } = props;

  const base64 = await generateBlurDataURL(src);

  return (
    <Image {...rest} src={src} alt={alt} loading="lazy" placeholder="blur" blurDataURL={base64} />
  )
}

export default LazyLoadImage
