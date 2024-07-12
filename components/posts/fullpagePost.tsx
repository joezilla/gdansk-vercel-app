import Link from 'next/link'
import { DateComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../lib/contentmodel/wrappertypes';

type PostProps = {
    content: IPost,
    locale: string
}

export function FullpagePost(props: PostProps) {
    let { content, locale } = props;

    return (
        <>
            <article className="max-w-5xl px-4 pt-16 mx-auto space-y-2 bg-mybg-light dark:bg-mybg-dark">
                <div className="w-full mx-auto space-y-4 text-mytxt dark:text-mytxt-dark">
                    <h1 className="text-5xl font-bold leading-none mx-0">{content.fields.title}</h1>
                    <div className="flex flex-wrap space-x-2 text-sm dark:text-gray-400">
                        {content.metadata.tags.map((tag, index) => (
                            <a rel="noopener noreferrer" key={index} href={`/tags/${tag.sys.id}`} className="p-1 hover:underline"><span>#{tag.sys.id}</span></a>
                        ))}
                    </div>
                    <p className="text-sm dark:text-gray-400 space-x-1">by&nbsp;
                        <Link locale={locale} href={`/author/${content.fields.author.fields.name}`} rel="noopener noreferrer" className="hover:underline dark:text-accent">
                            <span>{content.fields.author.fields.name}</span>
                        </Link>&nbsp;on
                        <DateComponent dateString={content.fields.date} locale={locale}/>
                    </p>
                </div>
                <div className="dark:text-gray-100 m-0">
                    <RichtextComponent content={content.fields.content} locale={locale} />
                </div>
            </article>
        </>
    );
}