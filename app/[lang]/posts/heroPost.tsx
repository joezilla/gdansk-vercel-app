/**
 * Hero post on homepage
 */
import Link from 'next/link'
import { DateComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../../lib/contentmodel/wrappertypes';
type HeroPostProps = {
  content: IPost
  locale: string
}

export function HeroPost(props: HeroPostProps) {
  const locale = props.locale;
  return (
    <section className="relative w-full bg-mybg-light dark:bg-mybg-dark">
      <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
        <img 
          src={props.content.fields.coverImage.fields.file?.url as string} 
          alt={props.content.fields.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <Link 
          locale={props.locale} 
          href={`/posts/${props.content.fields.slug}`} 
          className="absolute inset-0 flex items-end"
        >
          <div className="w-full max-w-6xl mx-auto px-6 pb-12 sm:pb-16">
            <div className="max-w-2xl space-y-6">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white group-hover:underline">
                {props.content.fields.title}
              </h3>
              <span className="inline-block text-gray-200 text-sm">
                <DateComponent dateString={props.content.fields.date} locale={locale}/>
              </span>
              <div className="text-gray-100 line-clamp-3 sm:line-clamp-4">
                <RichtextComponent content={props.content.fields.content} locale={locale} />
              </div>
              <button className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors duration-200 ease-in-out group">
                Read More
                <svg 
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

