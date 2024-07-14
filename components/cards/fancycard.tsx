
import { IStreet, IPost, IImageWithFocalPoint } from '../../lib/contentmodel/wrappertypes';
import Image from 'next/image'

export type CardProps = {
    headline: string,
    excerpt: string,
    targetLink: string,
    imageUrl: string,
    key: string
}


export type StreetCardData = {
    street: IStreet, 
}
export function StreetCard(props: StreetCardData) {
    var p = {
        headline: props.street.fields.germanName,
        excerpt: "t",
        targetLink: "#",
        imageUrl: "#",
        key: props.street.fields.slug
    } as CardProps;
    return FancyCard(p);
}

export type PostCardData = {
    post: IPost
}
export function PostCard(props: PostCardData) {
    var p = {
        headline: props.post.fields.title,
        excerpt: props.post.fields.excerpt,
        targetLink: `/posts/${props.post.fields.slug}`, // todo: add locale
        imageUrl: props.post.fields.coverImage.fields.file?.url,
        key: props.post.fields.slug
    } as CardProps;
    return FancyCard(p);
}

//  <Link locale={locale} href={`/author/${content.fields.author.fields.name}`} rel="noopener noreferrer" className="hover:underline dark:text-accent">
// <span>{content.fields.author.fields.name}</span>
// </Link>&nbsp;on

export function FancyCard(props: CardProps) {

    // annoying, but contentful returns images with a // and no protocol
    var imageUrl ;
    if (/^(https?:).*/.test(props.imageUrl)) {        
        imageUrl = props.imageUrl;
      } else {
        imageUrl = `https:${props.imageUrl}`;        
      }      

    return (
        <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-82">            
            {/* TODO: won't work with i18n */}
            <a href={props.targetLink}>                
                {props.imageUrl &&         
                    <div className="relative h-48 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
                        <Image
                            src={`${imageUrl}`}
                            alt="Picture of the street"
                            width={500}
                            height={500}
                          />
                    </div>
                }
                <div className="p-6">
                    <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        {props.headline}
                    </h5>
                    <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
                        {props.excerpt}
                    </p>
                </div>
                {/*<div className="p-6 pt-0">
                    <button className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button">
                        Read More
                    </button>
                </div>*/}
            </a>
        </div>
    );
}