
import { IStreet, IPost } from '../../../lib/contentmodel/wrappertypes';
import Image from 'next/image'
import { createStreetURL, createPostURL } from '../../../lib/urlutil';
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl';

export type CardProps = {
    headline: string,
    excerpt: string,
    targetLink: string,
    imageUrl: string,
    key: string,
    locale: string,
    skipImage?: boolean
}

export type StreetCardData = {
    street: IStreet,
    locale: string
}
export function StreetCard(props: StreetCardData) {
    const p = {
        headline: props.street.fields.germanName,
        excerpt: "t",
        targetLink: createStreetURL(props.street.fields.slug, props.locale),
        imageUrl: "#",
        key: props.street.fields.slug,
        locale: props.locale
    } as CardProps;
    return FancyCard(p);
}

export type PostCardData = {
    post: IPost,
    locale: string
}
export function PostCard(props: PostCardData) {
    const p = {
        headline: props.post.fields.title,
        excerpt: props.post.fields.excerpt,
        targetLink: createPostURL(props.post.fields.slug, props.locale),
        imageUrl: props.post.fields.coverImage.fields.file?.url,
        key: props.post.fields.slug,
        locale: props.locale
    } as CardProps;
    return FancyCard(p);
}

export function FancyCard(props: CardProps) {
    const imageUrl = normalizeContentfulImageUrl(props.imageUrl);
    return (
        <a href={props.targetLink} className="group relative flex flex-col bg-surface-container-lowest editorial-shadow overflow-hidden transition-all duration-300 hover:shadow-md">
            {!props.skipImage && props.imageUrl && (
                <div className="relative h-56 overflow-hidden">
                    <Image
                        src={`${imageUrl}`}
                        alt={props.headline}
                        width={500}
                        height={500}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            )}
            <div className="p-6 flex-1">
                <h3 className="text-lg font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {props.headline}
                </h3>
                <p className="text-sm text-on-surface/60 leading-relaxed">
                    {props.excerpt}
                </p>
            </div>
        </a>
    );
}
