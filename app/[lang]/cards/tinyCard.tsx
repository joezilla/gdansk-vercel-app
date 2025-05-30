
export type TinyCardProps = {
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

export function TinyCard(props: TinyCardProps) {
    return (
        <div className="max-w-md p-8 sm:flex sm:space-x-6 dark:bg-gray-900 dark:text-gray-100">
        <div className="flex flex-col space-y-4">
            <div>
                <h2 className="text-2xl font-semibold">{props.headline}</h2>
            </div>
            <div className="space-y-1">
                <span className="flex items-center space-x-2 pb-4">
                    <span className="dark:text-gray-400">{props.excerpt}</span>
                </span>
            </div>
        </div>
    </div>
    );
}