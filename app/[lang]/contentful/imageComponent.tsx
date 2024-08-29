'use client';

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

  const fileUrl = (props.image.fields.file ? props.image.fields.file.url : "no_url") as string;
  const altTag = ( props.alt ? props.alt : props.image.fields.title ) as string;

  return (
    <Image
      loader={contentfulLoader}
      src={fileUrl}  
      alt={altTag}
      className={props.className}
      width={props.width ?? 400}
      height={(props.height ?? 400) / ratio}
      onLoad={(event) => {
        const target = event.target as HTMLImageElement;
        if (target.naturalWidth && target.naturalHeight) {
          setRatio(target.naturalWidth / target.naturalHeight)
        }
      }}
      // Remove the layout prop as it's no longer supported
    />
  )
}

export function ImageComponent(props: MyImageProps) {

  if (!props.image || !props.image.fields.file || !!props.image.fields.file.url) {
    throw new Error("missing image");
  }

  const fileUrl = (props.image.fields.file ? props.image.fields.file.url : "no_url") as string;
  const altTag = ( props.alt ? props.alt : props.image.fields.title ) as string;

  return <Image
    loader={contentfulLoader}
    src={fileUrl}  
    alt={altTag}
    className={props.className}
    width={props.width ?? 400}
    height={props.height ?? 400}
    layout={props.layout}
    objectFit={props.objectFit} />
}
