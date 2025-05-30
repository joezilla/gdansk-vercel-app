/**
 * Summary module that shows all available streets in 3 columns
 * and links to the individual street pages.
 */
import { StreetSummary } from '../../../lib/contentmodel/wrappertypes';
import Link from 'next/link'
import { createStreetURL } from '../../../lib/urlutil';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

interface BucketType {
  [key: string]: StreetSummary[]
}

// buckets the streets by alphabet and then sorts each array in the bucket
function sort2({ streets }: { streets: StreetSummary[] }) {
  const buckets = {} as BucketType;

  streets.map(s => {
    const firstLetter = s.germanName.trim().charAt(0);
    if (!buckets[firstLetter]) {
      buckets[firstLetter] = [];
    }
    buckets[firstLetter].push(s);
  }
  )
  // sort the arrays
  letters.map(l => {
    if (buckets[l]) {
      buckets[l].sort((a, b) => {
        const fa = a.germanName.toLowerCase(),
            fb = b.germanName.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    }
  })
  return (buckets);
}


type AllStreetsProps = {
  streets: StreetSummary[]
}

// todo: add i18n
export function StreetOverview(props: AllStreetsProps) {
  const streets = props.streets;
  const sorted = sort2({ streets })
  return (
    <div className="dark:bg-mybg-dark dark:text-mytxt-dark">
      <div className="dark:text-white">
        <ul className="alphabetlist dark:text-gray-200">
          {letters.map(l => <li key={`#alphabetlist-${l}`}><a href={`#alphabetlist-${l}`}>{l}</a></li>)}
        </ul>
      </div>
      <div className="w-full">
        {letters.map(k =>
          <div key={k}>
              <div className="columns-2 md:columns-3 gap-1 mt-2">
                <div className="w-64 dark:text-purple-400 pb-1"><h2 className="bigletter flex" id={`alphabetlist-${k}`}>{k}</h2></div>
                {Object.values(sorted[k] ?? []).map(v =>
                  <div key={v.sys.id} className="w-48 dark:text-gray-200">
                    <Link href={createStreetURL(v.slug)}>{v.germanName}</Link>
                  </div>
                )}
                { Object.values(sorted[k] ?? []).length === 0 &&
                  <div className="w-48 dark:text-gray-200">No streets found</div>
                }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
