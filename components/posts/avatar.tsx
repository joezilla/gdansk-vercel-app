import {ImageComponent} from '../contentful/imageComponent'
import { Asset } from 'contentful'


export function Avatar({ name, picture } : { name: string, picture: Asset }) {
  return (
    <div className="flex items-center">
      <div className="relative w-12 h-12 mr-4">
        <ImageComponent
          image={picture}
          layout="fill"
          className="rounded-full"
        />
      </div>
      <div className="text-xl font-bold dark:text-white">{name}</div>
    </div>
  )
}
