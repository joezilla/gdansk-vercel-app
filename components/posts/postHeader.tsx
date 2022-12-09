import { Avatar } from './avatar'
import { DateComponent } from '../contentful/dateComponent'
import { CoverImage } from './coverImage'
import { PostTitle } from './postTitle'
import { IPost } from '../../src/@types/contentful'


export function PostHeader(post: IPost) {
  return (
    <>
      <PostTitle>{post.fields.title}</PostTitle>
      <div className="hidden md:block md:mb-12 dark:text-white">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} asset={coverImage.url} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6 dark:text-white">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        {/*<div className="mb-6 text-lg">
          <DateComponent dateString={date} />
        </div>*/}
      </div>
    </>
  )
}
