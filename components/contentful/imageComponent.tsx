
import { Asset } from 'contentful'
import Image from 'next/image'
import { ImageLoaderProps, ImageProps } from 'next/image'
import { contentfulLoader } from './imageLoader'
import { useState } from "react";


type MyImageProps = {
  image: Asset,
  className?: string,
  width?: number,
  height?: number,
  alt?: string,
  objectFit?: any,
  layout?: "fill" | "fixed" | "intrinsic" | "responsive" | undefined
}


export function NaturalImageComponent(props: MyImageProps) {
  const [ratio, setRatio] = useState(16 / 9) // default to 16:9

  return (
    <Image
      loader={contentfulLoader}
      src={props.image.fields.file.url}
      alt={props.alt ? props.alt : props.image.fields.title}
      className={props.className}
      width={props.width ?? 400}
      height={(props.height ?? 400) / ratio}
      // set the dimension (affected by layout)
      layout="fixed" // you can use "responsive", "fill" or the default "intrinsic"
      onLoadingComplete={({ naturalWidth, naturalHeight }) =>
        setRatio(naturalWidth / naturalHeight)
      }
    />
  )
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
    layout={props.layout}
    objectFit={props.objectFit} />
}
