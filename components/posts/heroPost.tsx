/**
 * Hero post on homepage
 */
import Link from 'next/link'
import { DateComponent, ImageComponent, RichtextComponent } from '../contentful'
import { IPost } from '../../src/@types/contentful'

type HeroPostProps = {
  content: IPost
}

export function HeroPost(props: HeroPostProps) {
  return (
    <>
      <section className="bg-mybg-light dark:bg-mybg-dark pt-6">
        <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
          <a rel="noopener noreferrer" href={`/posts/${props.content.fields.slug}`} className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12">
            <img src={props.content.fields.coverImage.fields.file.url} alt="" className="object-cover w-full h-48 rounded sm:h-96 mt-6 lg:col-span-7 dark:bg-mybg-dark" />
            <div className="p-6 space-y-2 lg:col-span-5">
              <h3 className="text-2xl text-mytxt dark:text-mytxt-dark font-semibold sm:text-4xl group-hover:underline group-focus:underline">{props.content.fields.title}</h3>
              <span className="text-xs dark:text-mytxt-300"><DateComponent dateString={props.content.fields.date} /></span>
              <div className="text-mytxt dark:text-mytxt-dark md:text-base"><RichtextComponent content={props.content.fields.content} /></div>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
