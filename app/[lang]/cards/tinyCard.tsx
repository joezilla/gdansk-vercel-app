import { Button } from '../buttons/Button'

export type TinyCardProps = {
    headline: string,
    excerpt: string,
    targetLink: string,
    imageUrl: string
}

export function TinyCard(props: TinyCardProps) {
    return (
        <div className="max-w-md p-8 sm:flex sm:space-x-6 bg-surface-container-lowest text-on-surface">
        <div className="flex flex-col space-y-4">
            <div>
                <h2 className="text-2xl font-semibold">{props.headline}</h2>
            </div>
            <div className="space-y-1">
                <span className="flex items-center space-x-2 pb-4">
                    <span className="text-on-surface/60">{props.excerpt}</span>
                </span>
            </div>
        </div>
    </div>
    );
}
