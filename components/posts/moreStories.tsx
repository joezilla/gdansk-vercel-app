import { DateComponent } from '../contentful'
import { IPost } from '../../lib/contentmodel/wrappertypes';
import { PostCard } from '../cards/fancycard';

type PostProps = {
  content: IPost[],
  locale: string
}

// todo: make these individual card components
export function MoreStories(props: PostProps) {
  let { content, locale } = props;
  return (
    <>
      <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <h2 className="text-center text-xl font-bold">Resources</h2>
        <div className="grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.map((post) => (
            <PostCard post={post} />             
          ))}
        </div>
        
        {/*content.length > 3 &&
          <div className="flex justify-center">
            <button type="button" className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400">Load more posts...</button>
          </div>
        } */}
      </section>
    </>
  );
}