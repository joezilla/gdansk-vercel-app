import Container from './container'
import ColumnContainer from './column-container'
import { EXAMPLE_PATH } from '../lib/constants'
import algoliasearch from 'algoliasearch';
import Link from 'next/link'

const letters = ["A", 'B', 'C', 'D',  'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

function sort2({streets}) {
  const hashMap = new Object();
    {streets.map(s =>
      {
      var firstLetter = s.germanName.trim().charAt(0);
      if(!hashMap[firstLetter]) {
        hashMap[firstLetter] = new Array();
      } 
      hashMap[firstLetter].push(s); 
      if(!firstLetter) {
        console.log("emmpty?");
        console.log(s);
       }
      }
      )}
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
        {Object.keys(sorted).map( k => 
          <ColumnContainer>
          <h2 class="bigletter" id={`alphabetlist-${k}`}>{k}</h2>
          {Object.values(sorted[k]).map ( v => 
              <div><Link href={`/streets/${encodeURIComponent(v.germanName)}`}>{v.germanName}</Link></div>
            )}
          </ColumnContainer>
        )}
      </Container>
    </Container>
  )
}

