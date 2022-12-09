/**
 * Hero post on homepage
 */
import Link from 'next/link'
import  { DateComponent, ImageComponent } from '../contentful'
import { IPost } from '../../src/@types/contentful'

type HeroPostProps = {
    content: IPost
}

export function HeroPost(props : HeroPostProps) {
  return (
    <a rel="noopener noreferrer" href={`/posts/${props.content.fields.slug}`} className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-900">
      <ImageComponent image={props.content.fields.coverImage} 
      className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
      width={2000} />
      <div className="p-6 space-y-2 lg:col-span-5">
        <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">{props.content.fields.title}</h3>
        <span className="text-xs dark:text-gray-400"><DateComponent dateString={props.content.fields.date} /></span>
        <p>{props.content.fields.excerpt}</p>
      </div>
    </a>
  );``
}