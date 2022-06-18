import { useState, useEffect } from 'react';
import Axios from 'axios';

//React leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
} from 'react-leaflet';

// leaflet
import { Icon } from 'leaflet';

// MUI
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';

//Map Icons
import apartmentIconPng from '../Assets/MapIcons/apartment.png';
import houseIconPng from '../Assets/MapIcons/house.png';
import officeIconPng from '../Assets/MapIcons/office.png';

// Assets
import './Listings.css';
import polygonOne from './Shape';

function Listings() {
  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });

  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });

  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });
  const [latitude, setLatitude] = useState(22.643389171984662);
  const [longitiude, setLongitiude] = useState(88.43367821647634);

  const polyOne = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ];

  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function getAllListings() {
      try {
        const response = await Axios.get(
          'http://localhost:8000/api/listings/',
          { cancelToken: source.token }
        );
        setAllListings(response.data);
        setDataIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    }
    getAllListings();

    return () => source.cancel();
  }, []);

  if (dataIsLoading === false) console.log(allListings[0].location);

  if (dataIsLoading === true)
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Grid>
    );
  return (
    <Grid container>
      <Grid item xs={4}>
        {allListings.map((listing) => (
          <Card key={listing.id} className='cardStyle'>
            <CardHeader title={listing.title} />
            <CardMedia
              component='img'
              image={listing.picture1}
              alt={listing.title}
              className='pictureStyle'
            />
            <CardContent>
              <Typography variant='body2'>
                {listing.description.substring(0, 200)}...
              </Typography>
            </CardContent>

            {listing.property_status === 'Sale' ? (
              <Typography className='priceOverlay'>
                {listing.listing_type}: $
                {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Typography>
            ) : (
              <Typography className='priceOverlay'>
                {listing.listing_type}: $
                {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                / {listing.rental_frequency}
              </Typography>
            )}
          </Card>
        ))}
      </Grid>
      <Grid item xs={8} className='mapStyle'>
        <AppBar position='sticky'>
          <div style={{ height: '100vh' }}>
            <MapContainer
              center={[latitude, longitiude]}
              zoom={14}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />

              <Polyline positions={polyOne} weight={10} color='green' />
              <Polygon
                positions={polygonOne}
                color='yellow'
                fillColor='blue'
                fillOpacity='0.9'
                opacity='0'
              />
              {allListings.map(function (listing) {
                function IconDisplay(listing) {
                  if (listing.listing_type === 'Apartment')
                    return apartmentIcon;

                  if (listing.listing_type === 'House') return houseIcon;

                  if (listing.listing_type === 'Office') return officeIcon;
                }

                return (
                  <Marker
                    key={listing.id}
                    icon={IconDisplay(listing)}
                    position={[
                      listing.location.coordinates[0],
                      listing.location.coordinates[1],
                    ]}
                  >
                    <Popup>
                      <Typography variant='h5'>{listing.title}</Typography>
                      <img
                        src={listing.picture1}
                        style={{ height: '14rem', width: '18rem' }}
                        alt={`listed ${listing.listing_type}`}
                      />
                      <Typography variant='body1'>
                        {listing.description.substring(0, 150)}...
                      </Typography>
                      <Button variant='contained' fullWidth>
                        Details
                      </Button>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Listings;
