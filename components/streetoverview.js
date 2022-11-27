import Container from './container'
import ColumnContainer from './column-container'
import { EXAMPLE_PATH } from '../lib/constants'
import algoliasearch from 'algoliasearch';
import Link from 'next/link'

const letters = ['A', 'B', 'C', 'D',  'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// buckets the streets by alphabet and then sorts each array in the bucket
function sort2({streets}) {
  const hashMap = new Object();
    {streets.map(s =>
      {
        var firstLetter = s.germanName.trim().charAt(0);
        if(!hashMap[firstLetter]) {
          hashMap[firstLetter] = new Array();
        } 
        hashMap[firstLetter].push(s); 
      }
      )}
      // sort the arrays
      letters.map(l=> {
        if (hashMap[l]) {
          hashMap[l].sort((a,b) => {
            let fa = a.germanName.toLowerCase(),
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
  return(hashMap);
}
                 
export default function StreetOverviewModule({streets}) {
  var sorted = sort2({streets})
  return (
    <div>
      <div className="dark:text-white">
      <ul className="alphabetlist dark:text-gray-200">
        {letters.map (l => <li key={`#alphabetlist-${l}`}><a href={`#alphabetlist-${l}`}>{l}</a></li> )}   
      </ul>
      </div>
      <div>
        {letters.map (k => 
          <div key={k}>
            <div className="relative flex streetGrid">
            <div className="columns-2 md:columns-3 gap-1">
              <div className="w-64 dark:text-violet-400"><h2 className="bigletter flex" id={`alphabetlist-${k}`}>{k}</h2></div>
                {Object.values(sorted[k] ?? new Array).map ( v => 
                  <div key={v.sys.id} className="w-64 dark:text-gray-200"><Link href={`/streets/${encodeURIComponent(v.germanName)}`}>{v.germanName}</Link></div>
                )}
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





  {/* old code
        <ColumnContainer>
         <h2 class="bigletter" id={`alphabetlist-${k}`}>{k}</h2>
         {Object.values(sorted[k] ?? new Array).map ( v => 
          <div><Link href={`/streets/${encodeURIComponent(v.germanName)}`}>{v.germanName}</Link></div>
          )}
         </ColumnContainer>
        )}
         */}