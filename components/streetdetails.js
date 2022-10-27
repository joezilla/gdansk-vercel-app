import Container from '../components/container'
import PostTitle from '../components/post-title'
import PostBody from '../components/post-body'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

// uses https://www.npmjs.com/package/react-responsive-carousel
export default function StreetDetails({ street, preview }) {
  return (
    <Container>
              <PostTitle>{street.germanName}</PostTitle>

              <table className="streetInfoTable">
                <tr>
                  <th>Strasse</th>
                  <td>{street.germanName}</td>
                </tr>
                <tr>
                  <th>Distrikt</th>
                  <td>{street.district}</td>
                </tr>
                <tr>
                  <th>Polnischer Name</th>
                  <td>{street.polishNames}</td>
                </tr>
                <tr>
                  <th>Vorherige Namen</th>
                  <td>{street.previousNames ?? "keine"}</td>
                </tr>
              </table>


              <div className="text-2xl">Geschichte</div>
              <PostBody content={street.history} />
              <div className="max-w-2xl">Quelle: {street.source}</div>

              <p />


              <h2 className="text-2xl">Bilder</h2>  
                
                {street.imagesCollection.items.length == 0 &&
                  <div>Noch keine vorhanden.</div>
                }

                <Carousel width="50%">
                {street.imagesCollection.items.map( item =>
                <div>
                  <img src={item.url} alt={item.name}></img>
                  <p className="legend">{item.name}</p>
                </div>
                
                )}
                </Carousel>

      </Container>
  )
}
