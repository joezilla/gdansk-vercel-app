
import Image from 'next/image'
import { ImageLoaderProps, ImageProps } from 'next/image'

export const contentfulLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  }