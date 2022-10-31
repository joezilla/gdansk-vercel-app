import { CMS_NAME, CMS_URL } from '../lib/constants'

export default function Intro() {
  {/*flex-col md:flex-row flex items-center md:justify-between */}
  return (
    <section className="mt-16 mb-16 md:mb-12">
      <h1 className="text-4xl lg:text-6xl font-bold font-bold tracking-tighter leading-tight md:pr-8">
       Das Alte Danzig.
      </h1>
      <h4 className="text-left text-lg">
      Strassen, Persönlichkeiten, Bilder.
      </h4>
    </section>
  )
}
