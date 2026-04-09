import Image from 'next/image'
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl'
import { Button } from '../buttons/Button'

export type SmallCardProps = {
    headline: string,
    excerpt: string,
    targetLink: string,
    imageUrl: string
}

export function SmallCard(props: SmallCardProps) {
    return (
        <div className="max-w-md p-8 sm:flex sm:space-x-6 bg-surface-container-lowest text-on-surface">
        <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-32 sm:w-32 sm:mb-0">
            <Image src={normalizeContentfulImageUrl(props.imageUrl)} alt={props.headline} width={176} height={176} sizes="(max-width: 640px) 100vw, 176px" className="object-cover object-center w-full h-full rounded bg-surface-container-high" />
        </div>
        <div className="flex flex-col space-y-4">
            <div>
                <h2 className="text-2xl font-semibold">{props.headline}</h2>
            </div>
            <div className="space-y-1">
                <span className="flex items-center space-x-2 pb-4">
                    <span className="text-on-surface/60">{props.excerpt}</span>
                </span>
                <span className="flex items-center space-x-2">
                   <Button label="Learn More"/>
                </span>
            </div>
        </div>
    </div>
    );
}
