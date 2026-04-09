import Link from 'next/link'
import Image from 'next/image'
import { DateComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../../lib/contentmodel/wrappertypes';
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl';
import { createPostURL } from '../../../lib/urlutil';
import { I18N } from '../../../lib/i18n';

type PostProps = {
    content: IPost,
    locale: string,
    relatedPosts?: IPost[]
}

export function FullpagePost(props: PostProps) {
    const { content, locale, relatedPosts } = props;
    const i18n = new I18N(locale).getTranslator();
    const coverImageUrl = content.fields.coverImage?.fields?.file?.url as string;

    return (
        <article>
            {/* Centered header */}
            <header className="mb-16">
                <div className="flex flex-col items-center text-center mb-12">
                    {/* Category + Date */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {content.metadata.tags.map((tag, index) => (
                            <span key={index} className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                                {tag.sys.id}
                            </span>
                        ))}
                        {content.metadata.tags.length > 0 && (
                            <span className="text-on-surface/30">&bull;</span>
                        )}
                        <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                            <DateComponent dateString={content.fields.date} locale={locale} />
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-on-surface tracking-tighter leading-tight max-w-4xl">
                        {content.fields.title}
                    </h1>
                </div>

                {/* Hero image below title */}
                {coverImageUrl && (
                    <>
                        <div className="relative w-full aspect-[21/9] overflow-hidden rounded shadow-2xl">
                            <Image
                                src={normalizeContentfulImageUrl(coverImageUrl)}
                                alt={content.fields.title}
                                fill
                                sizes="100vw"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
                        </div>
                        {content.fields.coverImage?.fields?.description && (
                            <p className="mt-4 text-sm text-on-surface/50 font-label italic flex items-center gap-2">
                                {content.fields.coverImage.fields.description as string}
                            </p>
                        )}
                    </>
                )}
            </header>

            {/* Content area with optional left icon bar */}
            <div className="flex flex-col md:flex-row gap-16 lg:gap-24 relative">
                {/* Content column */}
                <div className="flex-1 max-w-3xl mx-auto">
                    {/* Lead paragraph / excerpt */}
                    {content.fields.excerpt && (
                        <p className="font-headline text-2xl md:text-3xl text-on-surface/60 leading-relaxed mb-12 italic border-l-4 border-primary pl-8">
                            {content.fields.excerpt}
                        </p>
                    )}

                    {/* Author byline */}
                    <div className="flex items-center gap-3 mb-12 text-sm text-on-surface/50">
                        <span>by</span>
                        <Link
                            href={`/author/${content.fields.author.fields.name}`}
                            className="text-tertiary underline underline-offset-4 decoration-tertiary/20 hover:decoration-tertiary transition-colors"
                        >
                            {content.fields.author.fields.name}
                        </Link>
                    </div>

                    {/* Rich text body */}
                    <div className="space-y-8 text-lg text-on-surface leading-[1.8]">
                        <RichtextComponent content={content.fields.content} locale={locale} />
                    </div>

                    {/* Keywords / tags footer */}
                    {content.metadata.tags.length > 0 && (
                        <div className="mt-20 pt-8 border-t border-outline-variant/30 flex flex-wrap gap-4 items-center">
                            <span className="text-sm font-label uppercase tracking-widest text-on-surface/50">Keywords:</span>
                            {content.metadata.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-on-surface/60 uppercase"
                                >
                                    {tag.sys.id}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Archives */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className="mt-32">
                    <h2 className="font-headline text-3xl mb-12 border-b border-outline-variant/30 pb-4">
                        {i18n('post.relatedArchives')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {relatedPosts.slice(0, 3).map(post => {
                            const postImage = post.fields.coverImage?.fields?.file?.url as string;
                            return (
                                <Link
                                    key={post.fields.slug}
                                    href={createPostURL(post.fields.slug, locale)}
                                    className="group"
                                >
                                    {postImage && (
                                        <div className="aspect-[4/3] overflow-hidden mb-4 rounded-lg bg-surface-container-high max-h-48">
                                            <Image
                                                src={normalizeContentfulImageUrl(postImage)}
                                                alt={post.fields.title}
                                                width={400}
                                                height={500}
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                            />
                                        </div>
                                    )}
                                    {post.metadata.tags?.[0] && (
                                        <span className="text-xs font-label text-primary uppercase tracking-widest">
                                            {post.metadata.tags[0].sys.id}
                                        </span>
                                    )}
                                    <h3 className="font-headline text-xl mt-2 group-hover:text-primary transition-colors">
                                        {post.fields.title}
                                    </h3>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </article>
    );
}
