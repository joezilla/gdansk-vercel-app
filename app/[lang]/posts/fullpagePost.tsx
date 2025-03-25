import Link from 'next/link'
import { DateComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../../lib/contentmodel/wrappertypes';

type PostProps = {
    content: IPost,
    locale: string
}

export function FullpagePost(props: PostProps) {
    let { content, locale } = props;

    return (
        <article className="min-h-screen bg-mybg-light dark:bg-mybg-dark">
            {/* Hero Image Section */}
            <div className="relative h-[30vh] w-full">
                <img 
                    src={content.fields.coverImage?.fields.file?.url?.toString()}  
                    alt={content.fields.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mybg-light dark:from-mybg-dark to-transparent" />
            </div>

            {/* Content Section */}
            <div className="relative z-10 -mt-32">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    {/* Article Header */}
                    <header className="mb-12">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {content.metadata.tags.map((tag, index) => (
                                <a 
                                    key={index} 
                                    href={`/tags/${tag.sys.id}`} 
                                    className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    #{tag.sys.id}
                                </a>
                            ))}
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-mytxt dark:text-mytxt-dark">
                            {content.fields.title}
                        </h1>

                        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                            <Link 
                                locale={locale} 
                                href={`/author/${content.fields.author.fields.name}`}
                                className="hover:text-accent dark:hover:text-accent transition-colors"
                            >
                                <span>{content.fields.author.fields.name}</span>
                            </Link>
                            <span>•</span>
                            <DateComponent dateString={content.fields.date} locale={locale}/>
                        </div>
                    </header>

                    {/* Article Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <RichtextComponent content={content.fields.content} locale={locale} />
                    </div>
                </div>
            </div>
        </article>
    );
}