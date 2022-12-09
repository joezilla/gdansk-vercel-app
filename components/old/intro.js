import { CMS_NAME, CMS_URL } from '../lib/constants'

export default function Intro() {
  {/*flex-col md:flex-row flex items-center md:justify-between */}
  return (
    <section className="mt-4 mb-4 md:mb-8">
      <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter leading-tight md:pr-8 dark:text-white">
       Das Alte Danzig.
      </h1>
      <h4 className="text-left text-lg dark:text-white">
      Strassen, Persönlichkeiten, Bilder.
      </h4>
    </section>
  )
}
