
import Image from 'next/image'
import { ImageLoaderProps, ImageProps } from 'next/image'

export const contentfulLoader = ({ src, width, quality }: ImageLoaderProps) => {
    console.log(`*** contentfulLoader: ${src} ${width} ${quality}`);
    return `${src}?w=${width}&q=${quality || 75}`;
  }