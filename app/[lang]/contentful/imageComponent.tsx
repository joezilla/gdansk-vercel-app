'use client';

import { Asset } from 'contentful'
import Image from 'next/image'
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl';
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

  const fileUrl = normalizeContentfulImageUrl(
    (props.image.fields.file ? props.image.fields.file.url : undefined) as string | undefined
  );
  const altTag = ( props.alt ? props.alt : props.image.fields.title ) as string;

  return (
    <Image
      src={fileUrl}
      alt={altTag}
      className={props.className}
      width={props.width ?? 400}
      height={(props.height ?? 400) / ratio}
      sizes="(max-width: 768px) 100vw, 50vw"
      onLoad={(event) => {
        const target = event.target as HTMLImageElement;
        if (target.naturalWidth && target.naturalHeight) {
          setRatio(target.naturalWidth / target.naturalHeight)
        }
      }}
    />
  )
}
