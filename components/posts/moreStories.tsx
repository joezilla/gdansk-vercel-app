import { DateComponent } from '../contentful'
import { IPost } from '../../src/@types/contentful'

type PostProps = {
  content: IPost[]
}

// todo: make these individual card components
export function MoreStories(props: PostProps) {
  let { content } = props;
  return (
    <>
      <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
        <div className="grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.map((post) => (
            <a rel="noopener noreferrer" href={`/posts/${post.fields.slug}`} className="bg-zinc-50 max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900">
              <img role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src={post.fields.coverImage.fields.file.url} />
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">{post.fields.title}</h3>
                <span className="text-xs dark:text-gray-400"><DateComponent dateString={post.fields.date} /></span>
                <p>{post.fields.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center">
          <button type="button" className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400">Load more posts...</button>
        </div>
      </section>
    </>
  );
}