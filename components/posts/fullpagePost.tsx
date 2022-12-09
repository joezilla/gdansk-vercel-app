import Link from 'next/link'
import { DateComponent, ImageComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../src/@types/contentful'

type PostProps = {
    content: IPost
}

export function FullpagePost(props: PostProps) {
    let { content } = props;

    return (
        <>
            <article className="max-w-2xl px-4 py-24 mx-auto space-y-16 dark:bg-gray-800 dark:text-gray-50">
                <div className="w-full mx-auto space-y-4">
                    <h1 className="text-5xl font-bold leading-none">{content.fields.title}</h1>
                    <div className="flex flex-wrap space-x-2 text-sm dark:text-gray-400">
                        {content.metadata.tags.map((tag, index) => (
                            <a rel="noopener noreferrer" href={`/tags/${tag}`} className="p-1 hover:underline">#{tag}</a>
                        ))}
                    </div>
                    <p className="text-sm dark:text-gray-400 space-x-1">by&nbsp;
                    <a href={`/author/${content.fields.author.fields.name}`} rel="noopener noreferrer" className="hover:underline dark:text-violet-400">
                            <span>{content.fields.author.fields.name}</span>
                        </a>&nbsp;on
                        <DateComponent dateString={content.fields.date} />
                    </p>
                </div>
                <div className="dark:text-gray-100">
                   <RichtextComponent content={content.fields.content}/>
                </div>
            </article>
        </>
    );
}