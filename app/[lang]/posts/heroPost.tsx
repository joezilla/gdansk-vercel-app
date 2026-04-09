import Link from 'next/link'
import Image from 'next/image'
import { normalizeContentfulImageUrl } from '../../../lib/imageUrl'
import { DateComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../../lib/contentmodel/wrappertypes';

type HeroPostProps = {
  content: IPost
  locale: string
}

export function HeroPost(props: HeroPostProps) {
  const locale = props.locale;
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={normalizeContentfulImageUrl(props.content.fields.coverImage.fields.file?.url as string)}
          alt={props.content.fields.title}
          fill
          sizes="100vw"
          priority
          className="object-cover brightness-[0.4] sepia-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-8 pb-16">
        <Link
          href={`/${locale}/posts/${props.content.fields.slug}`}
          className="group block"
        >
          <span className="inline-block px-3 py-1 bg-primary text-on-primary text-[10px] uppercase tracking-widest mb-4 font-label">
            Featured
          </span>
          <h2 className="text-4xl md:text-6xl font-headline text-white mb-4 leading-tight tracking-tight group-hover:opacity-80 transition-opacity">
            {props.content.fields.title}
          </h2>
          <span className="text-on-surface/30 text-sm font-label">
            <DateComponent dateString={props.content.fields.date} locale={locale} />
          </span>
        </Link>
      </div>
    </section>
  );
}
