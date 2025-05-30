
import { ImageLoaderProps } from 'next/image'

export const contentfulLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  }