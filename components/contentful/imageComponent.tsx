
import { Asset } from 'contentful'
import Image from 'next/image'
import { ImageLoaderProps, ImageProps } from 'next/image'
import { contentfulLoader } from './imageLoader'


type MyImageProps = {
  image: Asset,
  className?: string,
  width?: number,
  height?: number,
  alt?: string,
  layout?: "fill" | "fixed" | "intrinsic" | "responsive" | undefined
}

export function ImageComponent(props: MyImageProps) {

  if (!props.image || !props.image.fields.file.url) {
    throw new Error("missing image");
  }

  return <Image 
    loader={contentfulLoader}
    src={props.image.fields.file.url}
    alt={props.alt ? props.alt : props.image.fields.title}
    className={props.className}
    width={props.width ?? 400} 
    height={props.height ?? 400} 
    layout={props.layout} />
}
