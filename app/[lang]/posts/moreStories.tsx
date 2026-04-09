import { IPost } from '../../../lib/contentmodel/wrappertypes';
import { PostCard } from '../cards/fancycard';
import { I18N } from "../../../lib/i18n";

type PostProps = {
  content: IPost[],
  locale: string
}

export function MoreStories(props: PostProps) {
  const { content, locale } = props;
  const t = new I18N(props.locale).getTranslator();
  return (
    <section className="py-24 px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
        <h2 className="text-4xl font-headline text-primary border-l-4 border-primary pl-6">
          {t("moreStories.headline")}
        </h2>
      </div>
      <div className="grid justify-center grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {content.map((post) => (
          <PostCard post={post} key={post.fields.slug} locale={locale} />
        ))}
      </div>
    </section>
  );
}
