import Container from './container'
import ColumnContainer from './column-container'
import { EXAMPLE_PATH } from '../lib/constants'
import algoliasearch from 'algoliasearch';

const letters = ["A", 'B', 'C', 'D',  'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

function sort2({streets}) {
  const hashMap = new Object();
    {streets.map(s =>
      {
      var firstLetter = s.germanName.charAt(0);
      if(!hashMap[firstLetter]) {
        hashMap[firstLetter] = new Array();
      } 
      hashMap[firstLetter].push(s); 
      }
      )}
  return(hashMap);
}
                 
export default function StreetOverviewModule({streets}) {
  var sorted = sort2({streets})
  return (
    <Container>
      <Container>
      <ul class="alphabetlist">
        {letters.map (l => <li><a href={`#alphabetlist-${l}`}>{l}</a></li> )}   
      </ul>
      </Container>
      <Container>
        {Object.keys(sorted).map( k => 
          <ColumnContainer>
          <h2 class="bigletter" id={`alphabetlist-${k}`}>{k}</h2>
          {Object.values(sorted[k]).map ( v => 
              <div><a href={`/street/${encodeURIComponent(v.germanName)}`}>{v.germanName}</a></div>
            )}
          </ColumnContainer>
        )}
      </Container>
    </Container>
  )
}

