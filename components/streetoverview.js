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
          console.log("sorting")
        } else { console.log ("not sorting " + l) }
      })
  return(hashMap);
}
                 
export default function StreetOverviewModule({streets}) {
  var sorted = sort2({streets})
  return (
    <Container>
      <Container>
      <ul className="alphabetlist">
        {letters.map (l => <li><a href={`#alphabetlist-${l}`}>{l}</a></li> )}   
      </ul>
      </Container>
      <Container>
      {letters.map (k => 
        <ColumnContainer>
         <h2 class="bigletter" id={`alphabetlist-${k}`}>{k}</h2>
         {Object.values(sorted[k] ?? new Array).map ( v => 
          <div><Link href={`/streets/${encodeURIComponent(v.germanName)}`}>{v.germanName}</Link></div>
          )}
         </ColumnContainer>
        )}
        
      </Container>
    </Container>
  )
}

