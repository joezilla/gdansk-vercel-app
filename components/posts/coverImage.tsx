import { ImageComponent } from '../contentful'
import Link from 'next/link'
import cn from 'classnames'
import { Asset } from 'contentful'

type CoverImageProps = {
    title: string,
    asset: Asset,
    slug?: string
}

export function CoverImage(props: CoverImageProps) {
    const image = (
        <ImageComponent
            width={2000}
            height={1000}
            alt={`Cover Image for ${props.title}`}
            className={cn('shadow-small', {
                'hover:shadow-medium transition-shadow duration-200': props.slug,
            })}
            image={props.asset}
        />
    )

    return (
        <div className="sm:mx-0">
            {props.slug ? (
                <Link href={`/posts/${props.slug}`}>
                    <a aria-label={props.title}>{image}</a>
                </Link>
            ) : (
                image
            )}
        </div>
    )
}
