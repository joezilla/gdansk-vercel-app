import { Button } from '../buttons/Button'

export type smallCardProps = {
    headline: string,
    excerpt: string,
    targetLink: string,
    imageUrl: string
}

/**
 * 
 * @param props  headline: "Headline",
    excerpt: "Excerpt blah blah blah",
    targetLink: "http://www.nytimes.com",
    imageUrl: "https://source.unsplash.com/100x100/?portrait?1"
 * @returns 
 */

export function SmallCard(props: smallCardProps) {
    return (
        <div className="max-w-md p-8 sm:flex sm:space-x-6 dark:bg-gray-900 dark:text-gray-100">
        <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-32 sm:w-32 sm:mb-0">
            <img src={props.imageUrl} alt={props.headline} className="object-cover object-center w-full h-full rounded dark:bg-gray-500" />
        </div>
        <div className="flex flex-col space-y-4">
            <div>
                <h2 className="text-2xl font-semibold">{props.headline}</h2>
            </div>
            <div className="space-y-1">
                <span className="flex items-center space-x-2 pb-4">
                    <span className="dark:text-gray-400">{props.excerpt}</span>
                </span>
                <span className="flex items-center space-x-2">
                   <Button label="Learn More"/>
                </span>
            </div>
        </div>
    </div>
    );
}